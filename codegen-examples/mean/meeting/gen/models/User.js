var Q = require("q");
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
    var me = this;
    return Q.when(null).then(function() {
        return Q.when(function() {
            console.log("newMeeting = new Meeting();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newMeeting = new Meeting();
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newMeeting['date'] = date;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newMeeting['date'] = date;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newMeeting['title'] = title;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newMeeting['title'] = title;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newMeeting['description'] = description;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newMeeting['description'] = description;
        });
    }).then(function() {
        return Q.when(function() {
            console.log("newMeeting['organizer'] = me;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
            newMeeting['organizer'] = me;
        });
    }).then(function() {
        return Q.all([
            Q.when(function() {
                console.log("return User.findOne({ _id : newMeeting.organizer }).exec();".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
                return User.findOne({ _id : newMeeting.organizer }).exec();
            }),
            Q.when(function() {
                console.log("return newMeeting;".replace(/<Q>/g, '"').replace(/<NL>/g, '\n'))  ;
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
