var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var categorySchema = new Schema({
    name : {
        type : String,
        required : true
    }
});


// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
