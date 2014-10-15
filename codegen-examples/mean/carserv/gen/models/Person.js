    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var personSchema = new Schema({
        fullName : {
            type : String
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        username : {
            type : String
        }
    });
    var Person = mongoose.model('Person', personSchema);
    Person.emitter = new EventEmitter();
    
    /*************************** DERIVED PROPERTIES ****************/
    
    personSchema.methods.getFullName = function () {
        return this.firstName + " " + this.lastName;
    };
    
    var exports = module.exports = Person;
