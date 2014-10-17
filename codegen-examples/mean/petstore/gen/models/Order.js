var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var orderSchema = new Schema({
    orderDate : {
        type : Date
    },
    orderStatus : {
        type : String,
        enum : ["New", "Processing", "Completed"]
    },
    customer : {
        type : Schema.Types.ObjectId,
        ref : "Customer",
        required : true
    },
    items : [{
        quantity : {
            type : Number,
            required : true
        },
        product : {
            type : Schema.Types.ObjectId,
            ref : "Product"
        }
    }]
});
var Order = mongoose.model('Order', orderSchema);

/*************************** ACTIONS ***************************/

orderSchema.methods.addItem = function (product, quantity) {
    var i = new OrderDetail();
    i.product = product;
    i.quantity = quantity;
    i.order = this;
    this.handleEvent('addItem');
};

orderSchema.methods.complete = function () {
    this.handleEvent('complete');    
};

orderSchema.methods.process = function () {
    this.handleEvent('process');    
};
/*************************** DERIVED PROPERTIES ****************/

orderSchema.virtual('orderWeightTotal').get(function () {
    return this.computeWeightTotal();
});

orderSchema.virtual('orderTotal').get(function () {
    return this.computeOrderTotal();
});
/*************************** PRIVATE OPS ***********************/

orderSchema.methods.computeOrderTotal = function () {
    return reduce;
    this.handleEvent('computeOrderTotal');
};

orderSchema.methods.computeWeightTotal = function () {
    return reduce;
    this.handleEvent('computeWeightTotal');
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


var exports = module.exports = Order;
