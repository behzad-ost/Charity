var express = require('express');
var router = express.Router();

// home page
router.get('/', ensureAuth, function(req, res, next) {
	res.render('index', {
		title: 'Members',
		user:req.user
	});
});

function ensureAuth(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;