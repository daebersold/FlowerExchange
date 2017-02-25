// istanbul -x "test/**" cover _mocha -- --recursive -R tap test/ > test.tap && istanbul report clover –  snoof 9 hours ago 
// istanbul -x "test/**" cover /Users/davidaebersold/dev/FlowerExchange/test/api/controllers/account.js
var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

    describe('account', function() {

        describe('GET /account', function() {

            it('should return an account', function(done) {

                request(server)
                    .get('/account')
                    .set('Accept', 'application/json')
                    .set('api_key', '1234')
                    .query({ accountId: 1, secretKey: 1234 })
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
                    .get('/account')
                    .set('api_key', '1234')
                    .query({ accountId: 1, secretKey: 1234 })
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

        describe('GET /accounts', function() {

            it('should return all accounts', function(done) {
                var params = { secretKey: 1234 };
                request(server)
                    .get('/accounts')
                    .set('Accept', 'application/json')
                    .set('api_key', '1234')
                    .query({ secretKey: 1234 })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Array)
                        done();
                    });
            });
        });


        describe('POST /account/create', function() {
            it('should create an account', function(done) {

                var account = {
                    name: 'John Doe',
                    address1: '123 Main st',
                    address2: 'Suite 4',
                    city: 'New Albany',
                    state: 'IN',
                    zip: '47150',
                    contactEmail: 'emailAddress@test.com',
                    contactPhone: '555-555-5555',
                    autoAcceptIfMoreThan: 50,
                    autoRejectIfLessThan: 25,
                    minimumOrderAmount: 50,
                    defaultMileRadiusForAutoAcceptReject: 50

                };

                request(server)
                    .post('/account/create')
                    .set('api_key', '1234')
                    .set('Accept', 'application/json')
                    .send(account)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object)
                        done();
                    });
            });
        });

        describe('PUT /account/update/', function() {
            it('should update an account', function(done) {

                var account = {
                    name: 'Jane Doe',
                    address1: '123 Main st',
                    address2: 'Suite 4',
                    city: 'New Albany',
                    state: 'IN',
                    zip: '47150',
                    contactEmail: 'emailAddress@test.com',
                    contactPhone: '555-555-5555',
                    autoAcceptIfMoreThan: 50,
                    autoRejectIfLessThan: 25,
                    minimumOrderAmount: 50,
                    defaultMileRadiusForAutoAcceptReject: 50
                };

                request(server)
                    .put('/account/update/582bebf42150364e146fa538')
                    .set('api_key', '1234')
                    .set('Accept', 'application/json')
                    .query({
                        'id': '582bebf42150364e146fa538'
                    })
                    .send(account)
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