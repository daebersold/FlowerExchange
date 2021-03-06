// Before you run these tests, ensure you have the SuperUser Account setup.
// See InsertAdmin.js for more information

var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var Account = require('../../../api/models/Account.js');

// Generate a v4 UUID (random) 
var idgen = require('idgen');
var token = idgen(8);

describe('controllers', function() {

    describe('account', function() {

        describe('POST /account/create', function() {
            it('should create an account using super user account', function(done) {

                var account = {
                    username: 'bigbubba33',
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
                    defaultMileRadiusForAutoAcceptReject: 50,
                    token: token,
                    active: true
                };

                request(server)
                    .post('/account/create')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .set('Accept', 'application/json')
                    .send(account)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res, body) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object);
                        done();
                    });
            });
        });

        describe('GET /account', function() {

            it('should return an account as super user', function(done) {

                request(server)
                    .get('/account')
                    .set('Accept', 'application/json')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Object)
                        done();
                    });
            });

            it('should return own account', function(done) {
                request(server)
                    .get('/account')
                    .set('api_key', token)
                    .set('username', 'bigbubba33')
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

                request(server)
                    .get('/accounts')
                    .set('Accept', 'application/json')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        res.body.should.be.instanceof(Array)
                        done();
                    });
            });

            it('should fail because not superuser', function(done) {
                request(server)
                    .get('/accounts')
                    .set('Accept', 'application/json')
                    .set('api_key', token)
                    .set('username', 'bigbubba33')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(function(err, res) {
                        should.exist(err);
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
                    .put('/account/update')
                    .set('api_key', 'asecretprivatetoken')
                    .set('username', 'bobjohnson1414')
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

    });

});