var Q = require("q");
var mongoose = require('./db.js');    
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
        "default" : null
    },
    make : {
        type : Schema.Types.ObjectId,
        ref : "Make"
    }
});

/*************************** DERIVED PROPERTIES ****************/

modelSchema.virtual('description').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Make, 'findOne', [ ({ _id : me.make }) ]);");
        return Q.npost(Make, 'findOne', [ ({ _id : me.make }) ]);
    }).then(function(make) {
        console.log(make);
        console.log("return make['name'] + \" \" + me['name'];\n");
        return make['name'] + " " + me['name'];
    });
});

// declare model on the schema
var exports = module.exports = mongoose.model('Model', modelSchema);
