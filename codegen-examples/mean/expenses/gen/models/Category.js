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
    // isAsynchronous: true        
    var newCategory;
    console.log("newCategory = new Category()");
    newCategory = new Category();
    
    console.log("newCategory.name = name");
    newCategory.name = name;
    
    console.log("return newCategory");
    return newCategory;
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.methods.getExpensesInThisCategory = function () {
    // isAsynchronous: true        
    console.log("return Expense.findExpensesByCategory(this)");
    return Expense.findExpensesByCategory(this);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
