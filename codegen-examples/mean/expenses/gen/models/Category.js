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
        required : true,
        default : null
    }
});

/*************************** ACTIONS ***************************/

categorySchema.statics.newCategory = function (name) {
    var newCategory;
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("newCategory = new Category();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newCategory = new Category();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newCategory['name'] = name;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newCategory['name'] = name;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newCategory.save();<NL>return q(newCategory);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newCategory.save();
            return q(newCategory);
        });
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.methods.getExpensesInThisCategory = function () {
    var me = this;
    return Q.when(function() {
        console.log("return Expense.findExpensesByCategory(me);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return Expense.findExpensesByCategory(me);
    }).then(function(call_findExpensesByCategory) {
        return call_findExpensesByCategory;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
