    var EventEmitter = require('events').EventEmitter;
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
        orderWeightTotal : {
            type : Number
        },
        orderTotal : {
            type : Number
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
            weight : {
                type : Number
            },
            price : {
                type : Number
            },
            unitPrice : {
                type : Number
            },
            product : {
                type : Schema.Types.ObjectId,
                ref : "Product"
            }
        }]
    });
    var Order = mongoose.model('Order', orderSchema);
    Order.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    orderSchema.methods.addItem = function (product, quantity) {
        i = new OrderDetail();
        i.product = product;
        i.quantity = quantity;
        i.order = this;
    };
    
    orderSchema.methods.complete = function () {};
    
    orderSchema.methods.process = function () {};
    /*************************** DERIVED PROPERTIES ****************/
    
    orderSchema.methods.getOrderWeightTotal = function () {
        return this.computeWeightTotal();
    };
    
    orderSchema.methods.getOrderTotal = function () {
        return this.computeOrderTotal();
    };
    /*************************** PRIVATE OPS ***********************/
    
    orderSchema.methods.computeOrderTotal = function () {
        return reduce;
    };
    
    orderSchema.methods.computeWeightTotal = function () {
        return reduce;
    };
    /*************************** STATE MACHINE ********************/
    Order.emitter.on('process', function () {
        if (this.orderStatus == 'New') {
            this.orderStatus = 'Processing';
            return;
        }
        if (this.orderStatus == 'New') {
            this.orderStatus = 'New';
            return;
        }
    });     
    
    Order.emitter.on('complete', function () {
        if (this.orderStatus == 'Processing') {
            this.orderStatus = 'Completed';
            return;
        }
    });     
    
    
    var exports = module.exports = Order;
