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
                client = new Client();
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(String, 'findOne', [ ({ _id : name._id }) ]);
            }).then(function(name) {
                client['name'] = name;
            });
        }).then(function() {
            return Q().then(function() {
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
            return Examples.clientWithName("New Client");
        }).then(function(clientWithName) {
            return clientWithName;
        });
    },
    taskWithName : function(description, client) {
        var task;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                task = new Task();
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(String, 'findOne', [ ({ _id : description._id }) ]);
            }).then(function(description) {
                task['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(Client, 'findOne', [ ({ _id : client._id }) ]);
            }).then(function(client) {
                task.client = client._id;
                client.tasks.push(task._id);
            });
        }).then(function() {
            return Q().then(function() {
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
            return Examples.client();
        }).then(function(client) {
            return Examples.taskWithName("New Task", client);
        }).then(function(taskWithName) {
            return taskWithName;
        });
    }
};

exports = module.exports = Examples; 
