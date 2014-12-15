var Q = require("q");
var mongoose = require('./db.js');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Presentation = require('./Presentation.js');

// declare schema
var meetingSchema = new Schema({
    title : {
        type : String,
        "default" : null
    },
    description : {
        type : String,
        "default" : null
    },
    date : {
        type : Date,
        "default" : new Date()
    },
    organizer : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    participants : [{
        type : Schema.Types.ObjectId,
        ref : "User",
        "default" : []
    }]
});
//            meetingSchema.set('toObject', { getters: true });


/*************************** ACTIONS ***************************/

/**
 *  Makes the current user leave this meeting. Note that organizers cannot leave a meeting. 
 */
meetingSchema.methods.leave = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isParticipating(User.current);
        }).then(function(isParticipating) {
            return isParticipating;
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'meeting::Meeting::leave')");
            error.context = 'meeting::Meeting::leave';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            User.current.meetings = null;
            User.current = null;
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
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
    });
};

/**
 *  Makes the current user join this meeting. 
 */
meetingSchema.methods.join = function () {
    var me = this;
    return Q().then(function() {
        return Q().then(function() {
            return me.isParticipating(User.current);
        }).then(function(isParticipating) {
            return !(isParticipating);
        });
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'meeting::Meeting::join')");
            error.context = 'meeting::Meeting::join';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q().then(function() {
            me.participants.push(User.current._id);
            User.current.meetings.push(me._id);
        }).then(function(/*no-arg*/) {
            return Q.all([
                Q().then(function() {
                    return Q.npost(me, 'save', [  ]);
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
    });
};

/**
 *  Adds a selected participant to this meeting. 
 */
meetingSchema.methods.addParticipant = function (newParticipant) {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./User.js'), 'findOne', [ ({ _id : newParticipant._id }) ]);
        }),
        Q().then(function() {
            return me;
        })
    ]).spread(function(newParticipant, readSelfAction) {
        readSelfAction.participants.push(newParticipant._id);
        newParticipant.meetings.push(readSelfAction._id);
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
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

/**
 *  Starts a meeting having the current user as organizer. 
 */
meetingSchema.statics.startMeeting = function (title, description, date) {
    var me = this;
    return Q().then(function() {
        return !(User.current == null);
    }).then(function(pass) {
        if (!pass) {
            var error = new Error("Precondition violated:  (on 'meeting::Meeting::startMeeting')");
            error.context = 'meeting::Meeting::startMeeting';
            error.constraint = '';
            throw error;
        }    
    }).then(function() {
        return Q.all([
            Q().then(function() {
                return Q.npost(String, 'findOne', [ ({ _id : title._id }) ]);
            }),
            Q().then(function() {
                return Q.npost(Memo, 'findOne', [ ({ _id : description._id }) ]);
            }),
            Q().then(function() {
                return Q.npost(Date, 'findOne', [ ({ _id : date._id }) ]);
            }),
            Q().then(function() {
                return User.current;
            })
        ]).spread(function(title, description, date, current) {
            return current.startMeetingOnBehalf(title, description, date);
        });
    });
};
/*************************** PRIVATE OPS ***********************/

meetingSchema.methods.isParticipating = function (candidate) {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./User.js'), 'findOne', [ ({ _id : candidate._id }) ]);
        }),
        Q().then(function() {
            return Q.npost(require('./User.js'), 'find', [ ({ meetings : me._id }) ]);
        })
    ]).spread(function(candidate, participants) {
        return Q.npost(/*TBD*/includes, 'exec', [  ])
        ;
    });
};

meetingSchema.methods.isOrganizing = function (candidate) {
    var me = this;
    return Q.all([
        Q().then(function() {
            return Q.npost(require('./User.js'), 'findOne', [ ({ _id : me.organizer }) ]);
        }),
        Q().then(function() {
            return Q.npost(require('./User.js'), 'findOne', [ ({ _id : candidate._id }) ]);
        })
    ]).spread(function(organizer, candidate) {
        return organizer == candidate;
    }).then(function(/*no-arg*/) {
        return Q.all([
            Q().then(function() {
                return Q.npost(me, 'save', [  ]);
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

// declare model on the schema
var exports = module.exports = mongoose.model('Meeting', meetingSchema);
