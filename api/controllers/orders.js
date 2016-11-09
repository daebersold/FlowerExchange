'use strict';

var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

module.exports = {
  orders: orders
};

function orders(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var zipCode = req.swagger.params.zipCode.value || 'no zip given';
  var zipCode = req.swagger.params.radius.value || 30; // If no radius is given, then default to 30 miles.
  var ordersListing = util.format('Orders: %s!', zipCode);

  // get Coordinates of Zip Code


  //var query = { toLoc: { '$near': { '$maxDistance': 1, '$geometry': { type: 'Point', coordinates: [ 10, -20 ] } } } }";
  var query = { toLoc : { $near : { $geometry : { type : 'Point', coordinates : [ -83, 35 ] }, $maxDistance : 11123123  } } };

  console.log("Executing Query: ",query);
  /* GET /orders listing. */
  Order.find(query, function (err, ordersList) {
    if (err) return next(err);
    console.log("Found these orders:", ordersList);
    res.json(ordersList);
  });

  // this sends back a JSON response which is a single string
  //res.json(ordersListing);
}