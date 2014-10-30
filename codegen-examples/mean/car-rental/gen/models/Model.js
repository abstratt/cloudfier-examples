var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Car = require('./Car.js');
var Rental = require('./Rental.js');

// declare schema
var modelSchema = new Schema({
    name : {
        type : String,
        default : null
    },
    make : {
        type : Schema.Types.ObjectId,
        ref : "Make"
    }
});

/*************************** DERIVED PROPERTIES ****************/

modelSchema.virtual('description').get(function () {
    // isAsynchronous: false        
    console.log("return this.make.name + ' ' + this.name");
    return this.make.name + " " + this.name;
});

// declare model on the schema
var exports = module.exports = mongoose.model('Model', modelSchema);
