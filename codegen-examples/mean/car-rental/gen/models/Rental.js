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
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Rental').find().where({\n    $and : [ \n        { car : c },\n        { returned : null }\n    ]\n}).findOne(), 'exec', [  ])\n;\n");
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
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Rental').find().where({\n    $and : [ \n        { customer : c },\n        { returned : null }\n    ]\n}).findOne(), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find().where({
            $and : [ 
                { customer : c },
                { returned : null }
            ]
        }).findOne(), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.inProgress = function () {
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Rental').find().where({ returned : null }), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find().where({ returned : null }), 'exec', [  ])
        ;
    });
};

rentalSchema.statics.all = function () {
    return Q().then(function() {
        console.log("return Q.npost(mongoose.model('Rental').find(), 'exec', [  ])\n;\n");
        return Q.npost(mongoose.model('Rental').find(), 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

rentalSchema.virtual('description').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(Car, 'findOne', [ ({ _id : me.car }) ]);");
        return Q.npost(Car, 'findOne', [ ({ _id : me.car }) ]);
    }).then(function(car) {
        console.log("return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);");
        return Q.npost(Model, 'findOne', [ ({ _id : car.model }) ]);
    }).then(function(model) {
        console.log("return model.description;");
        return model.description;
    }).then(function(description) {
        console.log("return description + \" on \" + me.started;\n");
        return description + " on " + me.started;
    });
});

rentalSchema.virtual('inProgress').get(function () {
    return this.returned == null;
});
/*************************** PRIVATE OPS ***********************/

rentalSchema.methods.finish = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
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
};

// declare model on the schema
var exports = module.exports = mongoose.model('Rental', rentalSchema);
