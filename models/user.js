var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
// mongoose.connect('mongodb://localhost:27017/nodeauth');

// var db = mongoose.connection;

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		bcrypt: true,
		required: true
	},
	email: {
		type: String,
		unique: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback) {
	var query = {
		username: username
	};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidPassword, hash, callback) {
	bcrypt.compare(candidPassword, hash, function(err, isMatch) {
		if (err) callback(err);
		callback(null, isMatch)
	})
}

module.exports.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash) {
		if (err) throw err;
		newUser.password = hash;
		newUser.save(callback);
	});
}