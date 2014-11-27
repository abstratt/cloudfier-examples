var mongoose = require('mongoose');
mongoose.set('debug', function (coll, method, query, doc) {
    console.log("Coll " + coll);
});
mongoose.connection.on('error', function (err) { console.log(err); } );


var cls = require('continuation-local-storage');

var Taxi = require('./models/Taxi.js');
var Shift = require('./models/Shift.js');
var Driver = require('./models/Driver.js');
var Charge = require('./models/Charge.js');

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
                    applicationName : "Taxi Fleet Management",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "taxi_fleet.Taxi",
                    label : "Taxi",
                    description : "The vehicles that make up the fleet.",
                    uri : resolveUrl("entities/taxi_fleet.Taxi"),
                    extentUri : resolveUrl("entities/taxi_fleet.Taxi/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/taxi_fleet.Taxi/template")
                },
                 {
                    fullName : "taxi_fleet.Shift",
                    label : "Shift",
                    description : "Shift modalities.",
                    uri : resolveUrl("entities/taxi_fleet.Shift"),
                    extentUri : resolveUrl("entities/taxi_fleet.Shift/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/taxi_fleet.Shift/template")
                },
                 {
                    fullName : "taxi_fleet.Driver",
                    label : "Driver",
                    description : "Drivers that can book taxis.",
                    uri : resolveUrl("entities/taxi_fleet.Driver"),
                    extentUri : resolveUrl("entities/taxi_fleet.Driver/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/taxi_fleet.Driver/template")
                },
                 {
                    fullName : "taxi_fleet.Charge",
                    label : "Charge",
                    description : "Charges for renting taxis.",
                    uri : resolveUrl("entities/taxi_fleet.Charge"),
                    extentUri : resolveUrl("entities/taxi_fleet.Charge/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/taxi_fleet.Charge/template")
                }
            ]);
        });
        // routes for taxi_fleet.Taxi
        app.get("/entities/taxi_fleet.Taxi", function(req, res) {
            res.json({
                fullName : "taxi_fleet.Taxi",
                label : "Taxi",
                description : "The vehicles that make up the fleet.",
                uri : resolveUrl("entities/taxi_fleet.Taxi"),
                extentUri : resolveUrl("entities/taxi_fleet.Taxi/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/taxi_fleet.Taxi/template")
            });
        });
        app.get("/entities/taxi_fleet.Taxi/instances/:objectId", function(req, res) {
            return mongoose.model('Taxi').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Taxi', found));
                }
            });
        });
        app.get("/entities/taxi_fleet.Taxi/instances", function(req, res) {
            return mongoose.model('Taxi').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('taxi_fleet.Taxi', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/taxi_fleet.Taxi/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/taxi_fleet.Taxi/template", function(req, res) {
            var template = new Taxi().toObject();
            res.json(renderInstance('taxi_fleet.Taxi', template));
        });
        app.post("/entities/taxi_fleet.Taxi/instances", function(req, res) {
            var instanceData = req.body;
            var newTaxi = new Taxi();
            newTaxi.name = instanceData.name;
            newTaxi.shift = instanceData.shift && instanceData.shift.objectId;
            newTaxi.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/taxi_fleet.Taxi/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/taxi_fleet.Taxi/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Taxi').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Taxi', found));
                }
            });
        });
        
        
        
        // routes for taxi_fleet.Shift
        app.get("/entities/taxi_fleet.Shift", function(req, res) {
            res.json({
                fullName : "taxi_fleet.Shift",
                label : "Shift",
                description : "Shift modalities.",
                uri : resolveUrl("entities/taxi_fleet.Shift"),
                extentUri : resolveUrl("entities/taxi_fleet.Shift/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/taxi_fleet.Shift/template")
            });
        });
        app.get("/entities/taxi_fleet.Shift/instances/:objectId", function(req, res) {
            return mongoose.model('Shift').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Shift', found));
                }
            });
        });
        app.get("/entities/taxi_fleet.Shift/instances", function(req, res) {
            return mongoose.model('Shift').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('taxi_fleet.Shift', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/taxi_fleet.Shift/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/taxi_fleet.Shift/template", function(req, res) {
            var template = new Shift().toObject();
            template.shiftsPerDay = 1;
            res.json(renderInstance('taxi_fleet.Shift', template));
        });
        app.post("/entities/taxi_fleet.Shift/instances", function(req, res) {
            var instanceData = req.body;
            var newShift = new Shift();
            newShift.description = instanceData.description;
            newShift.price = instanceData.price;
            newShift.shiftsPerDay = instanceData.shiftsPerDay;
            newShift.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/taxi_fleet.Shift/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/taxi_fleet.Shift/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Shift').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Shift', found));
                }
            });
        });
        
        
        
        // routes for taxi_fleet.Driver
        app.get("/entities/taxi_fleet.Driver", function(req, res) {
            res.json({
                fullName : "taxi_fleet.Driver",
                label : "Driver",
                description : "Drivers that can book taxis.",
                uri : resolveUrl("entities/taxi_fleet.Driver"),
                extentUri : resolveUrl("entities/taxi_fleet.Driver/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/taxi_fleet.Driver/template")
            });
        });
        app.get("/entities/taxi_fleet.Driver/instances/:objectId", function(req, res) {
            return mongoose.model('Driver').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Driver', found));
                }
            });
        });
        app.get("/entities/taxi_fleet.Driver/instances", function(req, res) {
            return mongoose.model('Driver').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('taxi_fleet.Driver', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/taxi_fleet.Driver/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/taxi_fleet.Driver/template", function(req, res) {
            var template = new Driver().toObject();
            res.json(renderInstance('taxi_fleet.Driver', template));
        });
        app.post("/entities/taxi_fleet.Driver/instances", function(req, res) {
            var instanceData = req.body;
            var newDriver = new Driver();
            newDriver.name = instanceData.name;
            newDriver.taxi = instanceData.taxi && instanceData.taxi.objectId;
            newDriver.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/taxi_fleet.Driver/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/taxi_fleet.Driver/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Driver').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Driver', found));
                }
            });
        });
        
        
        
        // routes for taxi_fleet.Charge
        app.get("/entities/taxi_fleet.Charge", function(req, res) {
            res.json({
                fullName : "taxi_fleet.Charge",
                label : "Charge",
                description : "Charges for renting taxis.",
                uri : resolveUrl("entities/taxi_fleet.Charge"),
                extentUri : resolveUrl("entities/taxi_fleet.Charge/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/taxi_fleet.Charge/template")
            });
        });
        app.get("/entities/taxi_fleet.Charge/instances/:objectId", function(req, res) {
            return mongoose.model('Charge').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Charge', found));
                }
            });
        });
        app.get("/entities/taxi_fleet.Charge/instances", function(req, res) {
            return mongoose.model('Charge').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('taxi_fleet.Charge', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/taxi_fleet.Charge/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/taxi_fleet.Charge/template", function(req, res) {
            var template = new Charge().toObject();
            res.json(renderInstance('taxi_fleet.Charge', template));
        });
        app.post("/entities/taxi_fleet.Charge/instances", function(req, res) {
            var instanceData = req.body;
            var newCharge = new Charge();
            newCharge.date = instanceData.date;
            newCharge.receivedOn = instanceData.receivedOn;
            newCharge.description = instanceData.description;
            newCharge.amount = instanceData.amount;
            newCharge.status = instanceData.status;
            newCharge.driver = instanceData.driver && instanceData.driver.objectId;
            newCharge.taxi = instanceData.taxi && instanceData.taxi.objectId;
            newCharge.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/taxi_fleet.Charge/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        app.put("/entities/taxi_fleet.Charge/instances/:objectId", function(req, res) {
            var instanceData = req.body;
            return mongoose.model('Charge').findByIdAndUpdate(req.params.objectId, instanceData).lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('taxi_fleet.Charge', found));
                }
            });
        });
        
    }
};
