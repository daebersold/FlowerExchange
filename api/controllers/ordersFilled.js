'use strict';
var q = require('q');
var util = require('util');
var Order = require('../models/Order.js');
var GeoLocation = require("../helpers/geoLocation.js");

function ordersFilled(req, res) {

    // Look it up!
    var query = { fullfillmentAccountId: req.account._id };

    /* GET /ordersFilled listing. */
    Order.find(query, function(err, ordersList) {
        if (err) return console.log(err);
        res.json(ordersList);
    });
}

module.exports = {
    ordersFilled: ordersFilled
};