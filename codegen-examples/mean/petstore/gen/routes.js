var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var Customer = require('./models/Customer.js');
var Product = require('./models/Product.js');
var Category = require('./models/Category.js');
var Order = require('./models/Order.js');

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
                    applicationName : "Petstore",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "petstore.Customer",
                    label : "Customer",
                    description : "",
                    uri : resolveUrl("entities/petstore.Customer"),
                    extentUri : resolveUrl("entities/petstore.Customer/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/petstore.Customer/template")
                },
                 {
                    fullName : "petstore.Product",
                    label : "Product",
                    description : "",
                    uri : resolveUrl("entities/petstore.Product"),
                    extentUri : resolveUrl("entities/petstore.Product/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/petstore.Product/template")
                },
                 {
                    fullName : "petstore.Category",
                    label : "Category",
                    description : "",
                    uri : resolveUrl("entities/petstore.Category"),
                    extentUri : resolveUrl("entities/petstore.Category/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/petstore.Category/template")
                },
                 {
                    fullName : "petstore.Order",
                    label : "Order",
                    description : "",
                    uri : resolveUrl("entities/petstore.Order"),
                    extentUri : resolveUrl("entities/petstore.Order/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/petstore.Order/template")
                }
            ]);
        });
        // routes for petstore.Customer
        app.get("/entities/petstore.Customer", function(req, res) {
            res.json({
                fullName : "petstore.Customer",
                label : "Customer",
                description : "",
                uri : resolveUrl("entities/petstore.Customer"),
                extentUri : resolveUrl("entities/petstore.Customer/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/petstore.Customer/template")
            });
        });
        app.get("/entities/petstore.Customer/instances/:objectId", function(req, res) {
            return mongoose.model('Customer').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('petstore.Customer', found));
                }
            });
        });
        app.get("/entities/petstore.Customer/instances", function(req, res) {
            return mongoose.model('Customer').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('petstore.Customer', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/petstore.Customer/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/petstore.Customer/template", function(req, res) {
            var template = new Customer().toObject();
            res.json(renderInstance('petstore.Customer', template));
        });
        app.post("/entities/petstore.Customer/instances", function(req, res) {
            var instanceData = req.body;
            var newCustomer = new Customer();
            newCustomer.name = instanceData.name;
            newCustomer.username = instanceData.username;
            newCustomer.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/petstore.Customer/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for petstore.Product
        app.get("/entities/petstore.Product", function(req, res) {
            res.json({
                fullName : "petstore.Product",
                label : "Product",
                description : "",
                uri : resolveUrl("entities/petstore.Product"),
                extentUri : resolveUrl("entities/petstore.Product/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/petstore.Product/template")
            });
        });
        app.get("/entities/petstore.Product/instances/:objectId", function(req, res) {
            return mongoose.model('Product').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('petstore.Product', found));
                }
            });
        });
        app.get("/entities/petstore.Product/instances", function(req, res) {
            return mongoose.model('Product').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('petstore.Product', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/petstore.Product/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/petstore.Product/template", function(req, res) {
            var template = new Product().toObject();
            template.productWeight = 0.0;
            res.json(renderInstance('petstore.Product', template));
        });
        app.post("/entities/petstore.Product/instances", function(req, res) {
            var instanceData = req.body;
            var newProduct = new Product();
            newProduct.productName = instanceData.productName;
            newProduct.productPrice = instanceData.productPrice;
            newProduct.unitCost = instanceData.unitCost;
            newProduct.productDescription = instanceData.productDescription;
            newProduct.productWeight = instanceData.productWeight;
            newProduct.category = instanceData.category && instanceData.category.objectId;
            newProduct.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/petstore.Product/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for petstore.Category
        app.get("/entities/petstore.Category", function(req, res) {
            res.json({
                fullName : "petstore.Category",
                label : "Category",
                description : "",
                uri : resolveUrl("entities/petstore.Category"),
                extentUri : resolveUrl("entities/petstore.Category/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/petstore.Category/template")
            });
        });
        app.get("/entities/petstore.Category/instances/:objectId", function(req, res) {
            return mongoose.model('Category').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('petstore.Category', found));
                }
            });
        });
        app.get("/entities/petstore.Category/instances", function(req, res) {
            return mongoose.model('Category').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('petstore.Category', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/petstore.Category/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/petstore.Category/template", function(req, res) {
            var template = new Category().toObject();
            res.json(renderInstance('petstore.Category', template));
        });
        app.post("/entities/petstore.Category/instances", function(req, res) {
            var instanceData = req.body;
            var newCategory = new Category();
            newCategory.name = instanceData.name;
            newCategory.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/petstore.Category/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for petstore.Order
        app.get("/entities/petstore.Order", function(req, res) {
            res.json({
                fullName : "petstore.Order",
                label : "Order",
                description : "",
                uri : resolveUrl("entities/petstore.Order"),
                extentUri : resolveUrl("entities/petstore.Order/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/petstore.Order/template")
            });
        });
        app.get("/entities/petstore.Order/instances/:objectId", function(req, res) {
            return mongoose.model('Order').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    res.json(renderInstance('petstore.Order', found));
                }
            });
        });
        app.get("/entities/petstore.Order/instances", function(req, res) {
            return mongoose.model('Order').find().lean().exec(function(error, documents) {
                var contents = [];
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    documents.forEach(function(each) {
                        contents.push(renderInstance('petstore.Order', each));
                    });
                    res.json({
                        uri: resolveUrl('entities/petstore.Order/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/petstore.Order/template", function(req, res) {
            var template = new Order().toObject();
            template.orderDate = (function() {
                return new Date();
            })();
            res.json(renderInstance('petstore.Order', template));
        });
        app.post("/entities/petstore.Order/instances", function(req, res) {
            var instanceData = req.body;
            var newOrder = new Order();
            newOrder.orderDate = instanceData.orderDate;
            newOrder.orderStatus = instanceData.orderStatus;
            newOrder.customer = instanceData.customer && instanceData.customer.objectId;
            newOrder.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/petstore.Order/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
    }
};
