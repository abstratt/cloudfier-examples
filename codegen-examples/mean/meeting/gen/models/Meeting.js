var q = require("q");
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
    return q().then(function() {
        User['current'].meetings = null;
        User['current'] = null;
    });
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    return q().then(function() {
        // link participants and meetings
        this.participants.push(User['current']);
        User['current'].meetings.push(this);
    });
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    return q().then(function() {
        // link participants and meetings
        this.participants.push(newParticipant);
        newParticipant.meetings.push(this);
    });
};

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    return q().then(function() {
        User['current'].startMeetingOnBehalf(title, description, date)
    }).then(function(startMeetingOnBehalf) {
        startMeetingOnBehalf;
    });
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    return q().then(function() {
        return User.find({ _id : this.participants }).exec();
    }).then(function(participants) {
        return includes.exec();
    });
};

meetingSchema.methods.isOrganizing = function (candidate) {
    return q().then(function() {
        return User.findOne({ _id : this.organizer }).exec();
    }).then(function(organizer) {
        return organizer == candidate;
    });
};

// declare model on the schema
var exports = module.exports = mongoose.model('Meeting', meetingSchema);
