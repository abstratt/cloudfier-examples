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
                console.log("client['name'] = name;\n");
                client['name'] = name;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(client, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
                return Q.npost(client, 'save', [  ]).then(function(saveResult) {
                    return saveResult[0];
                });
            });
        });
    },
    client : function() {
        var me = this;
        return Q().then(function() {
            console.log("return Examples.clientWithName(\"New Client\");");
            return Examples.clientWithName("New Client");
        }).then(function(clientWithName) {
            console.log(clientWithName);
            console.log("return Q.npost(clientWithName, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(clientWithName, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
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
                console.log("task['description'] = description;\n");
                task['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                console.log("task.client = client._id;\nclient.tasks.push(task._id);\n");
                task.client = client._id;
                client.tasks.push(task._id);
            });
        }).then(function() {
            return Q().then(function() {
                console.log("return Q.npost(task, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
                return Q.npost(task, 'save', [  ]).then(function(saveResult) {
                    return saveResult[0];
                });
            });
        });
    },
    task : function() {
        var me = this;
        return Q().then(function() {
            console.log("return Examples.client();");
            return Examples.client();
        }).then(function(client) {
            console.log(client);
            console.log("return Examples.taskWithName(\"New Task\", client);");
            return Examples.taskWithName("New Task", client);
        }).then(function(taskWithName) {
            console.log(taskWithName);
            console.log("return Q.npost(taskWithName, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(taskWithName, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
        });
    }
};

exports = module.exports = Examples; 
