var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
    username: String,
    token: String,
    resetToken: String,
    resetTokenDate: { type: Date, default: Date.now },
    resetTokenTimeout: String,
    active: Boolean,
    isSuperUser: Boolean,
    name: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    contactEmail: String,
    contactPhone: String,
    description: String,
    geoCode: Object,
    loc: Object,
    autoAcceptIfMoreThan: Number,
    autoRejectIfLessThan: Number,
    minimumOrderAmount: Number,
    defaultMileRadiusForAutoAcceptReject: Number,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Account', AccountSchema);