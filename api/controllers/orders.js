'use strict';
var q = require('q');
var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

module.exports = {
    orders: orders
};

var getCoords = function(zipCode) {
    var deferred = q.defer();
    var NodeGeocoder = require('node-geocoder');

    var options = {
        provider: 'google',

        // Optional depending on the providers 
        httpAdapter: 'https', // Default 
        apiKey: 'AIzaSyCT65N6riWxnR5nUkqRnfOx0dTPBo_Eb2Q', // for Mapquest, OpenCage, Google Premier 
        formatter: null // 'gpx', 'string', ... 
    };

    var geocoder = NodeGeocoder(options);

    geocoder.geocode(zipCode).then(
            function(geoCodedResult) {
                // Success!
                console.log("geoCodedResults", geoCodedResult);
                deferred.resolve(geoCodedResult);
            })
        .catch(function(err) {
            console.log(err);
        });
    return deferred.promise;
};

function orders(req, res) {


    // Reqlize that req.account gets set in app when token is verified and account is retrieved.
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var zipCode = "47150";
    if (req.swagger.params.zipCode.value) {
        zipCode = req.swagger.params.zipCode.value;
    } else {
        zipCode = req.account.zip;
    }

    //'no zip given';
    // If no radius is given, then default to 30 miles.
    var radius = 30;
    if (req.swagger.params.radius.value) {
        radius = req.swagger.params.radius.value;
    } else {
        radius = req.account.defaultMileRadiusForAutoAcceptReject;
    }
    var radius = radius * 1609.34;

    console.log("zipCode: ", zipCode);
    console.log("radius: ", radius);

    // get Coordinates of Zip Code
    getCoords(zipCode).then(
        function(geoCodedResult) {
            console.log('Orders.GeoCodeResult: ', geoCodedResult);
            var lookupCoords = [geoCodedResult[0].longitude, geoCodedResult[0].latitude];

            // Remember to create the indexes required.
            // db.orders.createIndex( { toLoc : "2dsphere" } )
            // db.orders.createIndex( { fromLoc : "2dsphere" } )

            // Look it up!
            var query = { toLoc: { $near: { $geometry: { type: 'Point', coordinates: lookupCoords }, $maxDistance: radius } } };

            console.log("Executing Query: ", query);
            /* GET /orders listing. */
            Order.find(query, function(err, ordersList) {
                if (err) return console.log(err);
                console.log("Found these orders:", ordersList);
                res.json(ordersList);
            });
        });
}