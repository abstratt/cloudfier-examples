var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var rentalSchema = new Schema({
    started : {
        type : Date
    },
    returned : {
        type : Date
    },
    car : {
        type : Schema.Types.ObjectId,
        ref : "Car"
    },
    customer : {
        type : Schema.Types.ObjectId,
        ref : "Customer"
    }
});
var Rental = mongoose.model('Rental', rentalSchema);

/*************************** QUERIES ***************************/

rentalSchema.statics.currentForCar = function (c) {
    return count.exec();
};

rentalSchema.statics.currentForCustomer = function (c) {
    return count.exec();
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.virtual('description').get(function () {
    return this.car.model.description + " on " + this.started;
});

rentalSchema.virtual('inProgress').get(function () {
    return this.returned == null;
});
/*************************** PRIVATE OPS ***********************/

rentalSchema.methods.finish = function () {
    this.returned = new Date();
};

var exports = module.exports = Rental;
