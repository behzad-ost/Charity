var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var jdate = require('jdate').JDate();

// mongoose.connect('mongodb://localhost:27017/nodeauth');

var db = mongoose.connection;


var paymentSchema = new Schema({
	amount: {
		type: Number,
		required: true
	},
	reason: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});


var personSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim:true
	},
	SSnumber: {
		type: Number,
		required: true,
		unique: true
	},
	charity:{
		type: String,
		required: true,
		trim:true
	},
	lastrecieve:{
		type: String
		// ,default: jdate.toString()
	},
	payments:[paymentSchema]
}, {
	timestamps: true
});

var Persons = mongoose.model('Person', personSchema);
//var Payments = mongoose.model('Payment', paymentSchema);
module.exports = Persons;

module.exports.createPerson = function(newPerson, callback) {
		newPerson.save(callback);	
}

// module.exports.payment = Payments;