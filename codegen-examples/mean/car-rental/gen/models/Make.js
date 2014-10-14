    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;

    var makeSchema = new Schema({
        name : String
    });
    var Make = mongoose.model('Make', makeSchema);
    Make.emitter = new EventEmitter();
    
    
    var exports = module.exports = Make;