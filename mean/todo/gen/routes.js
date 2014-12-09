var mongoose = require('./models/db.js');

var cls = require('continuation-local-storage');

var User = require('./models/User.js');
var Todo = require('./models/Todo.js');

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
                    res.json(renderInstance('todo.User', found));
                }
            });
        });
        app.get("/entities/todo.User/instances", function(req, res) {
            return mongoose.model('User').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('todo.User', each));
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
            var template = new User().toObject();
            res.json(renderInstance('todo.User', template));
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
        app.put("/entities/todo.User/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('User').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('todo.User', found));
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
                    res.json(renderInstance('todo.Todo', found));
                }
            });
        });
        app.get("/entities/todo.Todo/instances", function(req, res) {
            return mongoose.model('Todo').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('todo.Todo', each));
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
            var template = new Todo().toObject();
            template.creator = (function() {
                /*sync*/return cls.getNamespace('currentUser');
            })();
            template.assignee = (function() {
                /*sync*/return cls.getNamespace('currentUser');
            })();
            template.openedOn = (function() {
                /*sync*/return new Date();
            })();
            res.json(renderInstance('todo.Todo', template));
        });
        app.post("/entities/todo.Todo/instances", function(req, res) {
            var instanceData = req.body;
            var newTodo = new Todo();
            newTodo.description = instanceData.description;
            newTodo.details = instanceData.details;
            newTodo.status = instanceData.status;
            newTodo.openedOn = instanceData.openedOn;
            newTodo.completedOn = instanceData.completedOn;
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
        app.put("/entities/todo.Todo/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Todo').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('todo.Todo', found));
                }
            });
        });
        
    }
};
