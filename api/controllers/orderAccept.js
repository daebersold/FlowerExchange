'use strict';
var util = require('util');
module.exports = {
  orderAccept: orderAccept
};


function orderAccept(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var orderId = req.swagger.params.orderId.value || 'no id given';
  var orderDetail = util.format('Order: %d!', orderId);
  
  // this sends back a JSON response which is a single string
  res.json(orderDetail);
}
