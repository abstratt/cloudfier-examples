var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

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
var Task = mongoose.model('Task', taskSchema);

/*************************** ACTIONS ***************************/

taskSchema.methods.addWork = function (units) {
    var newWork = new Work();
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
    return this.countUnits(this.toInvoice);
});
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.method.getToInvoice = function () {
    return this.reported.where('invoiced').ne(true);
};
/*************************** PRIVATE OPS ***********************/

taskSchema.methods.countUnits = function (work) {
    return this.model('Work').aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result');
};

var exports = module.exports = Task;
