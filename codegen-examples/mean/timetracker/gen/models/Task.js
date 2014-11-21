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
    var newWork;
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            newWork = new Work();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newWork['units'] = units;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            // link reported and task
            this.reported.push(newWork);
            newWork.task = this;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newWork.save();
            return q(newWork);
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

taskSchema.virtual('unitsReported').get(function () {
    return this.countUnits(this['reported']);
});

taskSchema.virtual('unitsToInvoice').get(function () {
    return q(/*parallel*/).all([
        q(/*leaf*/).then(function() {
            return this.getToInvoice();
        }), q(/*leaf*/).then(function() {
            return this;
        })
    ]).spread(function(read_toInvoice, readSelfAction) {
        return readSelfAction.countUnits(read_toInvoice);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    return q(/*leaf*/).then(function() {
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
