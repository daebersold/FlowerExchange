'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

var Account = require('./api/models/Account.js')

// load mongoose package
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
mongoose.connect('mongodb://localhost/flower-exchange')
    .then(console.log('connection succesful'))
    .catch(function(err) { console.error(err) });

module.exports = app; // for testing

var config = {
    appRoot: __dirname, // required config
    swaggerSecurityHandlers: {

        username: function(req, authOrSecDef, scopesOrApiKey, callback) {
            var username = req.headers["username"];
            if (username === undefined) {
                // If account is not supplied, then deny
                console.log("deny due to no username");
                return callback(new Error('access denied!'));
            } else {
                // Allow continuation - token is good
                callback(null);
            }
        },

        // api_key - method to evaluation of authorization
        api_key: function(req, authOrSecDef, scopesOrApiKey, callback) {

            // ****
            // Security Check section
            // ****
            //console.log("req.api_key",req.headers);
            //console.log('A scope key1: ',req.swagger);
            var username = req.headers["username"];
            if (username === undefined) {
                // If username is not supplied, then deny
                console.log("deny due to no username");
                return callback(new Error('access denied!'));
            } else {

                if (scopesOrApiKey === undefined) {
                    // If api key is not supplied, then deny
                    console.log("deny due to no api token");
                    return callback(new Error('access denied!'));
                } else {
                    var query = { token: scopesOrApiKey, username: username };
                    /* Verify token exists with particular account. */
                    Account.findOne(query, function(err, account) {

                        // If not, return forbidden.
                        if (err || account === null || account.active !== true) {
                            return callback(new Error('Access denied!'));
                        }
                        // If we found it, let's get the account List for futher usage.
                        req.account = account;

                        // Allow continuation - token is good
                        callback(null);
                    });
                }
            }
            // To insert the admin record, comment this line in.
            //callback(null);
            // Once inserted comment the line above out. and comment in the section above.

        }
    }
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || 10010;
    app.listen(port);

    // if (swaggerExpress.runner.swagger.paths['/orders']) {
    //     console.log('try this:\ncurl http://127.0.0.1:' + port + '/orders?zipCode=47150&radius=50');
    // }
    // if (swaggerExpress.runner.swagger.paths['/order']) {
    //     console.log('try this:\ncurl http://127.0.0.1:' + port + '/order?orderId=10492939');
    // }
    // if (swaggerExpress.runner.swagger.paths['/account']) {
    //     console.log('try this:\ncurl http://127.0.0.1:' + port + '/account?accountId=124');
    // }
    // if (swaggerExpress.runner.swagger.paths['/order/create']) {
    //     console.log('try this:\ncurl http://127.0.0.1:' + port + '/order/create');
    // }
    // if (swaggerExpress.runner.swagger.paths['/order/accept']) {
    //     console.log('try this:\ncurl http://127.0.0.1:' + port + '/order/accept');
    // }
});