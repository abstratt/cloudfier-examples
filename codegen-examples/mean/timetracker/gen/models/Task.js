var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

// declare schema
var taskSchema = new Schema({
    description : {
        type : String,
        required : true
    },
    client : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    },
    reported : [{
        units : {
            type : Number,
            required : true
        },
        date : {
            type : Date,
            required : true
        },
        memo : {
            type : String
        },
        invoice : {
            type : Schema.Types.ObjectId,
            ref : "Invoice"
        }
    }]
});

/*************************** ACTIONS ***************************/

taskSchema.methods.addWork = function (units) {
    var newWork = new require('./Work.js') ();
    newWork.units = units;
    // link reported and task
    this.reported.push(newWork);
    newWork.task = this;
    return newWork;
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
                  .select('-id result');
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
