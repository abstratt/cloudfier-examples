var Q = require("q");
var mongoose = require('./db.js');    
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
//            userSchema.set('toObject', { getters: true });


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
            console.log("return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);");
            return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);
        }).then(function(date) {
            console.log("newMeeting['date'] = date;\n");
            newMeeting['date'] = date;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(String, 'findOne', [ ({ _id : title._id }) ]);");
            return Q.npost(String, 'findOne', [ ({ _id : title._id }) ]);
        }).then(function(title) {
            console.log("newMeeting['title'] = title;\n");
            newMeeting['title'] = title;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);");
            return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
        }).then(function(description) {
            console.log("newMeeting['description'] = description;\n");
            newMeeting['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            console.log("newMeeting.organizer = me._id\n;\n");
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
        ]).spread(function(organizer, newMeeting) {
            console.log("organizer:" + organizer);console.log("newMeeting:" + newMeeting);
            return newMeeting.addParticipant(organizer);
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            }),
            Q().then(function() {
                return Q.npost(newMeeting, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
            })
        ]).spread(function() {
            /* no-result */    
        });
    })
    ;
};
/*************************** DERIVED RELATIONSHIPS ****************/

userSchema.statics.getCurrent = function () {
    /*sync*/console.log("return cls.getNamespace('currentUser');");
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
