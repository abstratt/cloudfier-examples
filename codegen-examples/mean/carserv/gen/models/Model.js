var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var AutoMechanic = require('./AutoMechanic.js');
var Car = require('./Car.js');
var Service = require('./Service.js');
var Person = require('./Person.js');

// declare schema
var modelSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    },
    make : {
        type : Schema.Types.ObjectId,
        ref : "Make",
        required : true
    }
});


// declare model on the schema
var exports = module.exports = mongoose.model('Model', modelSchema);
