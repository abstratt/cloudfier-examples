var q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Category = require('./Category.js');
var Customer = require('./Customer.js');
var Order = require('./Order.js');

// declare schema
var productSchema = new Schema({
    productName : {
        type : String,
        required : true,
        default : null
    },
    productPrice : {
        type : Number,
        default : 0
    },
    unitCost : {
        type : Number,
        default : 0
    },
    productDescription : {
        type : String,
        default : null
    },
    productWeight : {
        type : Number,
        default : 0.0
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : "Category",
        required : true
    }
});
/*************************** INVARIANTS ***************************/

productSchema.path('productPrice').validate(
    function() {
        return this['productPrice'] > 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

productSchema.path('unitCost').validate(
    function() {
        return this['unitCost'] > 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

productSchema.path('productWeight').validate(
    function() {
        return this['productWeight'] >= 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);


// declare model on the schema
var exports = module.exports = mongoose.model('Product', productSchema);
