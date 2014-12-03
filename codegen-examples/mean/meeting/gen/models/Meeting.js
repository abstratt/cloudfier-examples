var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Presentation = require('./Presentation.js');

// declare schema
var meetingSchema = new Schema({
    title : {
        type : String,
        "default" : null
    },
    description : {
        type : String,
        "default" : null
    },
    date : {
        type : Date,
        "default" : new Date()
    },
    organizer : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    participants : [{
        type : Schema.Types.ObjectId,
        ref : "User",
        "default" : []
    }]
});
//            meetingSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

/**
 *  Makes the current user leave this meeting. Note that organizers cannot leave a meeting. 
 */
meetingSchema.methods.leave = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("User.current.meetings = null;\nUser.current = null;\n");
        User.current.meetings = null;
        User.current = null;
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.participants.push(User.current._id);\nUser.current.meetings.push(me._id);\n");
        me.participants.push(User.current._id);
        User.current.meetings.push(me._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q().then(function() {
        console.log("me.participants.push(newParticipant._id);\nnewParticipant.meetings.push(me._id);\n");
        me.participants.push(newParticipant._id);
        newParticipant.meetings.push(me._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    return Q().then(function() {
        console.log("return User.current.startMeetingOnBehalf(title, description, date);");
        return User.current.startMeetingOnBehalf(title, description, date);
    });
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(User, 'find', [ ({ meetings : me._id }) ]);");
        return Q.npost(User, 'find', [ ({ meetings : me._id }) ]);
    }).then(function(participants) {
        console.log("return Q.npost(/*TBD*/includes, 'exec', [  ])\n;\n");
        return Q.npost(/*TBD*/includes, 'exec', [  ])
        ;
    });
};

meetingSchema.methods.isOrganizing = function (candidate) {
    var me = this;
    return /* Working set: [me] *//* Working set: [me] */Q.all([
        Q().then(function() {
            console.log("return Q.npost(User, 'findOne', [ ({ _id : me.organizer }) ]);");
            return Q.npost(User, 'findOne', [ ({ _id : me.organizer }) ]);
        }),
        Q().then(function() {
            console.log("return candidate;");
            return candidate;
        })
    ]).spread(function(organizer, Candidate) {
        return organizer == Candidate;
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Meeting', meetingSchema);
