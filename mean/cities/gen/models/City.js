var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var State = require('./State.js');

// declare schema
var citySchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    population : {
        type : Number,
        "default" : 0
    },
    cityState : {
        type : Schema.Types.ObjectId,
        ref : "State",
        required : true
    }
});



// declare model on the schema
var exports = module.exports = mongoose.model('City', citySchema);
