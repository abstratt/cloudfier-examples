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
            /*sync*/console.log("return new Date();");
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
    return Q().then(function() {
        /*sync*/console.log("return me.orderStatus == \"New\";");
        return me.orderStatus == "New";
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'petstore::Order::addItem')");
            error.context = 'petstore::Order::addItem';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            return Q().then(function() {
                console.log("i = new OrderDetail();\n");
                i = new OrderDetail();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Product, 'findOne', [ ({ _id : product._id }) ]);");
                return Q.npost(Product, 'findOne', [ ({ _id : product._id }) ]);
            }).then(function(product) {
                console.log("i.product = product._id\n;\n");
                i.product = product._id
                ;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Integer, 'findOne', [ ({ _id : quantity._id }) ]);");
                return Q.npost(Integer, 'findOne', [ ({ _id : quantity._id }) ]);
            }).then(function(quantity) {
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
    });
};

orderSchema.methods.complete = function () {
};

orderSchema.methods.process = function () {
};
/*************************** DERIVED PROPERTIES ****************/

orderSchema.methods.getOrderWeightTotal = function () {
    console.log("this.orderWeightTotal: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.computeWeightTotal();");
        return me.computeWeightTotal();
    }).then(function(computeWeightTotal) {
        console.log("return computeWeightTotal;\n");
        return computeWeightTotal;
    });
};

orderSchema.methods.getOrderTotal = function () {
    console.log("this.orderTotal: " + JSON.stringify(this));
    var me = this;
    return Q().then(function() {
        console.log("return me.computeOrderTotal();");
        return me.computeOrderTotal();
    }).then(function(computeOrderTotal) {
        console.log("return computeOrderTotal;\n");
        return computeOrderTotal;
    });
};
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
                break;
            }
            if (this.orderStatus == 'New') {
                this.orderStatus = 'New';
                break;
            }
            break;
        
        case 'complete' :
            if (this.orderStatus == 'Processing') {
                this.orderStatus = 'Completed';
                break;
            }
            break;
    }
    console.log("completed handleEvent("+ event+")");
    return Q.npost( this, 'save', [  ]);
};

orderSchema.methods.process = function () {
    return this.handleEvent('process');
};
orderSchema.methods.complete = function () {
    return this.handleEvent('complete');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Order', orderSchema);
