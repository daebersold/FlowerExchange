'use strict';
var util = require('util');

module.exports = {
    account: account
};

function account(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var accountId = req.swagger.params.accountId.value || 'no accountId given';
    var accountDetail = util.format('Account: %d!', accountId);
    accountDetail = req.account;
    // this sends back a JSON response which is a single string
    res.json(accountDetail);
}