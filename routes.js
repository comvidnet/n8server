
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



    var rm2 = [];
    rm2.push({
        location: 'user',
        type: 'museum',
        time: 30,
        next: 'Rembrandt House Museum'
    });
    rm2.push({
        location: 'Museum Het Rembrandhuis',
        type: 'museum',
        time: 60,
        next: 'Het Scheepvaartmuseum'
    });
    rm2.push({
        location: 'Het Scheepvaartmuseum',
        type: 'food',
        time: 60,

        next: 'Openbare Bibliotheek Amsterdam',
    });
    //rm2.push({
    //    location: 'Hannekes Boom',
    //    type: 'architecture',
    //    time: 15,
    //    next: 'Openbare Bibliotheek Amsterdam'
    //});
    //rm2.push({
    //    location: 'Openbare Bibliotheek Amsterdam Oosterdokskade',
    //    type: 'museum',
    //    time: 60,
    //    next: 'Eye Filmmuseum',
    //});
    rm2.push({
        location: 'Eye Filmmuseum',
        type: 'architecture',
        time: 60,
        next: 'Bimhuis',});
    rm2.push({
        location: 'Bimhuis',
        type: 'drink',
        time: 90,
        next: 'Delirium Café Amsterdam'
    });



    routes.push({
        time: 375,
        route: rm2
    });
    return routes;
}

