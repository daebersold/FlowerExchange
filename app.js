'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

// load mongoose package
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
mongoose.connect('mongodb://localhost/flower-exchange')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    api_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
      // your security code
      if ('1234' === scopesOrApiKey) {
        callback(null);
      } else {
        callback(new Error('access denied!'));
      }
    }
  }
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/orders']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/orders?zipCode=47150&radius=50');
  }
  if (swaggerExpress.runner.swagger.paths['/order']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/order?orderId=10492939');
  }
  if (swaggerExpress.runner.swagger.paths['/account']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/account?accountId=124');
  }
  if (swaggerExpress.runner.swagger.paths['/order/create']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/order/create');
  }
  if (swaggerExpress.runner.swagger.paths['/order/accept']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/order/accept');
  }
});
