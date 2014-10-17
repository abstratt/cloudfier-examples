    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    var taskSchema = new Schema({
        description : {
            type : String,
            required : true
        },
        unitsReported : {
            type : Number
        },
        unitsToInvoice : {
            type : Number
        },
        toInvoice : [{
            type : Schema.Types.ObjectId,
            ref : "Work"
        }],
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
            invoiced : {
                type : Boolean
            },
            client : {
                type : Schema.Types.ObjectId,
                ref : "Client"
            },
            invoice : {
                type : Schema.Types.ObjectId,
                ref : "Invoice"
            }
        }]
    });
    var Task = mongoose.model('Task', taskSchema);
    Task.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    taskSchema.methods.addWork = function (units) {
        newWork = new Work();
        newWork.units = units;
        newWork.reported = this;
        return newWork;
        this.handleEvent('addWork');
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    taskSchema.methods.getToInvoice = function () {
        return this.reported.where('invoiced').ne(true);
    };
    
    taskSchema.methods.getUnitsReported = function () {
        return this.countUnits(this.reported);
    };
    
    taskSchema.methods.getUnitsToInvoice = function () {
        return this.countUnits(this.toInvoice);
    };
    /*************************** PRIVATE OPS ***********************/
    
    taskSchema.methods.countUnits = function (work) {
        return this.model('Work').aggregate()
                      .group({ _id: null, result: { $sum: '$units' } })
                      .select('-id result');
        this.handleEvent('countUnits');
    };
    
    var exports = module.exports = Task;
