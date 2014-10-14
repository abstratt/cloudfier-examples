var mongoose = require('mongoose');

require('./models/Category.js');
require('./models/Expense.js');
require('./models/Employee.js');

var exports = module.exports = { 
    build: function (app, resolveUrl) {
        app.get("/", function(req, res) {
            res.json({
                applicationName : "Expenses Application",
                entities : resolveUrl("entities")
            });
        });
        
        app.get("/entities", function(req, res) {
            res.json([
                {
                   fullName : "expenses.Category",
                   extentUri : resolveUrl("entities/expenses.Category/instances"),
                   uri : resolveUrl("entities/expenses.Category")
                }
                ,
                 {
                   fullName : "expenses.Expense",
                   extentUri : resolveUrl("entities/expenses.Expense/instances"),
                   uri : resolveUrl("entities/expenses.Expense")
                }
                ,
                 {
                   fullName : "expenses.Employee",
                   extentUri : resolveUrl("entities/expenses.Employee/instances"),
                   uri : resolveUrl("entities/expenses.Employee")
                }
            ]);
        });
        // routes for expenses.Category
        app.get("/entities/expenses.Category", function(req, res) {
            res.json({
                extentUri: resolveUrl('entities/expenses.Category/instances')
            });
        });
        app.get("/entities/expenses.Category/instances", function(req, res) {
            return mongoose.model('expenses.Category').find().then(function(block) {
                res.json({
                    offset: 0,
                    length: block.size(),
                    contents: block
                });
            });
        });
        app.get("/entities/expenses.Category/template", function(req, res) {
            res.json(new Category());
        });
        app.post("/entities/expenses.Category/instances", function(req, res) {
            var instanceData = req.body;
            var newCategory = new Category();
            for (var p in instanceData) {
                newCategory[p] = instanceData[p]; 
            }
            newCategory.save(function(err, created) {
                if (err) {
                    respondWithError(req, err);
                } else {
                    res.json(created);    
                }
            });
        });
        
        
        // routes for expenses.Expense
        app.get("/entities/expenses.Expense", function(req, res) {
            res.json({
                extentUri: resolveUrl('entities/expenses.Expense/instances')
            });
        });
        app.get("/entities/expenses.Expense/instances", function(req, res) {
            return mongoose.model('expenses.Expense').find().then(function(block) {
                res.json({
                    offset: 0,
                    length: block.size(),
                    contents: block
                });
            });
        });
        app.get("/entities/expenses.Expense/template", function(req, res) {
            res.json(new Expense());
        });
        app.post("/entities/expenses.Expense/instances", function(req, res) {
            var instanceData = req.body;
            var newExpense = new Expense();
            for (var p in instanceData) {
                newExpense[p] = instanceData[p]; 
            }
            newExpense.save(function(err, created) {
                if (err) {
                    respondWithError(req, err);
                } else {
                    res.json(created);    
                }
            });
        });
        
        
        // routes for expenses.Employee
        app.get("/entities/expenses.Employee", function(req, res) {
            res.json({
                extentUri: resolveUrl('entities/expenses.Employee/instances')
            });
        });
        app.get("/entities/expenses.Employee/instances", function(req, res) {
            return mongoose.model('expenses.Employee').find().then(function(block) {
                res.json({
                    offset: 0,
                    length: block.size(),
                    contents: block
                });
            });
        });
        app.get("/entities/expenses.Employee/template", function(req, res) {
            res.json(new Employee());
        });
        app.post("/entities/expenses.Employee/instances", function(req, res) {
            var instanceData = req.body;
            var newEmployee = new Employee();
            for (var p in instanceData) {
                newEmployee[p] = instanceData[p]; 
            }
            newEmployee.save(function(err, created) {
                if (err) {
                    respondWithError(req, err);
                } else {
                    res.json(created);    
                }
            });
        });
    }
};
