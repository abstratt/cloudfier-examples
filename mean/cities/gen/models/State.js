var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var City = require('./City.js');

// declare schema
var stateSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    abbreviation : {
        type : String,
        "default" : null
    },
    cities : [{
        type : Schema.Types.ObjectId,
        ref : "City",
        "default" : []
    }]
});


/*************************** QUERIES ***************************/

stateSchema.statics.byAbbreviation = function (abbreviation) {
    var me = this;
    return Q().then(function() {
        return mongoose.model('State').where({
            $eq : [ 
                abbreviation,
                abbreviation
            ]
        }).findOne();
    }).then(function(anyResult) {
        return Q.npost(anyResult, 'exec', [  ])
        ;
    });
};

stateSchema.statics.statesMorePopulousThan = function (threshold) {
    var me = this;
    return Q().then(function() {
        return <UNSUPPORTED: Activity> >;
    }).then(function(groupByResult) {
        return <UNSUPPORTED: CallOperationAction> (groupCollect)>.where({
            $gt : [ 
                statePopulation,
                threshold
            ]
        });
    }).then(function(selectResult) {
        return /*TBD*/collect;
    }).then(function(collectResult) {
        return Q.npost(collectResult, 'exec', [  ])
        ;
    });
};

stateSchema.statics.abbreviationsOfStatesMorePopulousThan = function (threshold) {
    var me = this;
    return Q().then(function() {
        return require('./State.js').statesMorePopulousThan(threshold);
    }).then(function(statesMorePopulousThanResult) {
        return /*TBD*/collect;
    }).then(function(collectResult) {
        return Q.npost(collectResult, 'exec', [  ])
        ;
    });
};

stateSchema.statics.statePopulations = function () {
    var me = this;
    return Q().then(function() {
        return /*TBD*/collect;
    }).then(function(collectResult) {
        return Q.npost(collectResult, 'exec', [  ])
        ;
    });
};
/*************************** DERIVED PROPERTIES ****************/

stateSchema.methods.getPopulation = function () {
    var me = this;
    return Q().then(function() {
        return Q.npost(require('./City.js'), 'find', [ ({ cityState : me._id }) ]);
    }).then(function(cities) {
        return <UNSUPPORTED: Activity> >;
    }).then(function(sumResult) {
        return sumResult;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('State', stateSchema);
