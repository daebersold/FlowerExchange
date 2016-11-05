'use strict';

var util = require('util');
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

module.exports = {
  orders: orders
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function orders(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var zipCode = req.swagger.params.zipCode.value || 'no zip given';
  var ordersListing = util.format('Orders: %s!', zipCode);

  /* GET /orders listing. */
  Order.find(function (err, ordersList) {
    if (err) return next(err);
    console.log("made it",ordersList);
    res.json(ordersList);
  });

  // this sends back a JSON response which is a single string
  //res.json(ordersListing);
}