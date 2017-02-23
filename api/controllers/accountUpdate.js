'use strict';
var Account = require('../models/Account.js');
var util = require('util');
var idgen = require('idgen');
var uuid = require('node-uuid');
var q = require('q');
var Global = require("../../globals.js");
var NodeGeocoder = require('node-geocoder');

var getCoords = function(req) {
    var deferred = q.defer();
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
                console.log("Geocoded Results:", geoCodedResult);
                var result = {};
                result = geoCodedResult;
                deferred.resolve(result);
            })
        .catch(function(err) {
            console.log(err);
        });
    return deferred.promise;
};

function accountUpdate(req, res) {

    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountBody = req.body || 'no account given';
    var accountDetail = util.format('AccountUpdate reqBody: %j!', accountBody);
    console.log("accountUpdate: ", accountDetail);

    var accountId = req.swagger.params.id.value;
    console.log("accountId", accountId);
    // Update account in memory
    var accountToUpdate = new Account(accountBody);
    accountToUpdate._id = accountId;

    // Remember to create the indexes required.
    // db.accounts.createIndex( { loc : "2dsphere" } )

    var query = { '_id': accountId };

    getCoords(req).then(
        function(geoCodeResult) {
            console.log('AccountUpdate.GeoCodeResult: ', geoCodeResult);
            accountToUpdate.geoCode = geoCodeResult;
            accountToUpdate.loc = { type: 'Point', coordinates: [geoCodeResult[0].longitude, geoCodeResult[0].latitude] };

            console.log("Updating Account: ", accountToUpdate);

            Account.findOne(query, function(err, account) {
                if (err) {
                    console.log("Error: account does not exist ", accountId);
                    res.json({ result: err });
                } else {
                    console.log("account found: ", account);

                    // No need to reset token
                    // No need to update create date

                    // Fields to Update
                    account.geoCode = accountToUpdate.geoCode;
                    account.loc = accountToUpdate.loc;
                    account.name = accountToUpdate.name;
                    account.address1 = accountToUpdate.address1;
                    account.address2 = accountToUpdate.address2;
                    account.city = accountToUpdate.city;
                    account.state = accountToUpdate.state;
                    account.zip = accountToUpdate.zip;
                    account.contactEmail = accountToUpdate.contactEmail;
                    account.contactPhone = accountToUpdate.contactPhone;
                    account.autoAcceptIfMoreThan = accountToUpdate.autoAcceptIfMoreThan;
                    account.autoRejectIfLessThan = accountToUpdate.autoRejectIfLessThan;
                    account.minimumOrderAmount = accountToUpdate.minimumOrderAmount;
                    account.defaultMileRadiusForAutoAcceptReject = accountToUpdate.defaultMileRadiusForAutoAcceptReject;
                    account.dateModified = Date.now();

                    // Save it to database
                    account.save(function(err) {
                        if (!err) {
                            console.log("Account saved: " + account);
                            res.json(account.toString());
                        } else {
                            console.log("Error: could not save account ", account);
                            res.json({ result: err });
                        }
                    });
                }
            });
        }
    );
};

module.exports = {
    accountUpdate: accountUpdate
};