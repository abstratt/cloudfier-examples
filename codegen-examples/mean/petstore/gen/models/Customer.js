var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

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
var Customer = mongoose.model('Customer', customerSchema);


var exports = module.exports = Customer;
