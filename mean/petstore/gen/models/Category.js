var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Customer = require('./Customer.js');
var Order = require('./Order.js');
var Product = require('./Product.js');

// declare schema
var categorySchema = new Schema({
    name : {
        type : String,
        "default" : null
    }
});



// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
