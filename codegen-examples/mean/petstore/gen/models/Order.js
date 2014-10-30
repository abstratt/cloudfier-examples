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
            // isAsynchronous: false        
            console.log("return new Date()");
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
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.orderStatus == 'New'");
        return this.orderStatus == "New";
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.orderStatus == 'New'');\n    return this.orderStatus == 'New';\n}");
        throw "Precondition on addItem was violated"
    }
    var i;
    console.log("i = new OrderDetail()");
    i = new OrderDetail();
    
    console.log("i.product = product");
    i.product = product;
    
    console.log("i.quantity = quantity");
    i.quantity = quantity;
    
    console.log("i.order = this");
    i.order = this;
    this.handleEvent('addItem');
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

orderSchema.methods.complete = function () {
    this.handleEvent('complete');    
};

orderSchema.methods.process = function () {
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !isEmpty");
        return !isEmpty;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !isEmpty');\n    return !isEmpty;\n}");
        throw "Precondition on process was violated"
    }
    this.handleEvent('process');    
};
/*************************** DERIVED PROPERTIES ****************/

orderSchema.virtual('orderWeightTotal').get(function () {
    // isAsynchronous: false        
    console.log("return this.computeWeightTotal()");
    return this.computeWeightTotal();
});

orderSchema.virtual('orderTotal').get(function () {
    // isAsynchronous: false        
    console.log("return this.computeOrderTotal()");
    return this.computeOrderTotal();
});
/*************************** PRIVATE OPS ***********************/

orderSchema.methods.computeOrderTotal = function () {
    // isAsynchronous: false        
    console.log("return reduce.exec()");
    return reduce.exec();
};

orderSchema.methods.computeWeightTotal = function () {
    // isAsynchronous: false        
    console.log("return reduce.exec()");
    return reduce.exec();
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


// declare model on the schema
var exports = module.exports = mongoose.model('Order', orderSchema);
