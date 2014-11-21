var q = require("q");
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
        default : (function() {
            return new Date();
        })()
    },
    orderStatus : {
        type : String,
        enum : ["New", "Processing", "Completed"],
        default : "New"
    },
    customer : {
        type : Schema.Types.ObjectId,
        ref : "Customer",
        required : true
    },
    items : [{
        quantity : {
            type : Number,
            required : true,
            default : 1
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
    return q().then(function() {
        return q().then(function() {
            i = new OrderDetail();
        });
    }).then(function() {
        return q().then(function() {
            i['product'] = product;
        });
    }).then(function() {
        return q().then(function() {
            i['quantity'] = quantity;
        });
    }).then(function() {
        return q().then(function() {
            i['order'] = this;
        });
    });
};

orderSchema.methods.complete = function () {
};

orderSchema.methods.process = function () {
};
/*************************** DERIVED PROPERTIES ****************/

orderSchema.virtual('orderWeightTotal').get(function () {
    return q().then(function() {
        return this.computeWeightTotal();
    }).then(function(call_computeWeightTotal) {
        return call_computeWeightTotal;
    });
});

orderSchema.virtual('orderTotal').get(function () {
    return q().then(function() {
        return this.computeOrderTotal();
    }).then(function(call_computeOrderTotal) {
        return call_computeOrderTotal;
    });
});
/*************************** PRIVATE OPS ***********************/

orderSchema.methods.computeOrderTotal = function () {
    return q().then(function() {
        return /*TBD*/reduce.exec();
    });
};

orderSchema.methods.computeWeightTotal = function () {
    return q().then(function() {
        return /*TBD*/reduce.exec();
    });
};
/*************************** STATE MACHINE ********************/
orderSchema.methods.handleEvent = function (event) {
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
};

orderSchema.methods.process = function () {
    this.handleEvent('process');
};
orderSchema.methods.complete = function () {
    this.handleEvent('complete');
};


// declare model on the schema
var exports = module.exports = mongoose.model('Order', orderSchema);
