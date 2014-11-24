var Q = require("q");
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
    var me = this;
    return Q.when(function() {
        console.log("return Make.findOne({ _id : me.make }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Make.findOne({ _id : me.make }).exec();
    }).then(function(read_make) {
        return read_make['name'] + " " + me['name'];
    });
});

// declare model on the schema
var exports = module.exports = mongoose.model('Model', modelSchema);
