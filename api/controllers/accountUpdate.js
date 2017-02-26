'use strict';
var Account = require('../models/Account.js');
var util = require('util');
var idgen = require('idgen');
var geoLocation = require("../helpers/geoLocation.js");

function accountUpdate(req, res) {

    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountBody = req.body || 'no account given';
    var accountDetail = util.format('AccountUpdate reqBody: %j!', accountBody);

    var accountId = req.swagger.params.id.value;
    // Update account in memory
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
}

module.exports = {
    accountUpdate: accountUpdate
};