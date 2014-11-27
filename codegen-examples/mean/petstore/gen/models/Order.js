var Q = require("q");
var mongoose = require('mongoose');    
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

/*************************** ACTIONS ***************************/

orderSchema.methods.addItem = function (product, quantity) {
    var i;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("i = new OrderDetail();\n");
            i = new OrderDetail();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(product);\nconsole.log(\"That: \");\nconsole.log(i);\ni.product = product._id\n;\n");
            console.log("This: ");
            console.log(product);
            console.log("That: ");
            console.log(i);
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
            console.log("console.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(i);\ni.order = me._id;\nconsole.log(\"This: \");\nconsole.log(i);\nconsole.log(\"That: \");\nconsole.log(me);\nme.items.push(i._id);\n");
            console.log("This: ");
            console.log(me);
            console.log("That: ");
            console.log(i);
            i.order = me._id;
            console.log("This: ");
            console.log(i);
            console.log("That: ");
            console.log(me);
            me.items.push(i._id);
        });
    }).then(function() {
        return me.save();
    });
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
        console.log(computeWeightTotal);
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
        console.log(computeOrderTotal);
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
    console.log("started handleEvent("+ event+"): "+ this);
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
