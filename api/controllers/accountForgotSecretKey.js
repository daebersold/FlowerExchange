'use strict';
var Account = require('../models/Account.js');
var util = require('util');
var idgen = require('idgen');
var geoLocation = require("../helpers/geoLocation.js");
var Global = require("../../globals.js");
var idgen = require('idgen');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: Global.nodeMail
});

function accountForgotSecretKey(req, res) {

    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var contactEmail = req.swagger.params.contactEmail.value || 'no email given';
    console.log('resetting email: ', contactEmail);
    var query = { contactEmail: contactEmail };
    Account.findOne(query, function(err, account) {
        if (err) {
            console.log("Error: account does not exist ", accountId);
            res.json({ result: err });
        } else {
            console.log('account', account);


            // Send new token to user:
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Flower Exchange <noreply@flower-exchange.com>', // sender address
                to: contactEmail, // list of receivers
                subject: 'Flower-Exchange Secret Key', // Subject line
                text: 'Your secret key is: ' + account.token, // plain text body
                html: '<b>Your secret key is:</b>' + account.token // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.json({ "message": "Sent email" });
            });

        }
    });

}

module.exports = {
    accountForgotSecretKey: accountForgotSecretKey
};