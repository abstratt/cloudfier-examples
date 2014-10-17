var mongoose = require('mongoose');        
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String
    },
    meetings : [{
        type : Schema.Types.ObjectId,
        ref : "Meeting"
    }]
});
var User = mongoose.model('User', userSchema);

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
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.static.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

var exports = module.exports = User;
