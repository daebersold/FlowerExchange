// istanbul -x "test/**" cover _mocha -- --recursive -R tap test/ > test.tap && istanbul report clover –  snoof 9 hours ago 
// istanbul -x "test/**" cover /Users/davidaebersold/dev/FlowerExchange/test/api/controllers/account.js
var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

    describe('order', function() {

        describe('GET /order', function() {

            it('should return an order', function(done) {

                request(server)
                    .get('/order')
                    .set('Accept', 'application/json')
                    .set('api_key', '1234')
                    .query({ orderId: 1, secretKey: 1234 })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object)
                        done();
                    });
            });

            it('should accept a name parameter', function(done) {

                request(server)
                    .get('/order')
                    .set('api_key', '1234')
                    .query({ orderId: 1, secretKey: 1234 })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object)
                        done();
                    });
            });

        });

        describe('Get /orders', function() {

            it('should return all order', function(done) {

                request(server)
                    .get('/orders')
                    .set('Accept', 'application/json')
                    .set('api_key', '1234')
                    .query({ secretKey: 1234 })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object)
                        done();
                    });
            });
        });


    });

});