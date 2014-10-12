    var EventEmitter = require('events').EventEmitter;        

    var employeePaymentServiceSchema = new Schema({
    });
    
    
    
    
    
    var EmployeePaymentService = mongoose.model('EmployeePaymentService', employeePaymentServiceSchema);
    EmployeePaymentService.emitter = new EventEmitter();
