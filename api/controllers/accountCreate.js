'use strict';
var Account = require('../models/Account.js');
var util = require('util');
var idgen = require('idgen');
var uuid = require('node-uuid');
var q = require('q');
var Global = require("../../globals.js");


var getCoords = function(req){
  var deferred = q.defer();
  var NodeGeocoder = require('node-geocoder');
  
  var options = Global.options;
  
  var geocoder = NodeGeocoder(options);
  
  var address1 = req.body.address1 || "";
  var address2 = req.body.address2 || "";
  var city = req.body.city || "";
  var state = req.body.state || "";
  var zip = req.body.zipCode || "";
  var addressToGeoCode = address1 + " " + address2 + " " + city + " " + state + " " + zip;

  geocoder.geocode(addressToGeoCode).then(
    function(geoCodedResult) {
    // Success!
    console.log(geoCodedResult);
        var result = {};
        result = geoCodedResult;
        deferred.resolve(result);
    })
    .catch(function(err) {
      console.log(err);
    });
    return deferred.promise;
};

function accountCreate(req, res) {

  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var accountBody = req.body || 'no order given';
  var accountDetail = util.format('AccountCreate reqBody: %j!', accountBody);
  console.log("accountCreate", accountDetail);
  // Create a order in memory
  var accountToInsert = new Account(accountBody);

  // Remember to create the indexes required.
  // db.accounts.createIndex( { loc : "2dsphere" } )
  
  getCoords(req).then(
    function(geoCodeResult){
      console.log('AccountCreate.GeoCodeResult: ',geoCodeResult);
      accountToInsert.geoCode = geoCodeResult;
      accountToInsert.loc = { type: 'Point', coordinates: [ geoCodeResult[0].longitude, geoCodeResult[0].latitude ] };

      //accountToInsert.token = uuid.v4();
      accountToInsert.token = idgen(8);

      console.log("Inserting Account: ",accountToInsert);
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
    }
  );
};

module.exports = {
  accountCreate: accountCreate
};