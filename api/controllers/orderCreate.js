'use strict';

var util = require('util');
var Order = require('../models/Order.js');
var Account = require('../models/Account.js');
var geoLocation = require("../helpers/geoLocation.js");

// AutoAccept will go through all orders and apply rules 
var AutoAccept = function(orderToInsert) {
    // Brute force... go through all accounts.
    // for each account, look at open orders.
    // rule match
    // next account.
    //console.log("Checking auto acceptance rules", orderToInsert.fromAddress1);
    var accountQuery = {}; //{ loc : { $near : { $geometry : { type : 'Point', coordinates : orderToInsert.toLoc.coordinates}, $maxDistance: { $val: 'defaultMileRadiusForAutoAcceptReject'} }, orderStatus: 1 };
    Account.find(accountQuery, function(err, accountsList) {
        if (err) {
            console.log("error", err);
        }
        for (var x = 0; x < accountsList.length; x++) {

            if (accountsList[x].loc) {
                //console.log('Checking on rules for account: ', accountsList[x].token);

                var orderQuery = { toLoc: { $near: { $geometry: { type: 'Point', coordinates: accountsList[x].loc.coordinates }, $maxDistance: accountsList[x].defaultMileRadiusForAutoAcceptReject } }, orderStatus: 1 };
                //console.log("Order Query: ", JSON.stringify(orderQuery));
                Order.find(orderQuery, function(err, ordersList) {
                    if (ordersList) {
                        for (var y = 0; y < ordersList.length; y++) {
                            //console.log("Matched: ", accountsList[x].token, " with ", ordersList[0]._id);
                        }
                    }
                });
            }
        }
    });
};

function orderCreate(req, res) {


    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var orderBody = req.body || 'no order given';
    var orderDetail = util.format('OrderCreate reqBody: %j!', orderBody);

    // Create a order in memory
    var orderToInsert = new Order(orderBody);

    // Set Fields Relative to Creator
    orderToInsert.originatingAccountId = req.account._id;
    orderToInsert.fullfillmentAccountId = null;
    geoLocation.getCoordsForOrder(req).then(
        function(geoCodeResult) {
            //console.log('OrderCreate.GeoCodeResult: ', geoCodeResult);
            orderToInsert.toGeoCode = geoCodeResult.toGeoCode;
            orderToInsert.fromGeoCode = geoCodeResult.fromGeoCode;
            orderToInsert.toLoc = { type: 'Point', coordinates: [geoCodeResult.toGeoCode[0].longitude, geoCodeResult.toGeoCode[0].latitude] };
            orderToInsert.fromLoc = { type: 'Point', coordinates: [geoCodeResult.fromGeoCode[0].longitude, geoCodeResult.fromGeoCode[0].latitude] };


            // Remember to create the indexes required.
            // db.orders.createIndex( { toLoc : "2dsphere" } )
            // db.orders.createIndex( { fromLoc : "2dsphere" } )
            // time value:  1985-04-12T23:20:50.52Z

            // Save it to database
            orderToInsert.save(function(err) {
                if (err) {
                    console.log(err);
                    res.json({ message: "Failed to create order." });
                } else {
                    //console.log(orderToInsert);
                    //AutoAccept(orderToInsert);
                    var out = { message: "success" };
                    res.json(out);
                }
            });
        });

}

module.exports = {
    orderCreate: orderCreate
};