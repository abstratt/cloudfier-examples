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
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("i = new OrderDetail();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            i = new OrderDetail();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("i['product'] = product;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            i['product'] = product;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("i['quantity'] = quantity;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            i['quantity'] = quantity;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("i['order'] = me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            i['order'] = me;
        });
    });
};

orderSchema.methods.complete = function () {
};

orderSchema.methods.process = function () {
};
/*************************** DERIVED PROPERTIES ****************/

orderSchema.virtual('orderWeightTotal').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.computeWeightTotal();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.computeWeightTotal();
    }).then(function(call_computeWeightTotal) {
        return call_computeWeightTotal;
    });
});

orderSchema.virtual('orderTotal').get(function () {
    var me = this;
    return Q.when(function() {
        console.log("return me.computeOrderTotal();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me.computeOrderTotal();
    }).then(function(call_computeOrderTotal) {
        return call_computeOrderTotal;
    });
});
/*************************** PRIVATE OPS ***********************/

orderSchema.methods.computeOrderTotal = function () {
    var me = this;
    return Q.when(function() {
        console.log("return /*TBD*/reduce.exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return /*TBD*/reduce.exec();
    });
};

orderSchema.methods.computeWeightTotal = function () {
    var me = this;
    return Q.when(function() {
        console.log("return /*TBD*/reduce.exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return /*TBD*/reduce.exec();
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
