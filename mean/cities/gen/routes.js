var mongoose = require('./models/db.js');

var cls = require('continuation-local-storage');

var City = require('./models/City.js');
var State = require('./models/State.js');

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
                    applicationName : "Cities",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "cities.City",
                    label : "City",
                    description : "",
                    uri : resolveUrl("entities/cities.City"),
                    extentUri : resolveUrl("entities/cities.City/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/cities.City/template")
                },
                 {
                    fullName : "cities.State",
                    label : "State",
                    description : "",
                    uri : resolveUrl("entities/cities.State"),
                    extentUri : resolveUrl("entities/cities.State/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/cities.State/template")
                }
            ]);
        });
        // routes for cities.City
        app.get("/entities/cities.City", function(req, res) {
            res.json({
                fullName : "cities.City",
                label : "City",
                description : "",
                uri : resolveUrl("entities/cities.City"),
                extentUri : resolveUrl("entities/cities.City/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/cities.City/template")
            });
        });
        app.get("/entities/cities.City/instances/:objectId", function(req, res) {
            return mongoose.model('City').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('cities.City', found));
                }
            });
        });
        app.get("/entities/cities.City/instances", function(req, res) {
            return mongoose.model('City').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('cities.City', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/cities.City/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/cities.City/template", function(req, res) {
            var template = new City().toObject();
            res.json(renderInstance('cities.City', template));
        });
        app.post("/entities/cities.City/instances", function(req, res) {
            var instanceData = req.body;
            var newCity = new City();
            newCity.name = instanceData.name;
            newCity.population = instanceData.population;
            newCity.cityState = instanceData.cityState && instanceData.cityState.objectId;
            newCity.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/cities.City/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/cities.City/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('City').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('cities.City', found));
                }
            });
        });
        
        
        
        // routes for cities.State
        app.get("/entities/cities.State", function(req, res) {
            res.json({
                fullName : "cities.State",
                label : "State",
                description : "",
                uri : resolveUrl("entities/cities.State"),
                extentUri : resolveUrl("entities/cities.State/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/cities.State/template")
            });
        });
        app.get("/entities/cities.State/instances/:objectId", function(req, res) {
            return mongoose.model('State').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('cities.State', found));
                }
            });
        });
        app.get("/entities/cities.State/instances", function(req, res) {
            return mongoose.model('State').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('cities.State', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/cities.State/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/cities.State/template", function(req, res) {
            var template = new State().toObject();
            res.json(renderInstance('cities.State', template));
        });
        app.post("/entities/cities.State/instances", function(req, res) {
            var instanceData = req.body;
            var newState = new State();
            newState.name = instanceData.name;
            newState.abbreviation = instanceData.abbreviation;
            newState.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/cities.State/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/cities.State/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('State').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('cities.State', found));
                }
            });
        });
        
    }
};
