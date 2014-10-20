var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var productSchema = new Schema({
    productName : {
        type : String,
        required : true
    },
    productPrice : {
        type : Number
    },
    unitCost : {
        type : Number
    },
    productDescription : {
        type : String
    },
    productWeight : {
        type : Number
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : "Category",
        required : true
    }
});


// declare model on the schema
var exports = module.exports = mongoose.model('Product', productSchema);
