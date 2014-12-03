var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Todo = require('./Todo.js');

// declare schema
var userSchema = new Schema({
    email : {
        type : String,
        "default" : null
    },
    name : {
        type : String,
        "default" : null
    }
});
//            userSchema.set('toObject', { getters: true });



// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
