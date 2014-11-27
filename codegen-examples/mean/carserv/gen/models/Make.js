var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Customer = require('./Customer.js');
var Model = require('./Model.js');
var AutoMechanic = require('./AutoMechanic.js');
var Car = require('./Car.js');
var Service = require('./Service.js');
var Person = require('./Person.js');

// declare schema
var makeSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    models : [{
        type : Schema.Types.ObjectId,
        ref : "Model",
        "default" : []
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Make', makeSchema);
