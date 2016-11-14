'use strict';
var q = require('q');
var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');
var Account = require('../models/Account.js');
var Global = require("../../globals.js");

console.log("global:", Global);

var getCoords = function(req){
  var deferred = q.defer();
  var NodeGeocoder = require('node-geocoder');
  
  // var options = {
  //   provider: 'google',
  
  //   // Optional depending on the providers 
  //   httpAdapter: 'https', // Default 
  //   apiKey: 'AIzaSyCSnHoaN7NnFdr-SLSg4vSBGlXeO2MGJ9M', // for Mapquest, OpenCage, Google Premier 
  //   formatter: null         // 'gpx', 'string', ... 
  // };
  var options = Global.options;
  
  var geocoder = NodeGeocoder(options);
  
  var toAddress1 = req.body.toAddress1 || "";
  var toAddress2 = req.body.toAddress2 || "";
  var toCity = req.body.toCity || "";
  var toState = req.body.toState || "";
  var toZipCode = req.body.toZipCode || "";
  var addressToGeoCode = toAddress1 + " " + toAddress2 + " " + toCity + " " + toState + " " + toZipCode;

 
  var fromAddress1 = req.body.fromAddress1 || "";
  var fromAddress2 = req.body.fromAddress2 || "";
  var fromCity = req.body.fromCity || "";
  var fromState = req.body.fromState || "";
  var fromZipCode = req.body.fromZipCode || "";
  var addressFromGeoCode = fromAddress1 + " " + fromAddress2 + " " + fromCity + " " + fromState + " " + fromZipCode;

  geocoder.geocode(addressToGeoCode).then(
    function(toGeoCodedResult) {
    // Success!
    console.log(toGeoCodedResult);
    geocoder.geocode(addressFromGeoCode).then(
      function(fromGeoCodedResult) {
        // Success!
        console.log(fromGeoCodedResult);
        var result = {};
        result.toGeoCode = toGeoCodedResult;
        result.fromGeoCode = fromGeoCodedResult;
        deferred.resolve(result);
    })
    .catch(function(err) {
      console.log(err);
    });
  })
  .catch(function(err) {
    console.log(err);
  });
  return deferred.promise;
};

// AutoAccept will go through all orders and apply rules
// 
var AutoAccept = function(orderToInsert) {
  console.log("Checking auto acceptance rules");
  Account.find({}, function (err, accountsList){
    if ( err){
      console.log("error",err);
    }
    for( var x=0; x < accountsList.length; x++){
      console.log('Checking on rules for account: ', accountsList[x]);
      if (accountsList[x].geoCode) {

      
        var lookupCoords = [ accountsList[x].geoCode[0].longitude, accountsList[x].geoCode[0].latitude ];
        var radius = accountsList[x].defaultMileRadiusForAutoAcceptReject;

        // Look orders that might be candidates for auto-acceptance for this account!
        var orderQuery = { toLoc : { $near : { $geometry : { type : 'Point', coordinates : lookupCoords }, $maxDistance : radius  } }, 
      orderStatus: 1 };

        console.log("Executing Query: ",orderQuery);
        /* GET /orders listing. */
        Order.find(orderQuery, function (err, ordersList) {
          if (err) return console.log(err);
          console.log("Found these orders:", ordersList);
        });
      }
    }
  });
};


function orderCreate(req, res) {
  
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var orderBody = req.body || 'no order given';
  var orderDetail = util.format('OrderCreate reqBody: %j!', orderBody);
  console.log("orderCreate", orderDetail);
  // Create a order in memory
  var orderToInsert = new Order(orderBody);
    
  getCoords(req).then(
    function(geoCodeResult){
      console.log('OrderCreate.GeoCodeResult: ',geoCodeResult);
      orderToInsert.toGeoCode = geoCodeResult.toGeoCode;
      orderToInsert.fromGeoCode = geoCodeResult.fromGeoCode;
      orderToInsert.toLoc = { type: 'Point', coordinates: [ geoCodeResult.toGeoCode[0].longitude, geoCodeResult.toGeoCode[0].latitude ] };
      orderToInsert.fromLoc = { type: 'Point', coordinates: [ geoCodeResult.fromGeoCode[0].longitude, geoCodeResult.fromGeoCode[0].latitude ] };


      // Remember to create the indexes required.
      // db.orders.createIndex( { toLoc : "2dsphere" } )
      // db.orders.createIndex( { fromLoc : "2dsphere" } )
      
      // Save it to database
      orderToInsert.save(function(err){
        if(err) {
          console.log(err);
          //res.json({stuff:err});
        } else {
          console.log(orderToInsert);
          AutoAccept(orderToInsert);
          res.json(orderToInsert.toString());
        }
      });
  });

  // this sends back a JSON response which is a single string
  //res.json(orderDetail);
};

module.exports = {
  orderCreate: orderCreate
};