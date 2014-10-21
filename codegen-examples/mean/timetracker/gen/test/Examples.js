var mongoose = require('mongoose');
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = {
    clientWithName : function(name) {
        var client = new Client();
        client.name = name;
        return client;
    },
    client : function() {
        return Examples.clientWithName("New Client");
    },
    taskWithName : function(description, client) {
        var task = new Task();
        task.description = description;
        task.client = client;
        return task;
    },
    task : function() {
        return Examples.taskWithName("New Task", Examples.client());
    }
};

exports = module.exports = Examples; 
