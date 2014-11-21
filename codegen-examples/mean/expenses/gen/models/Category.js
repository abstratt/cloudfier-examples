var q = require("q");
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
        required : true,
        default : null
    }
});

/*************************** ACTIONS ***************************/

categorySchema.statics.newCategory = function (name) {
    var newCategory;
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            newCategory = new Category();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newCategory['name'] = name;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newCategory.save();
            return q(newCategory);
        });
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.methods.getExpensesInThisCategory = function () {
    return q(/*leaf*/).then(function() {
        return Expense.findExpensesByCategory(this);
    }).then(function(/*singleChild*/call_findExpensesByCategory) {
        return call_findExpensesByCategory;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
