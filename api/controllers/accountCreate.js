'use strict';
var Account = require('../models/Account.js');
var util = require('util');
var idgen = require('idgen');
var geoLocation = require("../helpers/geoLocation.js");

function accountCreate(req, res) {

    if (req.account.isSuperUser !== true) {
        console.log("Error: account not authorized: ", req.account.username);
        res.json({ message: "Error: account not authorized." });
    }

    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountBody = req.body || 'no account given';
    var accountDetail = util.format('AccountCreate reqBody: %j!', accountBody);

    // Create a order in memory
    var accountToInsert = new Account(accountBody);

    // Remember to create the indexes required.
    // db.accounts.createIndex( { loc : "2dsphere" } )

    geoLocation.getCoordsForAccount(req).then(
        function(geoCodeResult) {
            accountToInsert.geoCode = geoCodeResult;
            accountToInsert.loc = { type: 'Point', coordinates: [geoCodeResult[0].longitude, geoCodeResult[0].latitude] };

            //accountToInsert.token = uuid.v4();
            // If account doesn't have a token, create one - otherwise use the one sent in.
            accountToInsert.token = accountToInsert.token || idgen(8);
            accountToInsert.active = true;

            // Save it to database
            accountToInsert.save(function(err) {
                if (err) {
                    console.log(err);
                    //res.json({stuff:err});
                } else {
                    res.json(accountToInsert.toString());
                }
            });
        }
    );
}

module.exports = {
    accountCreate: accountCreate
};