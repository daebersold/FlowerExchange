'use strict';

var util = require('util');
var Order = require('../models/Order.js');

function order(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var orderId = req.swagger.params.orderId.value || 'no id given';

    var query = {
        '$or': [{ id: orderId, originatingAccountId: req.account._id },
            { id: orderId, fullfillmentAccountId: req.account._id },
            { id: orderId, originatingAccountId: null },
            { id: orderId, fullfillmentAccountId: null }
        ]
    };

    Order.find(query, function(err, order) {
        // this sends back a JSON response which is a single string
        if (!err) {
            res.json(order);
        } else {
            console.log("Error: could not get order ", orderId);
            res.json({ result: err });
        }
    });
}

module.exports = {
    order: order
};