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
            newMeeting = new require('./Meeting.js')();
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);
        }).then(function(date) {
            newMeeting['date'] = date;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(String, 'findOne', [ ({ _id : title._id }) ]);
        }).then(function(title) {
            newMeeting['title'] = title;
        });
    }).then(function() {
        return Q().then(function() {
            return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
        }).then(function(description) {
            newMeeting['description'] = description;
        });
    }).then(function() {
        return Q().then(function() {
            newMeeting.organizer = me._id
            ;
        });
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return Q.npost(require('./User.js'), 'findOne', [ ({ _id : newMeeting.organizer }) ]);
            }),
            Q().then(function() {
                return newMeeting;
            })
        ]).spread(function(organizer, newMeeting) {
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
    return cls.getNamespace('currentUser');
};

// declare model on the schema
var exports = module.exports = mongoose.model('User', userSchema);
