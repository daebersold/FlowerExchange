'use strict';
var util = require('util');
var Account = require('../models/Account.js');

function account(req, res) {
    res.json(req.account);
}

module.exports = {
    account: account
};