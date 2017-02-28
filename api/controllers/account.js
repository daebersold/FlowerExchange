'use strict';
var util = require('util');
var Account = require('../models/Account.js');

function account(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountId = req.swagger.params.accountId.value || 'no accountId given';
    var secretKey = req.swagger.params.secretKey.value || 'no secret key given';

    var query = { '_id': accountId, token: secretKey };

    Account.findOne(query, function(err, account) {
        if (err) {
            console.log("Error: account does not exist ", accountId);
            res.json({ result: err });
        } else {
            console.log('account', account);
            // this sends back a JSON response which is a single string
            res.json(account);
        }
    });
}

module.exports = {
    account: account
};