var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Customer = require('./Customer.js');
var CarModel = require('./CarModel.js');
var Car = require('./Car.js');
var Rental = require('./Rental.js');

// declare schema
var makeSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    models : [{
        type : Schema.Types.ObjectId,
        ref : "CarModel",
        "default" : []
    }]
});



// declare model on the schema
var exports = module.exports = mongoose.model('Make', makeSchema);
