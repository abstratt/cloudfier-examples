var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Employee = require('./Employee.js');
var Expense = require('./Expense.js');

/**
 *  The category for an expense. 
 */
// declare schema
var categorySchema = new Schema({
    name : {
        type : String,
        "default" : null
    }
});

/*************************** ACTIONS ***************************/

categorySchema.statics.newCategory = function (name) {
    var newCategory;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("newCategory = new Category();\n");
            newCategory = new Category();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newCategory['name'] = name;\n");
            newCategory['name'] = name;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(newCategory, 'save', [  ]).then(function(saveResult) {\n    return saveResult[0];\n});\n");
            return Q.npost(newCategory, 'save', [  ]).then(function(saveResult) {
                return saveResult[0];
            });
        });
    }).then(function() {
        return me.save();
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.methods.getExpensesInThisCategory = function () {
    var me = this;
    return Q().then(function() {
        console.log("return Expense.findExpensesByCategory(me);");
        return Expense.findExpensesByCategory(me);
    }).then(function(findExpensesByCategory) {
        console.log(findExpensesByCategory);
        console.log("return findExpensesByCategory;\n");
        return findExpensesByCategory;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
