var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var meetingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
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
var Meeting = mongoose.model('Meeting', meetingSchema);

/*************************** ACTIONS ***************************/

/**
 *  Makes the current user leave this meeting. Note that organizers cannot leave a meeting. 
 */
meetingSchema.methods.leave = function () {
    User.current.meetings = null;
    User.current = null;
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    // link participants and meetings
    this.participants.push(User.current);
    User.current.meetings.push(this);
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    // link participants and meetings
    this.participants.push(newParticipant);
    newParticipant.meetings.push(this);
};

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    User.current.startMeetingOnBehalf(title, description, date);
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    return includes;
};

meetingSchema.methods.isOrganizing = function (candidate) {
    return this.organizer == candidate;
};

var exports = module.exports = Meeting;
