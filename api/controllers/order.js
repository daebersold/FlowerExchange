'use strict';

var util = require('util');

module.exports = {
  order: order
};

function order(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var orderId = req.swagger.params.orderId.value || 'no id given';
  var orderDetail = util.format('Order: %d!', orderId);
  var accountDetail = req.account;
  // this sends back a JSON response which is a single string
  res.json(orderDetail);
}
