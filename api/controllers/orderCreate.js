'use strict';

var util = require('util');
// load mongoose package
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

var getCoords = function(){

  var NodeGeocoder = require('node-geocoder');
  
  var options = {
    provider: 'google',
  
    // Optional depending on the providers 
    httpAdapter: 'https', // Default 
    apiKey: 'AIzaSyDUnhPZJjoED_bQQ3tyUJ7pXXk6Z9GW-e8', // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
  };
  
  var geocoder = NodeGeocoder(options);
  
  // Using callback 
  geocoder.geocode('2808 Sandalwood Dr. New Albany, IN 47150').then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });
};

function orderCreate(req, res) {
  
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var orderBody = req.body || 'no order given';
  var orderDetail = util.format('Order: %j!', orderBody);
  var orderToInsert = new Order(orderBody);
  console.log("orderToInsert", orderToInsert);
  getCoords();
  
  // Create a order in memory
  var order = new Order(orderToInsert);
  
  // Save it to database
  order.save(function(err){
    if(err) {
      console.log(err);
      res.json({stuff:err});
    } else {
      console.log(orderToInsert);
      res.json(orderToInsert.toString());
    }
  });

  // this sends back a JSON response which is a single string
  //res.json(orderDetail);
};

module.exports = {
  orderCreate: orderCreate
};
