'use strict';
var q = require('q');
var Global = require("../../globals.js");
var NodeGeocoder = require('node-geocoder');

var getCoords = function(req) {
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
    getCoords: getCoords,
    getCoordsByZip: getCoordsByZip
};