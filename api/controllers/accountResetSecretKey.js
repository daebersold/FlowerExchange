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

function accountResetSecretKey(req, res) {

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

            //accountToInsert.token = uuid.v4();
            var newToken = idgen(8);

            // Fields to Update
            account.resetToken = newToken;
            account.resetTokenDate = Date.now();
            account.resetTokenTimeout = Date.now(4);

            // Save it to database
            account.save(function(err) {
                if (!err) {
                    //res.json(account.toString());

                    // Send new token to user:
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"Flower Exchange <noreply@flower-exchange.com>', // sender address
                        to: contactEmail, // list of receivers
                        subject: 'Please Confirm your new secret key', // Subject line
                        text: 'Your secret token has been re-keyed \
                        If you did not request this change, please ignore this email. \
                        Your new secret key is: ' + account.resetToken,
                        html: '<b>Your secret token has been re-keyed. \
                        If you did not request this change, please ignore this email <br> \
                        Your new secret key is: ' + account.resetToken // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        res.json({ "message": "Sent email" });
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
    accountResetSecretKey: accountResetSecretKey
};