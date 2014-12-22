require('../models/index.js');

var Q = require("q");
var mongoose = require('../models/db.js');
var Examples = {
    clientWithName : function(name) {
        var client;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                client = new require('../models/Client.js')();
            });
        }).then(function() {
            return Q().then(function() {
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
        }).then(function(clientWithNameResult) {
            return clientWithNameResult;
        });
    },
    taskWithName : function(description, client) {
        var task;
        var me = this;
        return Q().then(function() {
            return Q().then(function() {
                task = new require('../models/Task.js')();
            });
        }).then(function() {
            return Q().then(function() {
                task['description'] = description;
            });
        }).then(function() {
            return Q().then(function() {
                return Q.npost(require('../models/Client.js'), 'findOne', [ ({ _id : client._id }) ]);
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
        }).then(function(clientResult) {
            return Examples.taskWithName("New Task", clientResult);
        }).then(function(taskWithNameResult) {
            return taskWithNameResult;
        });
    }
};

exports = module.exports = Examples; 
