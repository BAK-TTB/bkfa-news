// const Router = require('express-promise-router')
// const router = new Router()
// require('../config/passport');
// const passport = require('passport');

// router.post('/dang-ky', passport.authenticate('local-dang-ky', {
// 	successRedirect : '/trang-chu',
// 	failureRedirect : '/',
// 	failureFlash : true,
// 	// session: false
// }));

// // router.get('/', isLoggedIn, function(req, res) {
// // 	let error = req.flash('error');
// // 	res.render('pages/layouts/index', {
// // 		title: 'TTB',
// // 		error: error,
// // 		user : req.user
// // 	});
// // });

// router.get('/dang-xuat', function(req, res) {
// 	req.logout();
// 	res.redirect('/');
// });

// module.exports = router

// // Is Logged
// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect('/');
// }

// // Is not logged
// function notLoggedIn(req, res, next) {
// 	if (!req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect('/');
// }