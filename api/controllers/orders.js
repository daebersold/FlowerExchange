'use strict';
var q = require('q');
var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

module.exports = {
  orders: orders
};

var getCoords = function(zipCode){
  var deferred = q.defer();
  var NodeGeocoder = require('node-geocoder');
  
  var options = {
    provider: 'google',
  
    // Optional depending on the providers 
    httpAdapter: 'https', // Default 
    apiKey: 'AIzaSyDUnhPZJjoED_bQQ3tyUJ7pXXk6Z9GW-e8', // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
  };
  
  var geocoder = NodeGeocoder(options);

  geocoder.geocode(zipCode).then(
    function(geoCodedResult) {
    // Success!
    console.log("geoCodedResults",geoCodedResult);
    deferred.resolve(geoCodedResult);
  })
  .catch(function(err) {
    console.log(err);
  });
  return deferred.promise;
};

function orders(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var zipCode = req.swagger.params.zipCode.value || 'no zip given';
  var radius = (req.swagger.params.radius.value || 30 ) * 1609.34; // If no radius is given, then default to 30 miles.
  var ordersListing = util.format('Orders: %s!', zipCode);

  // get Coordinates of Zip Code
  getCoords(zipCode).then(
    function(geoCodedResult){
      console.log('OrderCreate.GeoCodeResult: ',geoCodedResult);
      var lookupCoords =  [ geoCodedResult[0].longitude, geoCodedResult[0].latitude ];
      
      // Remember to create the indexes required.
      // db.orders.createIndex( { toLoc : "2dsphere" } )
      // db.orders.createIndex( { fromLoc : "2dsphere" } )
      
      // Look it up!
      var query = { toLoc : { $near : { $geometry : { type : 'Point', coordinates : lookupCoords }, $maxDistance : radius  } } };

      console.log("Executing Query: ",query);
      /* GET /orders listing. */
      Order.find(query, function (err, ordersList) {
        if (err) return next(err);
        console.log("Found these orders:", ordersList);
        res.json(ordersList);
      });
  });
}