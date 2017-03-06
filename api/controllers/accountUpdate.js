'use strict';
var Account = require('../models/Account.js');
var util = require('util');
var idgen = require('idgen');
var geoLocation = require("../helpers/geoLocation.js");

function accountUpdate(req, res) {

    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountBody = req.body || 'no account given';

    var accountId = req.account._id;
    var accountToUpdate = new Account(accountBody);
    accountToUpdate._id = accountId;

    // Remember to create the indexes required.
    // db.accounts.createIndex( { loc : "2dsphere" } )

    var query = { '_id': accountId };

    geoLocation.getCoordsForAccount(req).then(
        function(geoCodeResult) {
            accountToUpdate.geoCode = geoCodeResult;
            accountToUpdate.loc = { type: 'Point', coordinates: [geoCodeResult[0].longitude, geoCodeResult[0].latitude] };

            Account.findOne(query, function(err, account) {
                if (err) {
                    console.log("Error: account does not exist ", accountId);
                    res.json({ result: err });
                } else {
                    // No need to reset token
                    // No need to update create date

                    // Fields to Update
                    account.username = accountToUpdate.username || account.username;
                    account.geoCode = accountToUpdate.geoCode || account.geoCode;
                    account.loc = accountToUpdate.loc || account.loc;
                    account.name = accountToUpdate.name || account.name;
                    account.address1 = accountToUpdate.address1 || account.address1;
                    account.address2 = accountToUpdate.address2;
                    account.city = accountToUpdate.city || account.city;
                    account.state = accountToUpdate.state || account.state;
                    account.zip = accountToUpdate.zip || account.zip;
                    account.contactEmail = accountToUpdate.contactEmail || account.contactEmail;
                    account.contactPhone = accountToUpdate.contactPhone || account.contactPhone;
                    account.autoAcceptIfMoreThan = accountToUpdate.autoAcceptIfMoreThan || account.autoAcceptIfMoreThan;
                    account.autoRejectIfLessThan = accountToUpdate.autoRejectIfLessThan || account.autoRejectIfLessThan;
                    account.minimumOrderAmount = accountToUpdate.minimumOrderAmount || account.minimumOrderAmount;
                    account.defaultMileRadiusForAutoAcceptReject = accountToUpdate.defaultMileRadiusForAutoAcceptReject || account.defaultMileRadiusForAutoAcceptReject;
                    account.dateModified = Date.now();

                    // Save it to database
                    account.save(function(err) {
                        if (!err) {
                            res.json({ result: true, message: "successfully updated account" });
                        } else {
                            console.log("Error: could not save account ", account);
                            res.json({ result: err });
                        }
                    });
                }
            });
        }
    );
}

module.exports = {
    accountUpdate: accountUpdate
};