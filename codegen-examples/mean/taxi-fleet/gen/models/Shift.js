    var EventEmitter = require('events').EventEmitter;
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
        },
        taxis : [{
            type : Schema.Types.ObjectId,
            ref : "Taxi"
        }]
    });
    var Shift = mongoose.model('Shift', shiftSchema);
    Shift.emitter = new EventEmitter();
    
    /*************************** DERIVED PROPERTIES ****************/
    
    shiftSchema.methods.getTaxis = function () {
        return this.model('Taxi').find().where('shift').eq(this);
    };
    
    var exports = module.exports = Shift;
