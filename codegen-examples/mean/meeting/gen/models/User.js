var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var Meeting = require('./Meeting.js');
var Presentation = require('./Presentation.js');

// declare schema
var userSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : null
    },
    email : {
        type : String,
        default : null
    },
    meetings : [{
        type : Schema.Types.ObjectId,
        ref : "Meeting"
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Creates a meeting organized by this participant. 
 */
userSchema.methods.startMeetingOnBehalf = function (title, description, date) {
    var newMeeting = new Meeting();
    newMeeting.date = date;
    newMeeting.title = title;
    newMeeting.description = description;
    newMeeting.organizer = this;
    newMeeting.addParticipant(newMeeting.organizer);
    return this.save();
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.statics.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
