var mongoose = require('mongoose');
var AccountSchema = new mongoose.Schema({
    name: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    contactEmail: String,
    contactPhone: String,
    description: Number,
    autoAcceptIfMoreThan: Number,
    autoRejectIfLessThan: Number,
    MinimumOrderAmount: Number,
    autoRejectIfLessThan1: Number,
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Account', AccountSchema);