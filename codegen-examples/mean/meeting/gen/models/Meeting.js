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
        required : true,
        default : null
    },
    description : {
        type : String,
        required : true,
        default : null
    },
    date : {
        type : Date,
        required : true,
        default : new Date()
    },
    organizer : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    participants : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Makes the current user leave this meeting. Note that organizers cannot leave a meeting. 
 */
meetingSchema.methods.leave = function () {
    var me = this;
    return Q.when(function() {
        console.log("User['current'].meetings = null;<NL>User['current'] = null;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        User['current'].meetings = null;
        User['current'] = null;
    });
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    var me = this;
    return Q.when(function() {
        console.log("// link participants and meetings<NL>me.participants.push(User['current']);<NL>User['current'].meetings.push(me);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        // link participants and meetings
        me.participants.push(User['current']);
        User['current'].meetings.push(me);
    });
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    var me = this;
    return Q.when(function() {
        console.log("// link participants and meetings<NL>me.participants.push(newParticipant);<NL>newParticipant.meetings.push(me);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        // link participants and meetings
        me.participants.push(newParticipant);
        newParticipant.meetings.push(me);
    });
};

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    var me = this;
    return Q.when(function() {
        console.log("User['current'].startMeetingOnBehalf(title, description, date);".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        User['current'].startMeetingOnBehalf(title, description, date);
    });
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    var me = this;
    return Q.when(function() {
        console.log("return User.find({ meetings : me._id }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
        return User.find({ meetings : me._id }).exec();
    }).then(function(read_participants) {
        return /*TBD*/includes.exec();
    });
};

meetingSchema.methods.isOrganizing = function (candidate) {
    var me = this;
    return Q.all([
        Q.when(function() {
            console.log("return User.findOne({ _id : me.organizer }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return User.findOne({ _id : me.organizer }).exec();
        }),
        Q.when(function() {
            console.log("return candidate;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            return candidate;
        })
    ]).spread(function(read_organizer, read_Candidate) {
        return read_organizer == read_Candidate;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Meeting', meetingSchema);
