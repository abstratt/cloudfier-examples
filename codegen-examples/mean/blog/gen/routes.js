var mongoose = require('mongoose');
mongoose.set('debug', function (coll, method, query, doc) {
    console.log("Coll " + coll);
});
mongoose.connection.on('error', function (err) { console.log(err); } );


var cls = require('continuation-local-storage');

var User = require('./models/User.js');
var Article = require('./models/Article.js');
var Comment = require('./models/Comment.js');

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
                    applicationName : "Blog",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "blog.User",
                    label : "User",
                    description : "",
                    uri : resolveUrl("entities/blog.User"),
                    extentUri : resolveUrl("entities/blog.User/instances"),
                    user : true,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/blog.User/template")
                },
                 {
                    fullName : "blog.Article",
                    label : "Article",
                    description : "",
                    uri : resolveUrl("entities/blog.Article"),
                    extentUri : resolveUrl("entities/blog.Article/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/blog.Article/template")
                },
                 {
                    fullName : "blog.Comment",
                    label : "Comment",
                    description : "",
                    uri : resolveUrl("entities/blog.Comment"),
                    extentUri : resolveUrl("entities/blog.Comment/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/blog.Comment/template")
                }
            ]);
        });
        // routes for blog.User
        app.get("/entities/blog.User", function(req, res) {
            res.json({
                fullName : "blog.User",
                label : "User",
                description : "",
                uri : resolveUrl("entities/blog.User"),
                extentUri : resolveUrl("entities/blog.User/instances"),
                user : true,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/blog.User/template")
            });
        });
        app.get("/entities/blog.User/instances/:objectId", function(req, res) {
            return mongoose.model('User').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('blog.User', found));
                }
            });
        });
        app.get("/entities/blog.User/instances", function(req, res) {
            return mongoose.model('User').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('blog.User', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/blog.User/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/blog.User/template", function(req, res) {
            var template = new User().toObject();
            res.json(renderInstance('blog.User', template));
        });
        app.post("/entities/blog.User/instances", function(req, res) {
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
                    created.uri = resolveUrl('entities/blog.User/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/blog.User/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('User').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('blog.User', found));
                }
            });
        });
        
        
        
        // routes for blog.Article
        app.get("/entities/blog.Article", function(req, res) {
            res.json({
                fullName : "blog.Article",
                label : "Article",
                description : "",
                uri : resolveUrl("entities/blog.Article"),
                extentUri : resolveUrl("entities/blog.Article/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/blog.Article/template")
            });
        });
        app.get("/entities/blog.Article/instances/:objectId", function(req, res) {
            return mongoose.model('Article').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('blog.Article', found));
                }
            });
        });
        app.get("/entities/blog.Article/instances", function(req, res) {
            return mongoose.model('Article').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('blog.Article', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/blog.Article/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/blog.Article/template", function(req, res) {
            var template = new Article().toObject();
            template.user = (function() {
                return cls.getNamespace('currentUser');
            })();
            template.createdAt = (function() {
                return new Date();
            })();
            res.json(renderInstance('blog.Article', template));
        });
        app.post("/entities/blog.Article/instances", function(req, res) {
            var instanceData = req.body;
            var newArticle = new Article();
            newArticle.title = instanceData.title;
            newArticle.body = instanceData.body;
            newArticle.tags = instanceData.tags;
            newArticle.createdAt = instanceData.createdAt;
            newArticle.user = instanceData.user && instanceData.user.objectId;
            newArticle.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/blog.Article/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/blog.Article/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Article').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('blog.Article', found));
                }
            });
        });
        
        
        
        // routes for blog.Comment
        app.get("/entities/blog.Comment", function(req, res) {
            res.json({
                fullName : "blog.Comment",
                label : "Comment",
                description : "",
                uri : resolveUrl("entities/blog.Comment"),
                extentUri : resolveUrl("entities/blog.Comment/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/blog.Comment/template")
            });
        });
        app.get("/entities/blog.Comment/instances/:objectId", function(req, res) {
            return mongoose.model('Comment').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('blog.Comment', found));
                }
            });
        });
        app.get("/entities/blog.Comment/instances", function(req, res) {
            return mongoose.model('Comment').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('blog.Comment', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/blog.Comment/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/blog.Comment/template", function(req, res) {
            var template = new Comment().toObject();
            template.user = (function() {
                return cls.getNamespace('currentUser');
            })();
            template.createdAt = (function() {
                return new Date();
            })();
            res.json(renderInstance('blog.Comment', template));
        });
        app.post("/entities/blog.Comment/instances", function(req, res) {
            var instanceData = req.body;
            var newComment = new Comment();
            newComment.body = instanceData.body;
            newComment.createdAt = instanceData.createdAt;
            newComment.user = instanceData.user && instanceData.user.objectId;
            newComment.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/blog.Comment/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/blog.Comment/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Comment').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('blog.Comment', found));
                }
            });
        });
        
    }
};
