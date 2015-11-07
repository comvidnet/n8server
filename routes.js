
exports.routeData = function() {

    var routes = [];


    var rm = [];
    rm.push({
        location: 'user',
        type: 'user',
        time: 2,
        next: 'Artis Amsterdam'
    });
    rm.push({
        location: 'Artis Amsterdam',
        type: 'food',
        time: 60,
        next: 'Tropenmuseum Amsterdam'
    });
    rm.push({
        location: 'Tropenmuseum Amsterdam',
        type: 'museum',
        time: 75,
        travel: 'public',
        next: 'Hermitage Amsterdam'
    });
    rm.push({
        location: 'Hermitage Amsterdam',
        type: 'museum',
        time: 90,
        next: 'Rijksmuseum Amsterdam'
    });

    routes.push({
        time: 270,
        route: rm
    });
    return routes;
}

