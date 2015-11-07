var express = require('express');
var mqtt    = require('mqtt');
var moment  = require('moment');
var _ = require('lodash');

var routes = require('./routes.js').routeData();

var app = express();

var museums = [];

museums.push({
    id: 'rijks',
    location: 'Rijksmuseum Amsterdam',
    time: 120,
    open: 17
})

museums.push({
    id: 'annef',
    location: 'Anne Frank Amsterdam',
    time: 60,
    open: 22
})
museums.push({
    id: 'hermitage',
    location: 'Hermitage',
    time: 120,
    open: 17
})
museums.push({
    id: 'vang',
    location: 'Van Gog Museum',
    time: 120,
    open: 17
})
var client  = mqtt.connect('mqtt://dev.ibeaconlivinglab.com');


function getBestTime(time, museum) {
    var currentHour = time.hour();
    if(museum.queue) {
        museum.queue.prognosis['h' + currentHour].number = museum.queue.queuelength;
        var queue = _.filter(museum.queue.prognosis, function (data, hour) {
            if (parseInt(hour.substring(1)) >= currentHour) {
                data.hour = parseInt(hour.substring(1));
                return data;
            }
        });
        if (queue) {
            return _.min(queue, function (data) {
                return data.percent;
            });
        }
    }
}
client.on('connect', function () {
    console.log("Connect");
    client.subscribe('/n8/queue/rijks');
    client.subscribe('/n8/queue/annef');
    client.subscribe('/n8/queue/hermitage');
    client.subscribe('/n8/queue/vang');
    //client.publish('presence', 'Hello mqtt');
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    var data = JSON.parse(message);
    var m = _.find(museums, {id: data.m });
    m.queue = data;
});


app.get('/getRoute', function (req, res) {
    var loc = 'Rijksmuseum Amsterdam';
    if(req.param('loc'))
        loc = req.param('loc');
    var m = _.find(museums, {location: loc});
    if(!m)
        return res.json({err: 'Invalid location'});
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //var currentTime = moment('2015-11-07 9:30');
    var currentTime = moment();
    var route = {};
    route.museum = {
        location: m.location

    };
    if(m.queue) {
        route.museum.queuelength = m.queue.queuelength;
    }

    route.time = getBestTime(currentTime, m);

    if(route.time) {
        var timeLeftBefore = (route.time.hour - currentTime.hour()) * 60;
        var timeAfter = (m.open - (route.time.hour + (m.time/60) ) ) * 60;

        var availableRoutes = _.filter(routes, function (route) {
            if (route.time < timeLeftBefore)
                return route;
        })
        //Make route before
        if (availableRoutes.length > 0) {
            route.route = _.max(availableRoutes,'time');
            //Add museum at end
            route.route.route[route.route.route.length-1].next = m.location;
        }
        else { //Route after the museum
            var availableRoutesAfter = _.filter(routes, function (route) {
                if (route.time < timeAfter)
                    return route;
            })
            if (availableRoutesAfter.length > 0) {
                route.route = _.max(availableRoutesAfter, function (route) {
                    route.time;
                })
                //Add museum at beginning
                route.route.route.splice(1, 0, {
                    location: m.location,
                    next: route.route.route[0].next
                });
                route.route.route[0].next = m.location;


            }
            else { //No route just museum
                route.route = {
                    route:[{
                        location: 'user',
                        type: 'user',
                        time: 2,
                        latitude: 1,
                        longitude: 2,
                        next: route.museum.location
                    }]
                }
            }
        }
    }
    else {
        route.route = {
            route: [{
                location: 'user',
                type: 'user',
                time: 2,
                latitude: 1,
                longitude: 2,
                next: route.museum.location
            }]
        };
    }

    //route.route = routes[0];


    res.json(route);
});
app.use('/img', express.static(__dirname + '/img'));

var server = app.listen(3000, function () {
    var host = 'localhost';
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});