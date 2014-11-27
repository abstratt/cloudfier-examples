var Q = require("q");
var mongoose = require('mongoose');    
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

/*************************** ACTIONS ***************************/

/**
 *  Makes the current user leave this meeting. Note that organizers cannot leave a meeting. 
 */
meetingSchema.methods.leave = function () {
    var me = this;
    return Q().then(function() {
        console.log("User['current'].meetings = null;\nUser['current'] = null;\n");
        User['current'].meetings = null;
        User['current'] = null;
    }).then(function() {
        return me.save();
    });
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(User['current']);\nconsole.log(\"That: \");\nconsole.log(me);\nme.participants.push(User['current']._id);\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(User['current']);\nUser['current'].meetings.push(me._id);\n");
        console.log("This: ");
        console.log(User['current']);
        console.log("That: ");
        console.log(me);
        me.participants.push(User['current']._id);
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(User['current']);
        User['current'].meetings.push(me._id);
    }).then(function() {
        return me.save();
    });
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    var me = this;
    return Q().then(function() {
        console.log("console.log(\"This: \");\nconsole.log(newParticipant);\nconsole.log(\"That: \");\nconsole.log(me);\nme.participants.push(newParticipant._id);\nconsole.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(newParticipant);\nnewParticipant.meetings.push(me._id);\n");
        console.log("This: ");
        console.log(newParticipant);
        console.log("That: ");
        console.log(me);
        me.participants.push(newParticipant._id);
        console.log("This: ");
        console.log(me);
        console.log("That: ");
        console.log(newParticipant);
        newParticipant.meetings.push(me._id);
    }).then(function() {
        return me.save();
    });
};

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    var me = this;
    return Q().then(function() {
        console.log("User['current'].startMeetingOnBehalf(title, description, date);\n");
        User['current'].startMeetingOnBehalf(title, description, date);
    }).then(function() {
        return me.save();
    });
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    var me = this;
    return Q().then(function() {
        console.log("return Q.npost(User, 'find', [ ({ meetings : me._id }) ]);");
        return Q.npost(User, 'find', [ ({ meetings : me._id }) ]);
    }).then(function(participants) {
        console.log(participants);
        console.log("return Q.npost(/*TBD*/includes, 'exec', [  ])\n;\n");
        return Q.npost(/*TBD*/includes, 'exec', [  ])
        ;
    });
};

meetingSchema.methods.isOrganizing = function (candidate) {
    var me = this;
    return Q.all([
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
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Meeting', meetingSchema);
