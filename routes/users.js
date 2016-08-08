var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var getDate = require('../date');
var User = require('../models/user.js');
var Persons = require('../models/person');

//var Payment = Person.payment;
// var bodyParser = require('body-parser');
// router.use(bodyParser.json());

function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/users/login');
}

router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('charityRegister', {
		'title': 'Register',
		user: req.user
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Login',
		user: req.user
	});
});

router.post('/register', function(req, res, next) {

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.check('name', 'نام الزامیست').notEmpty();
	req.check('email', 'ایمیل الزامیست').notEmpty();
	req.checkBody('email', 'ایمیل نامعتبر').isEmail();
	req.checkBody('username', 'نام کاربری الزامیست').notEmpty();
	req.checkBody('password', 'رمز عبور الزامیست').notEmpty();
	req.checkBody('password2', 'رمز مطابقت ندارد').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		// console.log(errors);
		// res.send(errors);
		res.render('charityRegister', {
			title: 'Register',
			user: req.user,
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			username: username,
			password: password,
			password2: password2
		});
		return;
	} else {
		var newUser = User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		//Create User
		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(user);
		});

		//Message
		req.flash('success', 'ثبت کاربر با موفقیت انجام شد.');
		res.location('/');
		res.redirect('/');
	}

});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});


passport.use(new LocalStrategy(function(username, password, done) {
	User.getUserByUsername(username, function(err, user) {
		if (err) throw err;
		if (!user) {
			console.log("Unknown User.");
			return done(null, false, {
				message: 'کابر مورد نظر یافت نشد.'
			});
		}

		User.comparePassword(password, user.password, function(err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				return done(null, user);
			} else {
				console.log("Invalid Password");
				return done(null, false, {
					message: 'رمز عبور نامعتبر'
				});
			}
		})
	});
}));

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/users/login',
	failureFlash: 'نام کاربری یا رمز عبور نامعتبر میباشد.'
}), function(req, res) {
	console.log("Authentication Successful!");
	//req.flash('success', '');
	res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout();
	// req.flash('success', 'You have Logged out');
	res.redirect('/users/login');
});

router.get('/search', ensureAuth, function(req, res, next) {
	if (!req.query.hasOwnProperty('SSnumber')) {
		res.render('search', {
			title: 'Search',
			user: req.user
		});
	} else {
		var SSnumber = req.query.SSnumber;

		// if (typeof SSnumber != 'number') {
		// 	res.render('search', {
		// 		title: 'Search',
		// 		notFoundMsg: "شماره شناسنامه نامعتبر میباشد.",
		// 		user: req.user
		// 	});
		// 	return;
		// }
		Persons.findOne({
			SSnumber: SSnumber
		}, function(err, person) {
			if (err) throw err;
			if (person) {
				console.log(person.name);
				res.render('searchresult', {
					name: person.name,
					ssnumber: person.SSnumber,
					payments: person.payments,
					lastrecieve: person.lastrecieve,
					user: req.user
				})
			} else {
				res.render('search', {
					title: 'Search',
					notFoundMsg: "فرد مورد نظر یافت نشد.",
					user: req.user
				});
			}
		});
	}
});

router.get('/personregister', ensureAuth, function(req, res, next) {
	res.render('personRegister', {
		title: 'Person Register',
		charity: req.user.name
	});
});

router.post('/personregister', ensureAuth, function(req, res, next) {

	var name = req.body.name;
	var ssnumber = req.body.ssnumber;
	var charity = req.body.charity;


	req.check('name', 'نام الزامیست').notEmpty();
	req.check('ssnumber', 'شماره شناسنامه الزامیست').notEmpty();
	// req.check('charity', 'خیریه الزامیست').notEmpty();

	var errors = req.validationErrors();
	// if (typeof req.body.ssnumber != 'number') {
	// 	req.flash('error', 'شماره شناسنامه معتبر نیست.');
	// 	res.render('personRegister', {
	// 		title: 'Person Register',
	// 		charity: req.user.name,
	// 		user: req.user
	// 	});
	// 	return;
	// }

	if (errors) {
		res.render('personRegister', {
			title: 'Person Register',
			errors: errors,
			user: req.user,
			name: req.body.name,
			ssnumber: req.body.ssnumber,
			charity: charity
		});
		return;
	} else {
		var newPerson = Persons({
			name: name,
			SSnumber: ssnumber,
			charity: req.user.name
		});

		//Create User
		Persons.createPerson(newPerson, function(err, person) {
			if (err) throw err;
			console.log(person);
		});

		//Message
		req.flash('success', 'ثبت فرد با موفقیت انجام شد.');
		res.location('/');
		res.redirect('/');
	}

});

router.get('/payment', ensureAuth, function(req, res, next) {
	res.render('payment', {
		title: 'Payment',
		user: req.user
	});
});

router.post('/payment', ensureAuth, function(req, res, next) {

	var SSnumber = req.body.ssnumber;
	var amount = req.body.amount;
	var reason = req.body.reason;

	req.check('ssnumber', 'شماره شناسنامه الزامیست').notEmpty();
	req.check('amount', 'مبلغ الزامیست').notEmpty();
	req.check('reason', 'علت پرداخت را وارد کنید').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('payment', {
			title: 'Payment',
			errors: errors,
			user: req.user,
			ssnumber: req.body.ssnumber,
			amount: req.body.amount,
			reason: req.body.reason
		});
		return;
	} else {

		var payment = {
			amount: amount,
			reason: reason,
			date: getDate()
		}

		Persons.findOne({
			SSnumber: SSnumber
		}, function(err, person) {
			if (err) throw err;
			person.payments.push(payment);
			console.log(person.payments);
			person.lastrecieve = getDate();
			person.save();

		});

		//Message
		req.flash('success', 'پرداخت با موفقیت ثبت شد.');
		res.location('/');
		res.redirect('/');
	}
});


module.exports = router;