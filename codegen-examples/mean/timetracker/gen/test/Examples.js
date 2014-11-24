var mongoose = require('mongoose');
var Q = require("q");
var Client = require('../models/Client.js');
var Task = require('../models/Task.js');
var Invoice = require('../models/Invoice.js');

var Examples = {
    clientWithName : function(name) {
        var client;
        var me = this;
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("client = new Client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                client = new Client();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("client['name'] = name;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                client['name'] = name;
            });
        }).then(function() {
            return Q.when(function() {
                console.log("client.save();<NL>return q(client);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                client.save();
                return q(client);
            });
        });
    },
    client : function() {
        var me = this;
        return Q.when(function() {
            console.log("return Examples.clientWithName(<Q>New Client<Q>);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return Examples.clientWithName("New Client");
        }).then(function(call_clientWithName) {
            call_clientWithName.save();
            return q(call_clientWithName);
        });
    },
    taskWithName : function(description, client) {
        var task;
        var me = this;
        return Q.when(null).then(function() {
            return Q.when(function() {
                console.log("task = new Task();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                task = new Task();
            });
        }).then(function() {
            return Q.when(function() {
                console.log("task['description'] = description;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                task['description'] = description;
            });
        }).then(function() {
            return Q.when(function() {
                console.log("task['client'] = client;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                task['client'] = client;
            });
        }).then(function() {
            return Q.when(function() {
                console.log("task.save();<NL>return q(task);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                task.save();
                return q(task);
            });
        });
    },
    task : function() {
        var me = this;
        return Q.when(function() {
            console.log("return Examples.client();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
