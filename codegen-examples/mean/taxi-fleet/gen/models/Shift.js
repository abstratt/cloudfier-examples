var Q = require("q");
var mongoose = require('./db.js');    
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
//            shiftSchema.set('toObject', { getters: true });

/*************************** INVARIANTS ***************************/



/*************************** DERIVED RELATIONSHIPS ****************/

shiftSchema.methods.getTaxis = function () {
    var me = this;
    return Q().then(function() {
        console.log("return mongoose.model('Taxi').find().where({ shift : this });\n");
        return mongoose.model('Taxi').find().where({ shift : this });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Shift', shiftSchema);
