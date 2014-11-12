var q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Customer = require('./Customer.js');
var Order = require('./Order.js');
var Product = require('./Product.js');

// declare schema
var categorySchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    }
});


// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
