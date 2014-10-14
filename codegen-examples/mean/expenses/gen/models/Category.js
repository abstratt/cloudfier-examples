    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;

    /**
     *  The category for an expense. 
     */
    var categorySchema = new Schema({
        name : String
    });
    
    /*************************** ACTIONS ***************************/
    
    categorySchema.statics.newCategory = function (name) {
        newCategory = new Category();
        newCategory.name = name;
        return newCategory;
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    categorySchema.methods.getExpensesInThisCategory = function () {
        return Expense.findExpensesByCategory(this);
    };
    var Category = mongoose.model('Category', categorySchema);
    Category.emitter = new EventEmitter();
