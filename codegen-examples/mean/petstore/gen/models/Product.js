var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Category = require('./Category.js');
var Customer = require('./Customer.js');
var Order = require('./Order.js');

// declare schema
var productSchema = new Schema({
    productName : {
        type : String,
        "default" : null
    },
    productPrice : {
        type : Number,
        "default" : null
    },
    unitCost : {
        type : Number,
        "default" : null
    },
    productDescription : {
        type : String,
        "default" : null
    },
    productWeight : {
        type : Number,
        "default" : 0.0
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : "Category",
        required : true
    }
});
//            productSchema.set('toObject', { getters: true });

/*************************** INVARIANTS ***************************/





// declare model on the schema
var exports = module.exports = mongoose.model('Product', productSchema);
