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
    var newWork = new Work();
    newWork.units = units;
    // link reported and task
    this.reported.push(newWork);
    newWork.task = this;
    return newWork;
    return this.save();
};
/*************************** DERIVED PROPERTIES ****************/

taskSchema.virtual('unitsReported').get(function () {
    return this.countUnits(this.reported);
});

taskSchema.virtual('unitsToInvoice').get(function () {
    return this.countUnits(this.getToInvoice());
});
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    return this.reported.where('invoiced').ne(true);
};
/*************************** PRIVATE OPS ***********************/

taskSchema.methods.countUnits = function (work) {
    return getEntity('Work').aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result').exec();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
