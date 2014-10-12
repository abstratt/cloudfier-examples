    var EventEmitter = require('events').EventEmitter;        

    var examplesSchema = new Schema({
    });
    
    
    
    
    /*************************** PRIVATE OPS ***********************/
    
    examplesSchema.statics.clientWithName = function (name) {
        client = new Client();
        client.name = name;
        return client;
    };
    
    examplesSchema.statics.client = function () {
        return Examples.clientWithName("New Client");
    };
    
    examplesSchema.statics.taskWithName = function (description, client) {
        task = new Task();
        task.description = description;
        task.client = client;
        return task;
    };
    
    examplesSchema.statics.task = function () {
        return Examples.taskWithName("New Task", Examples.client());
    };
    
    var Examples = mongoose.model('Examples', examplesSchema);
    Examples.emitter = new EventEmitter();
