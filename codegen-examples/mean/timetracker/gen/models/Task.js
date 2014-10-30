var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Client = require('./Client.js');
var Invoice = require('./Invoice.js');

// declare schema
var taskSchema = new Schema({
    description : {
        type : String,
        required : true,
        default : null
    },
    client : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    },
    reported : [{
        units : {
            type : Number,
            required : true,
            default : 0
        },
        date : {
            type : Date,
            required : true,
            default : (function() {
                // isAsynchronous: false        
                console.log("return new Date()");
                return new Date();
            })()
        },
        memo : {
            type : String,
            default : null
        },
        invoice : {
            type : Schema.Types.ObjectId,
            ref : "Invoice"
        }
    }]
});

/*************************** ACTIONS ***************************/

taskSchema.methods.addWork = function (units) {
    // isAsynchronous: true        
    var newWork;
    console.log("newWork = new Work()");
    newWork = new Work();
    
    console.log("newWork.units = units");
    newWork.units = units;
    
    console.log("// link reported and tasknthis.reported.push(newWork);nnewWork.task = this");
    // link reported and task
    this.reported.push(newWork);
    newWork.task = this;
    
    console.log("return newWork");
    return newWork;
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED PROPERTIES ****************/

taskSchema.virtual('unitsReported').get(function () {
    // isAsynchronous: false        
    console.log("return this.countUnits(this.reported)");
    return this.countUnits(this.reported);
});

taskSchema.virtual('unitsToInvoice').get(function () {
    // isAsynchronous: false        
    console.log("return this.countUnits(this.getToInvoice())");
    return this.countUnits(this.getToInvoice());
});
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    // isAsynchronous: false        
    console.log("return this.reported.where({n    $ne : [ n        { 'invoiced' : true },n        truen    ]n})");
    return this.reported.where({
        $ne : [ 
            { 'invoiced' : true },
            true
        ]
    });
};
/*************************** PRIVATE OPS ***********************/

taskSchema.methods.countUnits = function (work) {
    // isAsynchronous: false        
    console.log("return Work.aggregate()n              .group({ _id: null, result: { $sum: '$units' } })n              .select('-id result').exec()");
    return Work.aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result').exec();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
