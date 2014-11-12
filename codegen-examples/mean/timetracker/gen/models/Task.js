var q = require("q");
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
    return q().then(function() {
        var newWork;
        newWork = new Work();
        newWork['units'] = units;
        // link reported and task
        this.reported.push(newWork);
        newWork.task = this;
        return newWork.save();
    });
};
/*************************** DERIVED PROPERTIES ****************/

taskSchema.virtual('unitsReported').get(function () {
    return this.countUnits(this['reported']);
});

taskSchema.virtual('unitsToInvoice').get(function () {
    return q().then(function() {
        return this.getToInvoice();
    }).then(function(toInvoice) {
        return this.countUnits(toInvoice);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    return q().then(function() {
        return this['reported'].where({
            $ne : [ 
                { 'invoiced' : true },
                true
            ]
        });
    });
};
/*************************** PRIVATE OPS ***********************/

taskSchema.methods.countUnits = function (work) {
    return Work.aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result').exec();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
