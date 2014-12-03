var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Category = require('./Category.js');
var Customer = require('./Customer.js');
var Product = require('./Product.js');

// declare schema
var orderSchema = new Schema({
    orderDate : {
        type : Date,
        "default" : (function() {
            return new Date();
        })()
    },
    orderStatus : {
        type : String,
        enum : ["New", "Processing", "Completed"],
        "default" : "New"
    },
    customer : {
        type : Schema.Types.ObjectId,
        ref : "Customer",
        required : true
    },
    items : [{
        quantity : {
            type : Number,
            "default" : 1
        },
        product : {
            type : Schema.Types.ObjectId,
            ref : "Product"
        }
    }]
});
//            orderSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

orderSchema.methods.addItem = function (product, quantity) {
    var i;
    var me = this;
    return /* Working set: [me] *//* Working set: [me, i] */Q().then(function() {
        return Q().then(function() {
            console.log("i = new OrderDetail();\n");
            i = new OrderDetail();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("i.product = product._id\n;\n");
            i.product = product._id
            ;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("i['quantity'] = quantity;\n");
            i['quantity'] = quantity;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("i.order = me._id;\nme.items.push(i._id);\n");
            i.order = me._id;
            me.items.push(i._id);
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(i, 'save', [  ]);
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

orderSchema.methods.complete = function () {
};

orderSchema.methods.process = function () {
};
/*************************** DERIVED PROPERTIES ****************/

orderSchema.virtual('orderWeightTotal').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.computeWeightTotal();");
        return me.computeWeightTotal();
    }).then(function(computeWeightTotal) {
        console.log("return computeWeightTotal;\n");
        return computeWeightTotal;
    });
});

orderSchema.virtual('orderTotal').get(function () {
    var me = this;
    return Q().then(function() {
        console.log("return me.computeOrderTotal();");
        return me.computeOrderTotal();
    }).then(function(computeOrderTotal) {
        console.log("return computeOrderTotal;\n");
        return computeOrderTotal;
    });
});
/*************************** PRIVATE OPS ***********************/

orderSchema.methods.computeOrderTotal = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(/*TBD*/reduce, 'exec', [  ])\n;\n");
        return Q.npost(/*TBD*/reduce, 'exec', [  ])
        ;
    });
};

orderSchema.methods.computeWeightTotal = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(/*TBD*/reduce, 'exec', [  ])\n;\n");
        return Q.npost(/*TBD*/reduce, 'exec', [  ])
        ;
    });
};
/*************************** STATE MACHINE ********************/
orderSchema.methods.handleEvent = function (event) {
    console.log("started handleEvent("+ event+")");
    switch (event) {
        case 'process' :
            if (this.orderStatus == 'New') {
                this.orderStatus = 'Processing';
                return;
            }
            if (this.orderStatus == 'New') {
                this.orderStatus = 'New';
                return;
            }
            break;
        
        case 'complete' :
            if (this.orderStatus == 'Processing') {
                this.orderStatus = 'Completed';
                return;
            }
            break;
    }
    console.log("completed handleEvent("+ event+"): "+ this);
    
};

orderSchema.methods.process = function () {
    this.handleEvent('process');
};
orderSchema.methods.complete = function () {
    this.handleEvent('complete');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Order', orderSchema);
