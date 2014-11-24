var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Client = require('./Client.js');
var Invoice = require('./Invoice.js');

// declare schema
var taskSchema = new Schema({
    description : {
        type : String,
        required : true,
        default : null
    },
    client : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    },
    reported : [{
        units : {
            type : Number,
            required : true,
            default : 0
        },
        date : {
            type : Date,
            required : true,
            default : (function() {
                return new Date();
            })()
        },
        memo : {
            type : String,
            default : null
        },
        invoice : {
            type : Schema.Types.ObjectId,
            ref : "Invoice"
        }
    }]
});

/*************************** ACTIONS ***************************/

taskSchema.methods.addWork = function (units) {
    var newWork;
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("newWork = new Work();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newWork = new Work();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newWork['units'] = units;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newWork['units'] = units;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("// link reported and task<NL>me.reported.push(newWork);<NL>newWork.task = me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            // link reported and task
            me.reported.push(newWork);
            newWork.task = me;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newWork.save();<NL>return q(newWork);<NL>".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newWork.save();
            return q(newWork);
        });
    });
};
/*************************** DERIVED PROPERTIES ****************/

taskSchema.virtual('unitsReported').get(function () {
    return this.countUnits(this['reported']);
});

taskSchema.virtual('unitsToInvoice').get(function () {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return me.getToInvoice();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me.getToInvoice();
        }),
        Q.when(function() {
            console.log("return me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return me;
        })
    ]).spread(function(read_toInvoice, readSelfAction) {
        return readSelfAction.countUnits(read_toInvoice);
    });
});
/*************************** DERIVED RELATIONSHIPS ****************/

taskSchema.methods.getToInvoice = function () {
    var me = this;
    return Q.when(function() {
        console.log("return me['reported'].where({<NL>    $ne : [ <NL>        { 'invoiced' : true },<NL>        true<NL>    ]<NL>});".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return me['reported'].where({
            $ne : [ 
                { 'invoiced' : true },
                true
            ]
        });
    });
};
/*************************** PRIVATE OPS ***********************/

taskSchema.methods.countUnits = function (work) {
    return Work.aggregate()
                  .group({ _id: null, result: { $sum: '$units' } })
                  .select('-id result').exec();
};

// declare model on the schema
var exports = module.exports = mongoose.model('Task', taskSchema);
