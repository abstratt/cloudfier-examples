var mongoose = require('mongoose');
var q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = {
    clientWithName : function(name) {
        // isAsynchronous: true        
        console.log("client = new Client()");
        client = new Client();
        
        console.log("client.name = name");
        client.name = name;
        
        console.log("return client");
        return client;
    },
    client : function() {
        // isAsynchronous: true        
        console.log("return Examples.clientWithName('New Client')");
        return Examples.clientWithName("New Client");
    },
    taskWithName : function(description, client) {
        // isAsynchronous: true        
        console.log("task = new Task()");
        task = new Task();
        
        console.log("task.description = description");
        task.description = description;
        
        console.log("task.client = client");
        task.client = client;
        
        console.log("return task");
        return task;
    },
    task : function() {
        // isAsynchronous: true        
        console.log("return Examples.taskWithName('New Task', Examples.client())");
        return Examples.taskWithName("New Task", Examples.client());
    }
};

exports = module.exports = Examples; 
