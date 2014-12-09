var mongoose = require('./models/db.js');

var cls = require('continuation-local-storage');

var Meeting = require('./models/Meeting.js');
var Presentation = require('./models/Presentation.js');
var User = require('./models/User.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
                    
        // helps with removing internal metadata            
        var renderInstance = function (entityName, instance) {
            instance.objectId = instance._id;
            delete instance._id;
            delete instance.__v;
            instance.uri = resolveUrl('entities/'+ entityName + '/instances/' + instance.objectId);
            instance.entityUri = resolveUrl('entities/'+ entityName);
            return instance;
        };
        
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
                    res.json(renderInstance('meeting.Meeting', found));
                }
            });
        });
        app.get("/entities/meeting.Meeting/instances", function(req, res) {
            return mongoose.model('Meeting').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('meeting.Meeting', each));
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
            var template = new Meeting().toObject();
            res.json(renderInstance('meeting.Meeting', template));
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
        app.put("/entities/meeting.Meeting/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Meeting').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('meeting.Meeting', found));
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
                    res.json(renderInstance('meeting.Presentation', found));
                }
            });
        });
        app.get("/entities/meeting.Presentation/instances", function(req, res) {
            return mongoose.model('Presentation').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('meeting.Presentation', each));
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
            var template = new Presentation().toObject();
            res.json(renderInstance('meeting.Presentation', template));
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
        app.put("/entities/meeting.Presentation/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Presentation').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('meeting.Presentation', found));
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
                    res.json(renderInstance('meeting.User', found));
                }
            });
        });
        app.get("/entities/meeting.User/instances", function(req, res) {
            return mongoose.model('User').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('meeting.User', each));
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
            var template = new User().toObject();
            res.json(renderInstance('meeting.User', template));
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
        app.put("/entities/meeting.User/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('User').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('meeting.User', found));
                }
            });
        });
        
    }
};
