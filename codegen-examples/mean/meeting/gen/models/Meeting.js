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
    // isAsynchronous: false        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return this.isParticipating(User.current)");
        return this.isParticipating(User.current);
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return this.isParticipating(User.current)');\n    return this.isParticipating(User.current);\n}");
        throw "Precondition on leave was violated"
    }
    console.log("User.current.meetings = null;nUser.current = null");
    User.current.meetings = null;
    User.current = null;
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !this.isParticipating(User.current)");
        return !this.isParticipating(User.current);
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !this.isParticipating(User.current)');\n    return !this.isParticipating(User.current);\n}");
        throw "Precondition on join was violated"
    }
    console.log("// link participants and meetingsnthis.participants.push(User.current);nUser.current.meetings.push(this)");
    // link participants and meetings
    this.participants.push(User.current);
    User.current.meetings.push(this);
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    // isAsynchronous: true        
    console.log("// link participants and meetingsnthis.participants.push(newParticipant);nnewParticipant.meetings.push(this)");
    // link participants and meetings
    this.participants.push(newParticipant);
    newParticipant.meetings.push(this);
    console.log('Saving...');
    var _savePromise = new Promise;
    this.save(_savePromise.reject, _savePromise.fulfill); 
    return _savePromise;
};

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    // isAsynchronous: true        
    var precondition = function() {
        // isAsynchronous: false        
        console.log("return !User.current == null");
        return !User.current == null;
    };
    if (!precondition.call(this)) {
        console.log("Violated: function() {\n    // isAsynchronous: false        \n    console.log('return !User.current == null');\n    return !User.current == null;\n}");
        throw "Precondition on startMeeting was violated"
    }
    console.log("User.current.startMeetingOnBehalf(title, description, date)");
    User.current.startMeetingOnBehalf(title, description, date);
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    // isAsynchronous: false        
    console.log("return includes.exec()");
    return includes.exec();
};

meetingSchema.methods.isOrganizing = function (candidate) {
    // isAsynchronous: false        
    console.log("return this.organizer == candidate");
    return this.organizer == candidate;
};

// declare model on the schema
var exports = module.exports = mongoose.model('Meeting', meetingSchema);
