var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var userSchema = new Schema({
    email : {
        type : String
    },
    name : {
        type : String,
        required : true
    }
});
var User = mongoose.model('User', userSchema);


var exports = module.exports = User;
