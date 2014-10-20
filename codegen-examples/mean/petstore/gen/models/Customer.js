var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var customerSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String
    },
    orders : [{
        type : Schema.Types.ObjectId,
        ref : "Order"
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Customer', customerSchema);
