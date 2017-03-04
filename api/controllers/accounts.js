'use strict';

var util = require('util');
var Account = require('../models/Account.js');

module.exports = {
    accounts: accounts
};

function accounts(req, res) {
    // Reqlize that req.account gets set in app when token is verified and account is retrieved.
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountId = req.swagger.params.accountId.value;
    var secretKey = req.swagger.params.secretKey.value;

    var query = {
        _id: accountId,
        token: secretKey,
    };

    Account.findOne(query, function(err, account) {

        if (!err && account.isSuperUser) {

            // Get all the accounts
            var query = {};

            //console.log("Executing Query: ", query);

            /* GET /orders listing. */
            Account.find(query, function(err, accountList) {
                if (err) return console.log(err);
                //console.log("Found these accounts:", accountList);
                res.json(accountList);
            });
        } else {
            console.log("Error: account not authorized.", account);
            res.json({ message: "Error: account not authorized." });
        }
    });
}