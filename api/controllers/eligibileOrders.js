'use strict';
var q = require('q');
var util = require('util');
var Order = require('../models/Order.js');
var Account = require('../models/Account.js');
var GeoLocation = require("../helpers/geoLocation.js");
var mongoose = require('mongoose');

function eligibileOrders(req, res) {

    if (req.account) {

        // If no radius is given, then default to 30 miles.
        var radius = req.account.defaultMileRadiusForAutoAcceptReject || 0;
        radius = radius * 1609.34;
        var zipCode = req.account.zip;

        // get Coordinates of Zip Code
        GeoLocation.getCoordsByZip(zipCode).then(
            function(geoCodedResult) {
                var lookupCoords = [geoCodedResult[0].longitude, geoCodedResult[0].latitude];

                // Remember to create the indexes required.
                // db.orders.createIndex( { toLoc : "2dsphere" } )
                // db.orders.createIndex( { fromLoc : "2dsphere" } )

                // Look it up!
                var query = {
                    fullfillmentAccountId: null,
                    toLoc: { $near: { $geometry: { type: 'Point', coordinates: lookupCoords }, $maxDistance: radius } }
                };

                /* GET /orders listing. */
                Order.find(query, function(err, ordersList) {
                    if (err) return console.log(err);
                    res.json(ordersList);
                });
            });

    }
}

module.exports = {
    eligibileOrders: eligibileOrders
};