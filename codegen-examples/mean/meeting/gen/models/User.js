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
    // isAsynchronous: true        
    var newMeeting;
    console.log("newMeeting = new Meeting()");
    newMeeting = new Meeting();
    
    console.log("newMeeting.date = date");
    newMeeting.date = date;
    
    console.log("newMeeting.title = title");
    newMeeting.title = title;
    
    console.log("newMeeting.description = description");
    newMeeting.description = description;
    
    console.log("newMeeting.organizer = this");
    newMeeting.organizer = this;
    
    console.log("newMeeting.addParticipant(newMeeting.organizer)");
    newMeeting.addParticipant(newMeeting.organizer);
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.statics.getCurrent = function () {
    // isAsynchronous: false        
    console.log("return cls.getNamespace('currentUser')");
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
