'use strict';

var util = require('util');
var Account = require('../models/Account.js');

module.exports = {
    accounts: accounts
};

function accounts(req, res) {
    // Reqlize that req.account gets set in app when token is verified and account is retrieved.
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}

    if (req.account.isSuperUser !== true) {
        console.log("Error: account not authorized: ", req.account.username);
        res.json({ message: "Error: account not authorized." });
    }

    // Get all the accounts
    var query = {};

    /* GET /accounts listing. */
    Account.find(query, function(err, accountList) {
        if (err) return console.log(err);
        res.json(accountList);
    });


}