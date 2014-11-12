var mongoose = require('mongoose');
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = {
    clientWithName : function(name) {
        client = new Client();
        client['name'] = name;
        return client.save();
    },
    client : function() {
        return Examples.clientWithName("New Client").save();
    },
    taskWithName : function(description, client) {
        task = new Task();
        task['description'] = description;
        task['client'] = client;
        return task.save();
    },
    task : function() {
        return Examples.taskWithName("New Task", Examples.client()).save();
    }
};

exports = module.exports = Examples; 
