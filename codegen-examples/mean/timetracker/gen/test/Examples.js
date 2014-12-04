require('../models/index.js');

var Q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = {
    clientWithName : function(name) {
        var client;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                console.log("client = new Client();\n");
                client = new Client();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(String, 'findOne', [ ({ _id : name._id }) ]);");
                return Q.npost(String, 'findOne', [ ({ _id : name._id }) ]);
            }).then(function(name) {
                console.log("client['name'] = name;\n");
                client['name'] = name;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return client;\n");
                return client;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(client, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    },
    client : function() {
        var me = this;
        return Q().then(function() {
            console.log("return Examples.clientWithName(\"New Client\");");
            return Examples.clientWithName("New Client");
        }).then(function(clientWithName) {
            console.log("return clientWithName;\n");
            return clientWithName;
        });
    },
    taskWithName : function(description, client) {
        var task;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                console.log("task = new Task();\n");
                task = new Task();
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(String, 'findOne', [ ({ _id : description._id }) ]);");
                return Q.npost(String, 'findOne', [ ({ _id : description._id }) ]);
            }).then(function(description) {
                console.log("task['description'] = description;\n");
                task['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(Client, 'findOne', [ ({ _id : client._id }) ]);");
                return Q.npost(Client, 'findOne', [ ({ _id : client._id }) ]);
            }).then(function(client) {
                console.log("task.client = client._id;\nclient.tasks.push(task._id);\n");
                task.client = client._id;
                client.tasks.push(task._id);
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return task;\n");
                return task;
            });
        }).then(function(__result__) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(task, 'save', [  ]);
                })
            ]).spread(function() {
                return __result__;    
            });
        });
    },
    task : function() {
        var me = this;
        return Q().then(function() {
            console.log("return Examples.client();");
            return Examples.client();
        }).then(function(client) {
            console.log("return Examples.taskWithName(\"New Task\", client);");
            return Examples.taskWithName("New Task", client);
        }).then(function(taskWithName) {
            console.log("return taskWithName;\n");
            return taskWithName;
        });
    }
};

exports = module.exports = Examples; 
