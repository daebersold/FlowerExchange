'use strict';
var Account = require('../models/Account.js');
var util = require('util');
var idgen = require('idgen');
var uuid = require('node-uuid');

module.exports = {
  accountCreate: accountCreate
};

function accountCreate(req, res) {

  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var accountBody = req.body || 'no order given';
  var accountDetail = util.format('AccountCreate reqBody: %j!', accountBody);
  console.log("accountCreate", accountDetail);
  // Create a order in memory
  var accountToInsert = new Account(accountBody);

  //accountToInsert.token = uuid.v4();
  accountToInsert.token = idgen(8);

  // Save it to database
  accountToInsert.save(function(err){
    if(err) {
      console.log(err);
      //res.json({stuff:err});
    } else {
      console.log(accountToInsert);
      res.json(accountToInsert.toString());
    }
  });
  
  // this sends back a JSON response which is a single string
  //res.json(accountDetail);
}