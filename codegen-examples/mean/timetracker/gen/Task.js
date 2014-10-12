    var EventEmitter = require('events').EventEmitter;        

    var taskSchema = new Schema({
        description : String,
        unitsReported : Number,
        unitsToInvoice : Number
    });
    
    /*************************** ACTIONS ***************************/
    
    taskSchema.methods.addWork = function (units) {
        newWork = new Work();
        newWork.units = units;
        newWork.reported = this;
        return newWork;
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
    };
    
    var Task = mongoose.model('Task', taskSchema);
    Task.emitter = new EventEmitter();
