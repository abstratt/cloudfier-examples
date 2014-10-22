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
    newCategory = new Category();
    newCategory.name = name;
    return newCategory;
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.methods.getExpensesInThisCategory = function () {
    return Expense.findExpensesByCategory(this);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
