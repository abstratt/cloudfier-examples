var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var Meeting = require('./models/Meeting.js');
var Presentation = require('./models/Presentation.js');
var User = require('./models/User.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            cls.getNamespace('session').run(function(context) {
                res.json({
                    applicationName : "Meeting",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "meeting.Meeting",
                    label : "Meeting",
                    description : "",
                    uri : resolveUrl("entities/meeting.Meeting"),
                    extentUri : resolveUrl("entities/meeting.Meeting/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/meeting.Meeting/template")
                },
                 {
                    fullName : "meeting.Presentation",
                    label : "Presentation",
                    description : "",
                    uri : resolveUrl("entities/meeting.Presentation"),
                    extentUri : resolveUrl("entities/meeting.Presentation/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/meeting.Presentation/template")
                },
                 {
                    fullName : "meeting.User",
                    label : "User",
                    description : "",
                    uri : resolveUrl("entities/meeting.User"),
                    extentUri : resolveUrl("entities/meeting.User/instances"),
                    user : true,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/meeting.User/template")
                }
            ]);
        });
        // routes for meeting.Meeting
        app.get("/entities/meeting.Meeting", function(req, res) {
            res.json({
                fullName : "meeting.Meeting",
                label : "Meeting",
                description : "",
                uri : resolveUrl("entities/meeting.Meeting"),
                extentUri : resolveUrl("entities/meeting.Meeting/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/meeting.Meeting/template")
            });
        });
        app.get("/entities/meeting.Meeting/instances/:objectId", function(req, res) {
            return mongoose.model('Meeting').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/meeting.Meeting/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/meeting.Meeting/instances", function(req, res) {
            return mongoose.model('Meeting').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/meeting.Meeting/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/meeting.Meeting/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/meeting.Meeting/template", function(req, res) {
            var template = new Meeting();
            res.json(template);
        });
        app.post("/entities/meeting.Meeting/instances", function(req, res) {
            var instanceData = req.body;
            var newMeeting = new Meeting();
            newMeeting.title = instanceData.title;
            newMeeting.description = instanceData.description;
            newMeeting.date = instanceData.date;
            newMeeting.organizer = instanceData.organizer && instanceData.organizer.objectId;
            newMeeting.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/meeting.Meeting/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for meeting.Presentation
        app.get("/entities/meeting.Presentation", function(req, res) {
            res.json({
                fullName : "meeting.Presentation",
                label : "Presentation",
                description : "",
                uri : resolveUrl("entities/meeting.Presentation"),
                extentUri : resolveUrl("entities/meeting.Presentation/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/meeting.Presentation/template")
            });
        });
        app.get("/entities/meeting.Presentation/instances/:objectId", function(req, res) {
            return mongoose.model('Presentation').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/meeting.Presentation/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/meeting.Presentation/instances", function(req, res) {
            return mongoose.model('Presentation').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/meeting.Presentation/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/meeting.Presentation/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/meeting.Presentation/template", function(req, res) {
            var template = new Presentation();
            res.json(template);
        });
        app.post("/entities/meeting.Presentation/instances", function(req, res) {
            var instanceData = req.body;
            var newPresentation = new Presentation();
            newPresentation.title = instanceData.title;
            newPresentation.author = instanceData.author && instanceData.author.objectId;
            newPresentation.meeting = instanceData.meeting && instanceData.meeting.objectId;
            newPresentation.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/meeting.Presentation/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for meeting.User
        app.get("/entities/meeting.User", function(req, res) {
            res.json({
                fullName : "meeting.User",
                label : "User",
                description : "",
                uri : resolveUrl("entities/meeting.User"),
                extentUri : resolveUrl("entities/meeting.User/instances"),
                user : true,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/meeting.User/template")
            });
        });
        app.get("/entities/meeting.User/instances/:objectId", function(req, res) {
            return mongoose.model('User').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/meeting.User/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/meeting.User/instances", function(req, res) {
            return mongoose.model('User').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/meeting.User/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/meeting.User/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/meeting.User/template", function(req, res) {
            var template = new User();
            res.json(template);
        });
        app.post("/entities/meeting.User/instances", function(req, res) {
            var instanceData = req.body;
            var newUser = new User();
            newUser.name = instanceData.name;
            newUser.email = instanceData.email;
            newUser.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/meeting.User/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
    }
};
