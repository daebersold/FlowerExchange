'use strict';
var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

function orderAccept(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var orderId = req.swagger.params.orderId.value || 'no id given';
    var orderDetail = util.format('Order: %d!', orderId);

    var orderQuery = { "id": orderId }; //{ loc : { $near : { $geometry : { type : 'Point', coordinates : orderToInsert.toLoc.coordinates}, $maxDistance: { $val: 'defaultMileRadiusForAutoAcceptReject'} }, orderStatus: 1 };
    Order.findOne(orderQuery, function(err, order) {
        if (err) {
            console.log("error", err);
        } else {
            // Fields to Update
            order.fullfillmentAccountId = 100;
            order.dateModified = Date.now();

            // Save it to database
            order.save(function(err) {
                if (!err) {
                    //console.log('order', order);
                    res.json(order.toString());
                } else {
                    console.log("Error: could not save order ", order);
                    res.json({ result: err });
                }
            });
        }
    });

    // this sends back a JSON response which is a single string
    res.json(orderDetail);
}

module.exports = {
    orderAccept: orderAccept
};