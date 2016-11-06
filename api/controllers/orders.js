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