var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

/**
 *  The category for an expense. 
 */
var categorySchema = new Schema({
    name : {
        type : String,
        required : true
    }
});
var Category = mongoose.model('Category', categorySchema);

/*************************** ACTIONS ***************************/

categorySchema.statics.newCategory = function (name) {
    var newCategory = new Category();
    newCategory.name = name;
    return newCategory;
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.method.getExpensesInThisCategory = function () {
    return Expense.findExpensesByCategory(this);
};

var exports = module.exports = Category;
