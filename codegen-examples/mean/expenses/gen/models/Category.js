var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  The category for an expense. 
 */
// declare schema
var categorySchema = new Schema({
    name : {
        type : String,
        required : true
    }
});

/*************************** ACTIONS ***************************/

categorySchema.statics.newCategory = function (name) {
    var newCategory = new require('./Category.js') ();
    newCategory.name = name;
    return newCategory;
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.methods.getExpensesInThisCategory = function () {
    return require('./Expense.js').findExpensesByCategory(this);
};

// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
