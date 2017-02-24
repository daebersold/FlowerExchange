'use strict';

var util = require('util');
var Account = require('../models/Account.js');

module.exports = {
    accounts: accounts
};

function accounts(req, res) {
    //console.log("req",req);
    //console.log("req accounts", req.accounts);

    // Get all the accounts
    var query = {};

    //console.log("Executing Query: ", query);

    /* GET /orders listing. */
    Account.find(query, function(err, accountList) {
        if (err) return console.log(err);
        //console.log("Found these accounts:", accountList);
        res.json(accountList);
    });
}