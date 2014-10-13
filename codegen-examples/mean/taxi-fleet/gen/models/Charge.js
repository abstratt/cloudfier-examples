    var EventEmitter = require('events').EventEmitter;        

    /**
     *  Charges for renting taxis. 
     */
    var chargeSchema = new Schema({
        date : Date,
        receivedOn : Date,
        description : String,
        amount : Number,
        status : Status,
        paid : Boolean
    });
    
    /*************************** ACTIONS ***************************/
    
    chargeSchema.methods.pay = function () {};
    
    chargeSchema.methods.cancelPayment = function () {};
    
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
    };
    /*************************** QUERIES ***************************/
    
    chargeSchema.statics.pendingCharges = function () {
        return this.model('Charge').find().where('paid').ne(true).exec();
    };
    
    chargeSchema.statics.byTaxi = function (taxi) {
        return this.model('Charge').find().where('taxi').eq(taxi).exec();
    };
    
    chargeSchema.statics.paidCharges = function () {
        return this.model('Charge').find().where('paid').exec();
    };
    /*************************** DERIVED PROPERTIES ****************/
    
    chargeSchema.methods.getPaid = function () {
        return this.status == null;
    };
    /*************************** STATE MACHINE ********************/
    Charge.emitter.on('pay', function () {
        if (this.status == 'Pending') {
            this.status = 'Paid';
            (function() {
                this.receivedOn = new Date();
            })();
            return;
        }
    });     
    
    Charge.emitter.on('cancelPayment', function () {
        if (this.status == 'Paid') {
            this.status = 'Pending';
            return;
        }
    });     
    
    var Charge = mongoose.model('Charge', chargeSchema);
    Charge.emitter = new EventEmitter();
