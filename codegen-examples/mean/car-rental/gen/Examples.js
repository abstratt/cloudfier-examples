    var EventEmitter = require('events').EventEmitter;        

    var examplesSchema = new Schema({
    });
    
    
    
    
    /*************************** PRIVATE OPS ***********************/
    
    examplesSchema.statics.make = function () {
        make = new Make();
        make.name = "Fiat";
        return make;
    };
    
    examplesSchema.statics.model = function () {
        model = new Model();
        model.name = "Mille";
        model.make = Examples.make();
        return model;
    };
    
    examplesSchema.statics.car = function () {
        car = new Car();
        car.year = ;
        car.price = UNKNOWN: 100;
        car.color = "black";
        car.plate = "ABC-1234";
        car.model = Examples.model();
        return car;
    };
    
    examplesSchema.statics.customer = function () {
        customer = new Customer();
        customer.name = "Joana de Almeida";
        return customer;
    };
    
    var Examples = mongoose.model('Examples', examplesSchema);
    Examples.emitter = new EventEmitter();
