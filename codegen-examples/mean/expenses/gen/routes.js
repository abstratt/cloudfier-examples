var mongoose = require('mongoose');
var cls = require('continuation-local-storage');

var Category = require('./models/Category.js');
var Expense = require('./models/Expense.js');
var Employee = require('./models/Employee.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            cls.getNamespace('session').run(function(context) {
                res.json({
                    applicationName : "Expenses Application",
                    entities : resolveUrl("entities"),
                    currentUser : context.username 
                });
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                    fullName : "expenses.Category",
                    label : "Category",
                    description : "The category for an expense.",
                    uri : resolveUrl("entities/expenses.Category"),
                    extentUri : resolveUrl("entities/expenses.Category/instances"),
                    user : false,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/expenses.Category/template")
                },
                 {
                    fullName : "expenses.Expense",
                    label : "Expense",
                    description : "The expense as reported by an employee.",
                    uri : resolveUrl("entities/expenses.Expense"),
                    extentUri : resolveUrl("entities/expenses.Expense/instances"),
                    user : false,
                    concrete : true,
                    standalone : true
                },
                 {
                    fullName : "expenses.Employee",
                    label : "Employee",
                    description : "An employee reports expenses.",
                    uri : resolveUrl("entities/expenses.Employee"),
                    extentUri : resolveUrl("entities/expenses.Employee/instances"),
                    user : true,
                    concrete : true,
                    standalone : true,
                    templateUri : resolveUrl("entities/expenses.Employee/template")
                }
            ]);
        });
        // routes for expenses.Category
        app.get("/entities/expenses.Category", function(req, res) {
            res.json({
                fullName : "expenses.Category",
                label : "Category",
                description : "The category for an expense.",
                uri : resolveUrl("entities/expenses.Category"),
                extentUri : resolveUrl("entities/expenses.Category/instances"),
                user : false,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/expenses.Category/template")
            });
        });
        app.get("/entities/expenses.Category/instances/:objectId", function(req, res) {
            return mongoose.model('Category').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/expenses.Category/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/expenses.Category/instances", function(req, res) {
            return mongoose.model('Category').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/expenses.Category/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/expenses.Category/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/expenses.Category/template", function(req, res) {
            var template = new Category();
            res.json(template);
        });
        app.post("/entities/expenses.Category/instances", function(req, res) {
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
                    created.uri = resolveUrl('entities/expenses.Category/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
        
        
        // routes for expenses.Expense
        app.get("/entities/expenses.Expense", function(req, res) {
            res.json({
                fullName : "expenses.Expense",
                label : "Expense",
                description : "The expense as reported by an employee.",
                uri : resolveUrl("entities/expenses.Expense"),
                extentUri : resolveUrl("entities/expenses.Expense/instances"),
                user : false,
                concrete : true,
                standalone : true
            });
        });
        app.get("/entities/expenses.Expense/instances/:objectId", function(req, res) {
            return mongoose.model('Expense').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/expenses.Expense/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/expenses.Expense/instances", function(req, res) {
            return mongoose.model('Expense').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/expenses.Expense/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/expenses.Expense/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        
        
        // routes for expenses.Employee
        app.get("/entities/expenses.Employee", function(req, res) {
            res.json({
                fullName : "expenses.Employee",
                label : "Employee",
                description : "An employee reports expenses.",
                uri : resolveUrl("entities/expenses.Employee"),
                extentUri : resolveUrl("entities/expenses.Employee/instances"),
                user : true,
                concrete : true,
                standalone : true,
                templateUri : resolveUrl("entities/expenses.Employee/template")
            });
        });
        app.get("/entities/expenses.Employee/instances/:objectId", function(req, res) {
            return mongoose.model('Employee').where({ _id: req.params.objectId}).findOne().lean().exec(function(error, found) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    found.objectId = found._id;
                    delete found._id;
                    delete found.__v;
                    found.uri = resolveUrl('entities/expenses.Employee/instances/' + found.objectId);
                    res.json(found);
                }
            });
        });
        app.get("/entities/expenses.Employee/instances", function(req, res) {
            return mongoose.model('Employee').find().lean().exec(function(error, contents) {
                if (error) {
                    console.log(error);
                    res.status(400).json({ message: error.message });
                } else {
                    contents.forEach(function(each) {
                        each.objectId = each._id;
                        delete each._id;
                        delete each.__v;
                        each.uri = resolveUrl('entities/expenses.Employee/instances/' + each.objectId);
                    });
                    res.json({
                        uri: resolveUrl('entities/expenses.Employee/instances'),
                        length: contents.length,
                        contents: contents
                    });
                }
            });
        });
        app.get("/entities/expenses.Employee/template", function(req, res) {
            var template = new Employee();
            res.json(template);
        });
        app.post("/entities/expenses.Employee/instances", function(req, res) {
            var instanceData = req.body;
            var newEmployee = new Employee();
            newEmployee.name = instanceData.name;
            newEmployee.username = instanceData.username;
            newEmployee.save(function(err, doc) {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: err.message});
                } else {
                    var created = doc.toObject();
                    created.objectId = created._id;
                    delete created._id;
                    delete created.__v;
                    created.uri = resolveUrl('entities/expenses.Employee/instances/' + created.objectId);
                    res.status(201).json(created);    
                }
            });
        });
    }
};
