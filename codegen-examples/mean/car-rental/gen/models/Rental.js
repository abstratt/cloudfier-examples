    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;

    var rentalSchema = new Schema({
        description : String,
        started : Date,
        returned : Date,
        inProgress : Boolean,
        car : { type: Schema.Types.ObjectId, ref: 'Car' },
        customer : { type: Schema.Types.ObjectId, ref: 'Customer' }
    });
    var Rental = mongoose.model('Rental', rentalSchema);
    Rental.emitter = new EventEmitter();
    
    /*************************** DERIVED PROPERTIES ****************/
    
    rentalSchema.methods.getDescription = function () {
        return this.car.model.description + " on " + this.started;
    };
    
    rentalSchema.methods.getInProgress = function () {
        return this.returned == null;
    };
    /*************************** PRIVATE OPS ***********************/
    
    rentalSchema.methods.finish = function () {
        this.returned = new Date();
    };
    
    var exports = module.exports = Rental;