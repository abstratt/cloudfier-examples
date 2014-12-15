var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Car = require('./Car.js');
var Rental = require('./Rental.js');

// declare schema
var carModelSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    make : {
        type : Schema.Types.ObjectId,
        ref : "Make"
    }
});
//            carModelSchema.set('toObject', { getters: true });


/*************************** DERIVED PROPERTIES ****************/

carModelSchema.methods.getDescription = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Make.js'), 'findOne', [ ({ _id : me.make }) ]);
    }).then(function(make) {
        return make.name + " " + me.name;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('CarModel', carModelSchema);
