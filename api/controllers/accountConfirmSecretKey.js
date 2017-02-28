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

function accountConfirmSecretKey(req, res) {

    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var contactEmail = req.swagger.params.contactEmail.value || 'no email given';
    var token = req.swagger.params.token.value || 'no email given';
    console.log('accepting new token email: ', contactEmail);
    console.log('accepting new token email: ', token);
    var query = { contactEmail: contactEmail, resetToken: token };
    Account.findOne(query, function(err, account) {
        if (err) {
            console.log("Error: account does not exist ", accountId);
            res.json({ result: err });
        } else {
            console.log('account', account);

            // Fields to Update
            account.token = token;
            account.resetToken = null;
            account.resetTokenDate = null;
            account.resetTokenTimeout = null;

            // Save it to database
            account.save(function(err) {
                if (!err) {
                    //res.json(account.toString());

                    // Send new token to user:
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"Flower Exchange <noreply@flower-exchange.com>', // sender address
                        to: contactEmail, // list of receivers
                        subject: 'Your new secret token has been confirmed', // Subject line
                        text: 'Your new secret token has been confirmed', // plain text body
                        html: '<b>Your new secret token has been confirmed.<br> Thank you</b>' // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        res.json({ "message": "New secret key confirmed." });
                    });

                } else {
                    console.log("Error: could not save account ", account);
                    res.json({ result: err });
                }
            });
        }
    });
}

module.exports = {
    accountConfirmSecretKey: accountConfirmSecretKey
};