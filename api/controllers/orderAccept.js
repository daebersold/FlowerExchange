'use strict';
var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');
var Account = require('../models/Account.js');

// Will return an orderAcceptSchema
function orderAccept(req, res) {
    var orderId = req.swagger.params.orderId.value || 'no id given';

    if (!orderId) {
        console.log("Error: no order given", err, order);
        res.json({ result: "No orderId given" });
    }
    if (req.account) {

        var orderQuery = { '_id': orderId, fullfillmentAccountId: null }; //{ loc : { $near : { $geometry : { type : 'Point', coordinates : orderToInsert.toLoc.coordinates}, $maxDistance: { $val: 'defaultMileRadiusForAutoAcceptReject'} }, orderStatus: 1 };
        Order.findOne(orderQuery, function(err, order) {
            if (!err && order) {

                // Fields to Update
                order.fullfillmentAccountId = req.account._id;
                order.dateModified = Date.now();

                // Save it to database
                order.save(function(err) {
                    if (!err) {
                        var result = { order: order, result: true, resultMessage: "Successfully accpted order" };
                        res.json(result);
                    } else {
                        console.log("Error: could not save order ", err, order);
                        res.json({ result: err });
                    }
                });
            } else {
                console.log("Order lookup error: ", err);
                res.json({ result: err });
            }
        });
    }

}

module.exports = {
    orderAccept: orderAccept
};