var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var userSchema = new Schema({
    email : {
        type : String
    },
    name : {
        type : String,
        required : true
    }
});


// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
