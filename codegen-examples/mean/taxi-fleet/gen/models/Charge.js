    var EventEmitter = require('events').EventEmitter;
    var mongoose = require('mongoose');        
    var Schema = mongoose.Schema;
    var cls = require('continuation-local-storage');
    

    /**
     *  Charges for renting taxis. 
     */
    var chargeSchema = new Schema({
        date : {
            type : Date
        },
        receivedOn : {
            type : Date
        },
        description : {
            type : String
        },
        amount : {
            type : Number
        },
        status : {
            type : String,
            enum : ["Pending", "Paid"]
        },
        paid : {
            type : Boolean
        },
        driver : {
            type : Schema.Types.ObjectId,
            ref : "Driver"
        },
        taxi : {
            type : Schema.Types.ObjectId,
            ref : "Taxi"
        }
    });
    var Charge = mongoose.model('Charge', chargeSchema);
    Charge.emitter = new EventEmitter();
    
    /*************************** ACTIONS ***************************/
    
    chargeSchema.methods.pay = function () {
        this.handleEvent('pay');    
    };
    
    chargeSchema.methods.cancelPayment = function () {
        this.handleEvent('cancelPayment');    
    };
    
    chargeSchema.statics.newCharge = function (taxi, payer, date) {
        if (date == null) {
            date = new Date();
        }
        charge = new Charge();
        charge.description = taxi.name + " - " + taxi.shift.description;
        charge.amount = taxi.shift.price;
        charge.taxi = taxi;
        charge.date = date;
        payer.driver = charge;
        this.handleEvent('newCharge');
    };
    /*************************** QUERIES ***************************/
    
    chargeSchema.statics.pendingCharges = function () {
        return this.model('Charge').find().where('paid').ne(true).exec();
        this.handleEvent('pendingCharges');
    };
    
    chargeSchema.statics.byTaxi = function (taxi) {
        return this.model('Charge').find().where('taxi').eq(taxi).exec();
        this.handleEvent('byTaxi');
    };
    
    chargeSchema.statics.paidCharges = function () {
        return this.model('Charge').find().where('paid').exec();
        this.handleEvent('paidCharges');
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    chargeSchema.methods.isPaid = function () {
        return this.status == null;
    };
    /*************************** STATE MACHINE ********************/
    chargeSchema.methods.handleEvent = function (event) {
        switch (event) {
            case 'pay' :
                if (this.status == 'Pending') {
                    this.status = 'Paid';
                    // on entering Paid
                    (function() {
                        this.receivedOn = new Date();
                    })();
                    return;
                }
                break;
            
            case 'cancelPayment' :
                if (this.status == 'Paid') {
                    this.status = 'Pending';
                    return;
                }
                break;
        }
    };
    
    
    var exports = module.exports = Charge;
