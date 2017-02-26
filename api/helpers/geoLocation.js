'use strict';
var q = require('q');
var Global = require("../../globals.js");
var NodeGeocoder = require('node-geocoder');

var getCoordsForAccount = function(req) {
    var deferred = q.defer();

    var options = Global.options;
    var geocoder = NodeGeocoder(options);
    var address1 = req.body.address1 || "";
    var address2 = req.body.address2 || "";
    var city = req.body.city || "";
    var state = req.body.state || "";
    var zip = req.body.zipCode || "";
    var addressToGeoCode = address1 + " " + address2 + " " + city + " " + state + " " + zip;

    geocoder.geocode(addressToGeoCode).then(
            function(geoCodedResult) {
                // Success!
                var result = {};
                result = geoCodedResult;
                deferred.resolve(result);
            })
        .catch(function(err) {
            console.log(err);
        });
    return deferred.promise;
};

var getCoordsForOrder = function(req) {
    var deferred = q.defer();

    var options = Global.options;
    var geocoder = NodeGeocoder(options);

    var toAddress1 = req.body.toAddress1 || "";
    var toAddress2 = req.body.toAddress2 || "";
    var toCity = req.body.toCity || "";
    var toState = req.body.toState || "";
    var toZipCode = req.body.toZipCode || "";
    var addressToGeoCode = toAddress1 + " " + toAddress2 + " " + toCity + " " + toState + " " + toZipCode;


    var fromAddress1 = req.body.fromAddress1 || "";
    var fromAddress2 = req.body.fromAddress2 || "";
    var fromCity = req.body.fromCity || "";
    var fromState = req.body.fromState || "";
    var fromZipCode = req.body.fromZipCode || "";
    var addressFromGeoCode = fromAddress1 + " " + fromAddress2 + " " + fromCity + " " + fromState + " " + fromZipCode;

    geocoder.geocode(addressToGeoCode).then(
            function(toGeoCodedResult) {
                // Success!
                //console.log(toGeoCodedResult);
                geocoder.geocode(addressFromGeoCode).then(
                        function(fromGeoCodedResult) {
                            // Success!
                            //console.log(fromGeoCodedResult);
                            var result = {};
                            result.toGeoCode = toGeoCodedResult;
                            result.fromGeoCode = fromGeoCodedResult;
                            deferred.resolve(result);
                        })
                    .catch(function(err) {
                        console.log(err);
                    });
            })
        .catch(function(err) {
            console.log(err);
        });
    return deferred.promise;
};

var getCoordsByZip = function(zipCode) {
    var deferred = q.defer();

    var options = Global.options;
    var geocoder = NodeGeocoder(options);

    geocoder.geocode(zipCode).then(
            function(geoCodedResult) {
                // Success!
                deferred.resolve(geoCodedResult);
            })
        .catch(function(err) {
            console.log(err);
        });
    return deferred.promise;
};

module.exports = {
    getCoordsForAccount: getCoordsForAccount,
    getCoordsForOrder: getCoordsForOrder,
    getCoordsByZip: getCoordsByZip
};