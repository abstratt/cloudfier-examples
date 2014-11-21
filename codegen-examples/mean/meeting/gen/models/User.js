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
    var newMeeting;
    return q(/*sequential*/).then(function() {
        return q(/*leaf*/).then(function() {
            newMeeting = new Meeting();
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newMeeting['date'] = date;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newMeeting['title'] = title;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newMeeting['description'] = description;
        });
    }).then(function() {
        return q(/*leaf*/).then(function() {
            newMeeting['organizer'] = this;
        });
    }).then(function() {
        return q(/*parallel*/).all([
            q(/*leaf*/).then(function() {
                return User.findOne({ _id : newMeeting.organizer }).exec();
            }), q(/*leaf*/).then(function() {
                return newMeeting;
            })
        ]).spread(function(read_organizer, read_NewMeeting) {
            read_NewMeeting.addParticipant(read_organizer);
        });
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.statics.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
