var mongoose = require('mongoose');
require('../models');

var Examples = {
    clientWithName : function(name) {
        var client = new require('../models/Client.js') ();
        client.name = name;
        return client;
    },
    client : function() {
        return require('./Examples.js').clientWithName("New Client");
    },
    taskWithName : function(description, client) {
        var task = new require('../models/Task.js') ();
        task.description = description;
        task.client = client;
        return task;
    },
    task : function() {
        return require('./Examples.js').taskWithName("New Task", require('./Examples.js').client());
    }
};

exports = module.exports = Examples; 
