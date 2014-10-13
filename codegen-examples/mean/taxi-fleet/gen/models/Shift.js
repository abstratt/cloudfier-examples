    var EventEmitter = require('events').EventEmitter;        

    /**
     *  Shift modalities. 
     */
    var shiftSchema = new Schema({
        description : String,
        price : Number,
        shiftsPerDay : Number
    });
    
    /*************************** DERIVED PROPERTIES ****************/
    
    shiftSchema.methods.getTaxis = function () {
        return this.model('Taxi').find().where('shift').eq(this);
    };
    var Shift = mongoose.model('Shift', shiftSchema);
    Shift.emitter = new EventEmitter();
