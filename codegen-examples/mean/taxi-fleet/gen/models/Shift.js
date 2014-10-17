var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  Shift modalities. 
 */
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
var Shift = mongoose.model('Shift', shiftSchema);

/*************************** DERIVED RELATIONSHIPS ****************/

shiftSchema.method.getTaxis = function () {
    return this.model('Taxi').find().where('shift').eq(this);
};

var exports = module.exports = Shift;
