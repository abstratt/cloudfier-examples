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
    var precondition = function() {
        return this.isParticipating(User.current);
    };
    if (!precondition.call(this)) {
        throw "Precondition on leave was violated"
    }
    User.current.meetings = null;
    User.current = null;
    return this.save();
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    var precondition = function() {
        return !this.isParticipating(User.current);
    };
    if (!precondition.call(this)) {
        throw "Precondition on join was violated"
    }
    // link participants and meetings
    this.participants.push(User.current);
    User.current.meetings.push(this);
    return this.save();
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    // link participants and meetings
    this.participants.push(newParticipant);
    newParticipant.meetings.push(this);
    return this.save();
};

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    var precondition = function() {
        return !User.current == null;
    };
    if (!precondition.call(this)) {
        throw "Precondition on startMeeting was violated"
    }
    User.current.startMeetingOnBehalf(title, description, date);
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    return includes.exec();
};

meetingSchema.methods.isOrganizing = function (candidate) {
    return this.organizer == candidate;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Meeting', meetingSchema);
