    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

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
    var Product = mongoose.model('Product', productSchema);
    Product.emitter = new EventEmitter();
    
    
    var exports = module.exports = Product;
