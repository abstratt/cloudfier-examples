var q = require("q");
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
    return q().then(function() {
        return User.findOne({ _id : newMeeting.organizer }).exec();
    }).then(function(organizer) {
        newMeeting.addParticipant(organizer)
    }).then(function(addParticipant) {
        var newMeeting;
        newMeeting = new Meeting();
        newMeeting['date'] = date;
        newMeeting['title'] = title;
        newMeeting['description'] = description;
        newMeeting['organizer'] = this;
        addParticipant;
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.statics.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
