// istanbul -x "test/**" cover _mocha -- --recursive -R tap test/ > test.tap && istanbul report clover –  snoof 9 hours ago 
// istanbul -x "test/**" cover /Users/davidaebersold/dev/FlowerExchange/test/api/controllers/account.js
var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var Order = require('../../../api/models/Order.js');

// Generate a v4 UUID (random) 
var idgen = require('idgen');
var orderId = idgen(8);


describe('controllers', function() {

    describe('order', function() {
        describe('POST /order/create', function() {

            it('should create an order', function(done) {

                var order = {
                    id: orderId,
                    originatingAccountId: 2,
                    fullfillmentAccountId: 2,
                    toFirstName: "John",
                    toLastName: "Doe",
                    toAddress1: "123 Main St",
                    toAddress2: "Suite 4",
                    toCity: "Beverly Hills",
                    toState: "CA",
                    toZipCode: 90210,
                    toHomePhone: "555-555-5555",
                    toMobilePhone: "555-555-5555",
                    toEmail: "test@email.com",
                    fromFirstName: "Jane",
                    fromLastName: "Doe",
                    fromAddress1: "123 Main St",
                    fromAddress2: "123 Main St.",
                    fromCity: "New Albany",
                    fromState: "IN",
                    fromZipCode: 47150,
                    fromHomePhone: "555-555-5555",
                    fromMobilePhone: "555-555-5555",
                    fromEmail: "test2@email.com",
                    orderDetails: [{
                        itemNumber: "142",
                        itemName: "TakeMyHeartAway",
                        itemDescription: "28 beautiful multi-colored roses in a vase",
                        itemCost: 75,
                        itemMaxCost: 75
                    }],
                    orderTotal: 75,
                    orderTotalNotToExceed: 75,
                    deliveryDate: "2017-02-25",
                    timedDelivery: true,
                    deliveryTime: "2017-02-27T19:20:30.45+01:00",
                    expirationDate: "2017-02-27"
                };

                request(server)
                    .post('/order/create')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .set('Accept', 'application/json')
                    .send(order)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object);
                        done();
                    });
            });
        });

        describe('GET /order', function() {

            it('should return an order', function(done) {

                request(server)
                    .get('/order')
                    .set('Accept', 'application/json')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .query({ orderId: orderId })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object);
                        done();
                    });
            });

            it('should accept a name parameter', function(done) {

                request(server)
                    .get('/order')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .query({ orderId: orderId })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object);
                        done();
                    });
            });

        });

        describe('Get /orders', function() {

            it('should return all order', function(done) {

                request(server)
                    .get('/orders')
                    .set('Accept', 'application/json')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .query()
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object);
                        done();
                    });
            });
        });

        var orderId = null;
        before(function() {
            Order.findOneAndUpdate({}, { fullfillmentAccountId: null }, { new: true }, function(err, order) {
                orderId = order._id + "";
            });
        });

        describe('Get /order/accept', function() {
            it('should accept an order', function(done) {
                request(server)
                    .get('/order/accept')
                    .set('Accept', 'application/json')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .query({ orderId: orderId })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object);
                        // really should do a check here to see if fullfillmentAccountId is set.
                        return done();
                    });
            });
        });
    });

});