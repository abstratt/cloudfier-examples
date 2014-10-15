var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var User = require('./models/User.js');
var Label = require('./models/Label.js');
var Project = require('./models/Project.js');
var Issue = require('./models/Issue.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            cls.getNamespace('session').run(function(context) {
                res.json({
                    applicationName : "Shipit",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "shipit.User",
                    label : "User",
                    description : "",
                    uri : resolveUrl("entities/shipit.User"),
                    extentUri : resolveUrl("entities/shipit.User/instances"),
                    user : true,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/shipit.User/template")
                },
                 {
                    fullName : "shipit.Label",
                    label : "Label",
                    description : "",
                    uri : resolveUrl("entities/shipit.Label"),
                    extentUri : resolveUrl("entities/shipit.Label/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/shipit.Label/template")
                },
                 {
                    fullName : "shipit.Project",
                    label : "Project",
                    description : "Issues are reported against a specific project.",
                    uri : resolveUrl("entities/shipit.Project"),
                    extentUri : resolveUrl("entities/shipit.Project/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/shipit.Project/template")
                },
                 {
                    fullName : "shipit.Issue",
                    label : "Issue",
                    description : "An issue describes a problem report, a feature request or just a work item for a project.     Issues are reported by and assigned to users, and go through a lifecycle from the time      they are opened until they are resolved and eventually closed.",
                    uri : resolveUrl("entities/shipit.Issue"),
                    extentUri : resolveUrl("entities/shipit.Issue/instances"),
                    user : false,
                    concrete : true,
                    standalone : true
                }
            ]);
        });
        // routes for shipit.User
        app.get("/entities/shipit.User", function(req, res) {
            res.json({
                fullName : "shipit.User",
                label : "User",
                description : "",
                uri : resolveUrl("entities/shipit.User"),
                extentUri : resolveUrl("entities/shipit.User/instances"),
                user : true,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/shipit.User/template")
            });
        });
        app.get("/entities/shipit.User/instances/:objectId", function(req, res) {
            return mongoose.model('User').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/shipit.User/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/shipit.User/instances", function(req, res) {
            return mongoose.model('User').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/shipit.User/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/shipit.User/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/shipit.User/template", function(req, res) {
            var template = new User();
            template.kind = "Reporter";
            res.json(template);
        });
        app.post("/entities/shipit.User/instances", function(req, res) {
            var instanceData = req.body;
            var newUser = new User();
            newUser.email = instanceData.email;
            newUser.fullName = instanceData.fullName;
            newUser.kind = instanceData.kind;
            newUser.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/shipit.User/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for shipit.Label
        app.get("/entities/shipit.Label", function(req, res) {
            res.json({
                fullName : "shipit.Label",
                label : "Label",
                description : "",
                uri : resolveUrl("entities/shipit.Label"),
                extentUri : resolveUrl("entities/shipit.Label/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/shipit.Label/template")
            });
        });
        app.get("/entities/shipit.Label/instances/:objectId", function(req, res) {
            return mongoose.model('Label').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/shipit.Label/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/shipit.Label/instances", function(req, res) {
            return mongoose.model('Label').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/shipit.Label/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/shipit.Label/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/shipit.Label/template", function(req, res) {
            var template = new Label();
            res.json(template);
        });
        app.post("/entities/shipit.Label/instances", function(req, res) {
            var instanceData = req.body;
            var newLabel = new Label();
            newLabel.name = instanceData.name;
            newLabel.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/shipit.Label/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for shipit.Project
        app.get("/entities/shipit.Project", function(req, res) {
            res.json({
                fullName : "shipit.Project",
                label : "Project",
                description : "Issues are reported against a specific project.",
                uri : resolveUrl("entities/shipit.Project"),
                extentUri : resolveUrl("entities/shipit.Project/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/shipit.Project/template")
            });
        });
        app.get("/entities/shipit.Project/instances/:objectId", function(req, res) {
            return mongoose.model('Project').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/shipit.Project/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/shipit.Project/instances", function(req, res) {
            return mongoose.model('Project').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/shipit.Project/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/shipit.Project/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/shipit.Project/template", function(req, res) {
            var template = new Project();
            res.json(template);
        });
        app.post("/entities/shipit.Project/instances", function(req, res) {
            var instanceData = req.body;
            var newProject = new Project();
            newProject.description = instanceData.description;
            newProject.token = instanceData.token;
            newProject.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/shipit.Project/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for shipit.Issue
        app.get("/entities/shipit.Issue", function(req, res) {
            res.json({
                fullName : "shipit.Issue",
                label : "Issue",
                description : "An issue describes a problem report, a feature request or just a work item for a project.     Issues are reported by and assigned to users, and go through a lifecycle from the time      they are opened until they are resolved and eventually closed.",
                uri : resolveUrl("entities/shipit.Issue"),
                extentUri : resolveUrl("entities/shipit.Issue/instances"),
                user : false,
                concrete : true,
                standalone : true
            });
        });
        app.get("/entities/shipit.Issue/instances/:objectId", function(req, res) {
            return mongoose.model('Issue').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/shipit.Issue/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/shipit.Issue/instances", function(req, res) {
            return mongoose.model('Issue').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/shipit.Issue/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/shipit.Issue/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
    }
};
