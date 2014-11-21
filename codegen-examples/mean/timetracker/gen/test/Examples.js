var mongoose = require('mongoose');
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = {
    clientWithName : function(name) {
        var client;
        return q().then(function() {
            return q().then(function() {
                client = new Client();
            });
        }).then(function() {
            return q().then(function() {
                client['name'] = name;
            });
        }).then(function() {
            return q().then(function() {
                client.save();
                return q(client);
            });
        });
    },
    client : function() {
        return q().then(function() {
            return Examples.clientWithName("New Client");
        }).then(function(call_clientWithName) {
            call_clientWithName.save();
            return q(call_clientWithName);
        });
    },
    taskWithName : function(description, client) {
        var task;
        return q().then(function() {
            return q().then(function() {
                task = new Task();
            });
        }).then(function() {
            return q().then(function() {
                task['description'] = description;
            });
        }).then(function() {
            return q().then(function() {
                task['client'] = client;
            });
        }).then(function() {
            return q().then(function() {
                task.save();
                return q(task);
            });
        });
    },
    task : function() {
        return q().then(function() {
            return Examples.client();
        }).then(function(call_client) {
            return Examples.taskWithName("New Task", call_client);
        }).then(function(call_taskWithName) {
            call_taskWithName.save();
            return q(call_taskWithName);
        });
    }
};

exports = module.exports = Examples; 
