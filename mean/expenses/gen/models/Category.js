var Q = require("q");
var mongoose = require('./db.js');    
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
//            categorySchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

categorySchema.statics.newCategory = function (name) {
    var newCategory;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            newCategory = new Category();
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(String, 'findOne', [ ({ _id : name._id }) ]);
        }).then(function(name) {
            newCategory['name'] = name;
        });
    }).then(function() {
        return Q().then(function() {
            return newCategory;
        });
    }).then(function(__result__) {
        return Q.all([
            Q().then(function() {
                return Q.npost(newCategory, 'save', [  ]);
            })
        ]).spread(function() {
            return __result__;    
        });
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

categorySchema.methods.getExpensesInThisCategory = function () {
    var me = this;
    return Q().then(function() {
        return Expense.findExpensesByCategory(me);
    }).then(function(findExpensesByCategory) {
        return findExpensesByCategory;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Category', categorySchema);
