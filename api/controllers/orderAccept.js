'use strict';
var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');
var Account = require('../models/Account.js');

// Will return an orderAcceptSchema
function orderAccept(req, res) {
    // Reqlize that req.account gets set in app when token is verified and account is retrieved.
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountId = req.swagger.params.accountId.value;

    var query = {
        _id: accountId,
        token: req.account.token
    };

    Account.findOne(query, function(err, account) {

        if (!err && account) {
            var orderId = req.swagger.params.orderId.value || 'no id given';
            var orderQuery = { '_id': orderId }; //{ loc : { $near : { $geometry : { type : 'Point', coordinates : orderToInsert.toLoc.coordinates}, $maxDistance: { $val: 'defaultMileRadiusForAutoAcceptReject'} }, orderStatus: 1 };
            Order.findOne(orderQuery, function(err, order) {
                if (!err && order) {

                    // Fields to Update
                    order.fullfillmentAccountId = account._id;
                    order.dateModified = Date.now();

                    //db.orders.update({originatingAccountId:3424},{$set:{originatingAccountId: ObjectId("582bec6dcac4e18614b7b1b0")}},{ multi: true })

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
        } else {
            console.log("Account lookup error: ", err);
            res.json({ result: err });
        }
    });
}

module.exports = {
    orderAccept: orderAccept
};