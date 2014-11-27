var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Taxi = require('./Taxi.js');
var Driver = require('./Driver.js');
var Charge = require('./Charge.js');

/**
 *  Shift modalities. 
 */
// declare schema
var shiftSchema = new Schema({
    description : {
        type : String,
        "default" : null
    },
    price : {
        type : Number,
        "default" : 0
    },
    shiftsPerDay : {
        type : Number,
        "default" : 1
    }
});
/*************************** INVARIANTS ***************************/



/*************************** DERIVED RELATIONSHIPS ****************/

shiftSchema.methods.getTaxis = function () {
    var me = this;
    return Q().then(function() {
        console.log("return this.model('Taxi').find().where({ shift : this });\n");
        return this.model('Taxi').find().where({ shift : this });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Shift', shiftSchema);
