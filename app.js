var express = require('express');
var mqtt    = require('mqtt');
var moment  = require('moment');
var _ = require('lodash');

var routes = require('./routes.js').routeData();

var app = express();

var museums = [];

museums.push({
    location: 'Rijksmuseum Amsterdam',
    time: 120,
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
    //client.publish('presence', 'Hello mqtt');
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    var data = JSON.parse(message);
    museums[0].queue = data;
});


app.get('/getRoute', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //var currentTime = moment('2015-11-07 9:30');
    var currentTime = moment();
    var route = {};
    route.museum = {
        location: museums[0].location
    };

    route.time = getBestTime(currentTime, museums[0]);

    if(route.time) {
        var timeLeftBefore = (route.time.hour - currentTime.hour()) * 60;
        var timeAfter = (17 - (route.time.hour + 2)) * 60;

        var availableRoutes = _.filter(routes, function (route) {
            if (route.time > timeLeftBefore)
                return route;
        })
        //Make route before
        if (availableRoutes.length > 0) {
            route.route = _.max(availableRoutes,'time');
        }
        else { //Route after the museum
            var availableRoutesAfter = _.filter(routes, function (route) {
                if (route.time > timeAfter)
                    return route;
            })
            if (availableRoutesAfter.length > 0) {
                route.route = _.max(availableRoutesAfter, function (route) {
                    route.time;
                })
            }
            else { //No route just museum
                route.route = [{
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
    else {
        route.route = [{
            location: 'user',
            type: 'user',
            time: 2,
            latitude: 1,
            longitude: 2,
            next: route.museum.location
        }];
    }

    //route.route = routes[0];


    res.json(route);
});

var server = app.listen(3000, function () {
    var host = 'localhost';
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});