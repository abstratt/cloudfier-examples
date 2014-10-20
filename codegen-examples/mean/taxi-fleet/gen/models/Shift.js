var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  Shift modalities. 
 */
// declare schema
var shiftSchema = new Schema({
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    shiftsPerDay : {
        type : Number,
        required : true
    }
});

/*************************** DERIVED RELATIONSHIPS ****************/

shiftSchema.methods.getTaxis = function () {
    return getEntity('Taxi').find().where('shift').eq(this);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Shift', shiftSchema);
