    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var categorySchema = new Schema({
        name : {
            type : String,
            required : true
        }
    });
    var Category = mongoose.model('Category', categorySchema);
    Category.emitter = new EventEmitter();
    
    
    var exports = module.exports = Category;
