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
        "default" : null
    },
    email : {
        type : String,
        "default" : null
    },
    meetings : [{
        type : Schema.Types.ObjectId,
        ref : "Meeting",
        "default" : []
    }]
});

/*************************** ACTIONS ***************************/

/**
 *  Creates a meeting organized by this participant. 
 */
userSchema.methods.startMeetingOnBehalf = function (title, description, date) {
    var newMeeting;
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            console.log("newMeeting = new Meeting();\n");
            newMeeting = new Meeting();
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newMeeting['date'] = date;\n");
            newMeeting['date'] = date;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newMeeting['title'] = title;\n");
            newMeeting['title'] = title;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newMeeting['description'] = description;\n");
            newMeeting['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("console.log(\"This: \");\nconsole.log(me);\nconsole.log(\"That: \");\nconsole.log(newMeeting);\nnewMeeting.organizer = me._id\n;\n");
            console.log("This: ");
            console.log(me);
            console.log("That: ");
            console.log(newMeeting);
            newMeeting.organizer = me._id
            ;
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                console.log("return Q.npost(User, 'findOne', [ ({ _id : newMeeting.organizer }) ]);");
                return Q.npost(User, 'findOne', [ ({ _id : newMeeting.organizer }) ]);
            }),
            Q().then(function() {
                console.log("return newMeeting;");
                return newMeeting;
            })
        ]).spread(function(organizer, NewMeeting) {
            NewMeeting.addParticipant(organizer);
        });
    }).then(function() {
        return me.save();
    });
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.statics.getCurrent = function () {
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
