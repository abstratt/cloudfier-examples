var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Make = require('./Make.js');
var Customer = require('./Customer.js');
var Model = require('./Model.js');
var Car = require('./Car.js');

// declare schema
var rentalSchema = new Schema({
    started : {
        type : Date,
        "default" : (function() {
            /*sync*/console.log("return new Date();");
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
        console.log("return Q.npost(mongoose.model('Rental').find().where({\n    $and : [ \n        { /*read-structural-feature*/car : c },\n        { /*read-structural-feature*/returned : null }\n    ]\n}).findOne(), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find().where({
            $and : [ 
                { /*read-structural-feature*/car : c },
                { /*read-structural-feature*/returned : null }
            ]
        }).findOne(), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.currentForCustomer = function (c) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Rental').find().where({\n    $and : [ \n        { /*read-structural-feature*/customer : c },\n        { /*read-structural-feature*/returned : null }\n    ]\n}).findOne(), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find().where({
            $and : [ 
                { /*read-structural-feature*/customer : c },
                { /*read-structural-feature*/returned : null }
            ]
        }).findOne(), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.completedForCustomer = function (c) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Rental').find().where({\n    $and : [ \n        { /*read-structural-feature*/customer : c },\n        {\n            $ne : [ \n                { /*read-structural-feature*/returned : null },\n                true\n            ]\n        }\n    ]\n}), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find().where({
            $and : [ 
                { /*read-structural-feature*/customer : c },
                {
                    $ne : [ 
                        { /*read-structural-feature*/returned : null },
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
        console.log("return Q.npost(mongoose.model('Rental').find().where({ /*read-structural-feature*/returned : null }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find().where({ /*read-structural-feature*/returned : null }), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.all = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Rental').find(), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find(), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.methods.getDescription = function () {
    console.log("this.description: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'findOne', [ ({ _id : me.car }) ]);");
        return Q.npost(Car, 'findOne', [ ({ _id : me.car }) ]);
    }).then(function(car) {
        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
    }).then(function(model) {
        console.log("return model.getDescription();");
        return model.getDescription();
    }).then(function(description) {
        console.log("return description + \" on \" + me.started;\n");
        return description + " on " + me.started;
    });
};

rentalSchema.methods.isInProgress = function () {
    console.log("this.inProgress: " + JSON.stringify(this));
    /*sync*/console.log("return  this.returned == null;");
    return  this.returned == null;
};
/*************************** PRIVATE OPS ***********************/

rentalSchema.methods.finish = function () {
    var me = this;
    return Q().then(function() {
        /*sync*/console.log("return me.isInProgress();");
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
            console.log("me['returned'] = new Date();\n");
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
