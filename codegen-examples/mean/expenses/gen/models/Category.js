    var EventEmitter = require('events').EventEmitter;
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
        },
        expensesInThisCategory : [{
            type : Schema.Types.ObjectId,
            ref : "Expense"
        }]
    });
    var Category = mongoose.model('Category', categorySchema);
    Category.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    categorySchema.statics.newCategory = function (name) {
        newCategory = new Category();
        newCategory.name = name;
        return newCategory;
        this.handleEvent('newCategory');
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    categorySchema.methods.getExpensesInThisCategory = function () {
        return Expense.findExpensesByCategory(this);
    };
    
    var exports = module.exports = Category;
