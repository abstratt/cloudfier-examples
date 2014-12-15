var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var CarModel = require('./CarModel.js');
var Car = require('./Car.js');

// declare schema
var rentalSchema = new Schema({
    started : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    returned : {
        type : Date,
        "default" : null
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
//            rentalSchema.set('toObject', { getters: true });


/*************************** QUERIES ***************************/

rentalSchema.statics.currentForCar = function (c) {
    var me = this;
    return Q().then(function() {
        return Q.npost(mongoose.model('Rental').find().where({
            $and : [ 
                { car : c },
                { returned : null }
            ]
        }).findOne(), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.currentForCustomer = function (c) {
    var me = this;
    return Q().then(function() {
        return Q.npost(mongoose.model('Rental').find().where({
            $and : [ 
                { customer : c },
                { returned : null }
            ]
        }).findOne(), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.completedForCustomer = function (c) {
    var me = this;
    return Q().then(function() {
        return Q.npost(mongoose.model('Rental').find().where({
            $and : [ 
                { customer : c },
                {
                    $ne : [ 
                        { returned : null },
                        true
                    ]
                }
            ]
        }), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.inProgress = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(mongoose.model('Rental').find().where({ returned : null }), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.all = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(mongoose.model('Rental').find(), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.methods.getDescription = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./Car.js'), 'findOne', [ ({ _id : me.car }) ]);
    }).then(function(car) {
        return Q.npost(require('./CarModel.js'), 'findOne', [ ({ _id : car.model }) ]);
    }).then(function(model) {
        return model.getDescription();
    }).then(function(description) {
        return description + " on " + me.started;
    });
};

rentalSchema.methods.isInProgress = function () {
    return  this.returned == null;
};
/*************************** PRIVATE OPS ***********************/

rentalSchema.methods.finish = function () {
    var me = this;
    return Q().then(function() {
        return me.isInProgress();
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated: must_be_in_progress (on 'car_rental::Rental::finish')");
            error.context = 'car_rental::Rental::finish';
            error.constraint = 'must_be_in_progress';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            me['returned'] = new Date();
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
                })
            ]).spread(function() {
                /* no-result */    
            });
        })
        ;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Rental', rentalSchema);
