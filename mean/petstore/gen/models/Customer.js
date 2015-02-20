var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Category = require('./Category.js');
var Order = require('./Order.js');
var Product = require('./Product.js');

// declare schema
var customerSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    orders : [{
        type : Schema.Types.ObjectId,
        ref : "Order",
        "default" : []
    }]
});



// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
