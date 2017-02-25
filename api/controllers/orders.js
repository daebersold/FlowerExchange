'use strict';
var q = require('q');
var util = require('util');
var Order = require('../models/Order.js');
var GeoLocation = require("../helpers/geoLocation.js");

module.exports = {
    orders: orders
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
    radius = radius * 1609.34;

    // get Coordinates of Zip Code
    GeoLocation.getCoordsByZip(zipCode).then(
        function(geoCodedResult) {
            var lookupCoords = [geoCodedResult[0].longitude, geoCodedResult[0].latitude];

            // Remember to create the indexes required.
            // db.orders.createIndex( { toLoc : "2dsphere" } )
            // db.orders.createIndex( { fromLoc : "2dsphere" } )

            // Look it up!
            var query = { toLoc: { $near: { $geometry: { type: 'Point', coordinates: lookupCoords }, $maxDistance: radius } } };

            /* GET /orders listing. */
            Order.find(query, function(err, ordersList) {
                if (err) return console.log(err);
                res.json(ordersList);
            });
        });
}