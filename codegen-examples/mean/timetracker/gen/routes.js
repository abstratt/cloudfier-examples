var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var Client = require('./models/Client.js');
var Task = require('./models/Task.js');
var Invoice = require('./models/Invoice.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            cls.getNamespace('session').run(function(context) {
                res.json({
                    applicationName : "Time Tracker",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "timetracker.Client",
                    label : "Client",
                    description : "",
                    uri : resolveUrl("entities/timetracker.Client"),
                    extentUri : resolveUrl("entities/timetracker.Client/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/timetracker.Client/template")
                },
                 {
                    fullName : "timetracker.Task",
                    label : "Task",
                    description : "",
                    uri : resolveUrl("entities/timetracker.Task"),
                    extentUri : resolveUrl("entities/timetracker.Task/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/timetracker.Task/template")
                },
                 {
                    fullName : "timetracker.Invoice",
                    label : "Invoice",
                    description : "",
                    uri : resolveUrl("entities/timetracker.Invoice"),
                    extentUri : resolveUrl("entities/timetracker.Invoice/instances"),
                    user : false,
                    concrete : true,
                    standalone : true
                }
            ]);
        });
        // routes for timetracker.Client
        app.get("/entities/timetracker.Client", function(req, res) {
            res.json({
                fullName : "timetracker.Client",
                label : "Client",
                description : "",
                uri : resolveUrl("entities/timetracker.Client"),
                extentUri : resolveUrl("entities/timetracker.Client/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/timetracker.Client/template")
            });
        });
        app.get("/entities/timetracker.Client/instances/:objectId", function(req, res) {
            return mongoose.model('Client').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/timetracker.Client/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/timetracker.Client/instances", function(req, res) {
            return mongoose.model('Client').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/timetracker.Client/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/timetracker.Client/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/timetracker.Client/template", function(req, res) {
            var template = new Client();
            res.json(template);
        });
        app.post("/entities/timetracker.Client/instances", function(req, res) {
            var instanceData = req.body;
            var newClient = new Client();
            newClient.name = instanceData.name;
            newClient.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/timetracker.Client/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for timetracker.Task
        app.get("/entities/timetracker.Task", function(req, res) {
            res.json({
                fullName : "timetracker.Task",
                label : "Task",
                description : "",
                uri : resolveUrl("entities/timetracker.Task"),
                extentUri : resolveUrl("entities/timetracker.Task/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/timetracker.Task/template")
            });
        });
        app.get("/entities/timetracker.Task/instances/:objectId", function(req, res) {
            return mongoose.model('Task').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/timetracker.Task/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/timetracker.Task/instances", function(req, res) {
            return mongoose.model('Task').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/timetracker.Task/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/timetracker.Task/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/timetracker.Task/template", function(req, res) {
            var template = new Task();
            res.json(template);
        });
        app.post("/entities/timetracker.Task/instances", function(req, res) {
            var instanceData = req.body;
            var newTask = new Task();
            newTask.description = instanceData.description;
            newTask.client = instanceData.client && instanceData.client.objectId;
            newTask.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/timetracker.Task/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for timetracker.Invoice
        app.get("/entities/timetracker.Invoice", function(req, res) {
            res.json({
                fullName : "timetracker.Invoice",
                label : "Invoice",
                description : "",
                uri : resolveUrl("entities/timetracker.Invoice"),
                extentUri : resolveUrl("entities/timetracker.Invoice/instances"),
                user : false,
                concrete : true,
                standalone : true
            });
        });
        app.get("/entities/timetracker.Invoice/instances/:objectId", function(req, res) {
            return mongoose.model('Invoice').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/timetracker.Invoice/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/timetracker.Invoice/instances", function(req, res) {
            return mongoose.model('Invoice').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/timetracker.Invoice/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/timetracker.Invoice/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
    }
};
