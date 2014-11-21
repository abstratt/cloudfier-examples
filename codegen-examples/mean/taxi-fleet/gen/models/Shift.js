var q = require("q");
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
        required : true,
        default : null
    },
    price : {
        type : Number,
        required : true,
        default : 0
    },
    shiftsPerDay : {
        type : Number,
        required : true,
        default : 1
    }
});
/*************************** INVARIANTS ***************************/

shiftSchema.path('shiftsPerDay').validate(
    function() {
        return this['shiftsPerDay'] > 0;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

shiftSchema.path('shiftsPerDay').validate(
    function() {
        return this['shiftsPerDay'] <= 3;
    },
    'validation of `{PATH}` failed with value `{VALUE}`'
);

/*************************** DERIVED RELATIONSHIPS ****************/

shiftSchema.methods.getTaxis = function () {
    return q(/*leaf*/).then(function() {
        return this.model('Taxi').find().where({ shift : this });
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Shift', shiftSchema);
