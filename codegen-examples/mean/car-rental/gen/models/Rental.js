    var EventEmitter = require('events').EventEmitter;        

    var rentalSchema = new Schema({
        description : String,
        started : Date,
        returned : Date,
        inProgress : Boolean
    });
    
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
    var Rental = mongoose.model('Rental', rentalSchema);
    Rental.emitter = new EventEmitter();
