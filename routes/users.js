const Router = require('express-promise-router')
const router = new Router()
require('../config/passport');
const passport = require('passport');


router.post('/dang-nhap', passport.authenticate('local-dang-nhap', {
        successRedirect : '/thanh-vien',
        failureRedirect : '/',
        failureFlash : true
	}),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
    	res.redirect('/');
	}
);

router.post('/dang-ky', passport.authenticate('local-dang-ky', {
	successRedirect : '/thanh-vien',
	failureRedirect : '/',
	failureFlash : true,
	// session: false
}));

router.get('/', isLoggedIn, function(req, res) {
	let error = req.flash('error');
	res.render('pages/layouts/index', {
		title: 'TTB',
		error: error,
		user : req.user
	});
});

router.get('/dang-xuat', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router

// Is Logged
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

// Is not logged
function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}