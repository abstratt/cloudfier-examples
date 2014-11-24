var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Category = require('./Category.js');
var Order = require('./Order.js');
var Product = require('./Product.js');

// declare schema
var customerSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    },
    username : {
        type : String,
        default : null
    },
    orders : [{
        type : Schema.Types.ObjectId,
        ref : "Order"
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
