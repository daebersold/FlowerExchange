'use strict';

var util = require('util');
// load mongoose package
var mongoose = require('mongoose');
var Order = require('../models/Order.js');

module.exports = {
  orderCreate: orderCreate
};

function orderCreate(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  console.log("order",req.body);
  var orderBody = req.body || 'no order given';
  var orderDetail = util.format('Order: %j!', orderBody);

  // Create a order in memory
  var order = new Order({name: 'Master', completed: false, note: 'Gtesting 1'});
  // Save it to database
  order.save(function(err){
    if(err)
      console.log(err);
    else
      console.log(order);
  });

  // this sends back a JSON response which is a single string
  //res.json(orderDetail);
}

