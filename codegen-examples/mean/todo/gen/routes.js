var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var User = require('./models/User.js');
var Todo = require('./models/Todo.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            cls.getNamespace('session').run(function(context) {
                res.json({
                    applicationName : "Todo",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "todo.User",
                    label : "User",
                    description : "",
                    uri : resolveUrl("entities/todo.User"),
                    extentUri : resolveUrl("entities/todo.User/instances"),
                    user : true,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/todo.User/template")
                },
                 {
                    fullName : "todo.Todo",
                    label : "Todo",
                    description : "",
                    uri : resolveUrl("entities/todo.Todo"),
                    extentUri : resolveUrl("entities/todo.Todo/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/todo.Todo/template")
                }
            ]);
        });
        // routes for todo.User
        app.get("/entities/todo.User", function(req, res) {
            res.json({
                fullName : "todo.User",
                label : "User",
                description : "",
                uri : resolveUrl("entities/todo.User"),
                extentUri : resolveUrl("entities/todo.User/instances"),
                user : true,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/todo.User/template")
            });
        });
        app.get("/entities/todo.User/instances/:objectId", function(req, res) {
            return mongoose.model('User').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/todo.User/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/todo.User/instances", function(req, res) {
            return mongoose.model('User').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/todo.User/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/todo.User/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/todo.User/template", function(req, res) {
            var template = new User();
            res.json(template);
        });
        app.post("/entities/todo.User/instances", function(req, res) {
            var instanceData = req.body;
            var newUser = new User();
            newUser.email = instanceData.email;
            newUser.name = instanceData.name;
            newUser.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/todo.User/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for todo.Todo
        app.get("/entities/todo.Todo", function(req, res) {
            res.json({
                fullName : "todo.Todo",
                label : "Todo",
                description : "",
                uri : resolveUrl("entities/todo.Todo"),
                extentUri : resolveUrl("entities/todo.Todo/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/todo.Todo/template")
            });
        });
        app.get("/entities/todo.Todo/instances/:objectId", function(req, res) {
            return mongoose.model('Todo').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/todo.Todo/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/todo.Todo/instances", function(req, res) {
            return mongoose.model('Todo').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/todo.Todo/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/todo.Todo/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/todo.Todo/template", function(req, res) {
            var template = new Todo();
            template.creator = (function() {
                return cls.getNamespace('currentUser');
            })();
            template.assignee = (function() {
                return cls.getNamespace('currentUser');
            })();
            template.status = "Open";
            res.json(template);
        });
        app.post("/entities/todo.Todo/instances", function(req, res) {
            var instanceData = req.body;
            var newTodo = new Todo();
            newTodo.description = instanceData.description;
            newTodo.details = instanceData.details;
            newTodo.status = instanceData.status;
            newTodo.assignee = instanceData.assignee && instanceData.assignee.objectId;
            newTodo.creator = instanceData.creator && instanceData.creator.objectId;
            newTodo.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/todo.Todo/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
    }
};
