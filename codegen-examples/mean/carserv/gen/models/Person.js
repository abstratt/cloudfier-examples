var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var personSchema = new Schema({
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

/*************************** DERIVED PROPERTIES ****************/

personSchema.virtual('fullName').get(function () {
    return this.firstName + " " + this.lastName;
});

var exports = module.exports = Person;
