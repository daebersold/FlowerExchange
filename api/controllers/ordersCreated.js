'use strict';
var q = require('q');
var util = require('util');
var Order = require('../models/Order.js');
var GeoLocation = require("../helpers/geoLocation.js");

function ordersCreated(req, res) {

    // Look it up!
    var query = { originatingAccountId: req.account._id };

    /* GET /ordersCreated listing. */
    Order.find(query, function(err, ordersList) {
        if (err) return console.log(err);
        res.json(ordersList);
    });
}

module.exports = {
    ordersCreated: ordersCreated
};