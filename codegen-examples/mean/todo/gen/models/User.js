    var EventEmitter = require('events').EventEmitter;
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
    User.emitter = new EventEmitter();
    
    
    var exports = module.exports = User;
