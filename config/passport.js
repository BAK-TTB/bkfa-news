var validator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var settings = require('../config/settings.js');
var Member = require('../models/member.js');

var provider = null;


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Member.findById(id, function(err, member) {
    var newMember = member.toObject();
    newMember['provider'] = provider;
    done(err, newMember);
  });
});

//passport register
passport.use('local.register', new LocalStrategy({
	usernameField: 'email',//ten cua input dung dang nhap
	passwordField: 'password', //ten cua input mat khau
	passReqToCallback: true
}, function(req, email, password, done){
	// Validator cac input tu trang dang ky
	req.checkBody('firstname', 'Vui lòng nhập họ của quý khách.').notEmpty();
	req.checkBody('lastname', 'Vui lòng nhập tên của quý khách.').notEmpty();
	req.checkBody('email', 'Địa chỉ Email không hợp lệ, vui lòng kiểm tra lại.').notEmpty().isEmail();
	req.checkBody('password', 'Mật khẩu không hợp lệ, phải ít nhất từ ' + settings.passwordLength + ' ký tự trở lên, vui lòng kiểm tra lại.').notEmpty().isLength({
		min: settings.passwordLength
	});
	req.checkBody('password', 'Xác nhận mật khẩu không giống nhau, vui lòng kiểm tra lại.').equals(req.body.confirmpassword);
	req.checkBody('agree', 'Bạn phải chấp thuận với những quy định và chính sách của chúng tôi để tiếp tục.').equals("1");

	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}

	Member.findOne({
		'local.email': email
	}, function(err, member){
		if(err){
			return done(err);
		}
		if(member){
			return done(null, false, {
				message: 'Địa chỉ Email này đã được sử dụng, vui lòng kiểm tra lại!'
			});
		}
		var newMember = new Member();
		newMember.info.firstname = req.body.firstname;
		newMember.info.lastname = req.body.lastname;
		newMember.local.email = req.body.email;
		newMember.local.password = newMember.encryptPassword(req.body.password);
		newMember.newsletter = req.body.newsletter;
		newMember.roles = 'MEMBER';
		//nếu yêu cầu kích hoạt tài khoản qua email thì trạng thái tài khoản là INACTIVE
		// newMember.status = (settings.confirmRegister == 1) ? 'INACTIVE' : 'ACTIVE';
		newMember.status = 'ACTIVE';
	
		newMember.save(function(err, result){
			if(err){
				return done(err);
			} else{
				//nếu yêu cầu kích hoạt tài khoản qua email thì chỉ đăng ký mà không tự động đăng nhập
				if(settings.confirmRegister == 1){
					return done(null, newMember);
				} else{
					//Tự động đăng nhập cho thành viên mới đăng ký khi không yêu cầu kích hoạt tài khoản qua email
					req.logIn(newMember, function(err){
						provider = 'local';
						return done(err, newMember);
					});
				}
			}
		});
	});
}));

//Passport login
passport.use('local.login', new LocalStrategy({
	usernameField: 'email',//ten cua input dung dang nhap
	passwordField: 'password', //ten cua input mat khau
	passReqToCallback: true
}, function(req, email, password, done){
	req.checkBody('email', 'Địa chỉ Email không hợp lệ, vui lòng kiểm tra lại.').notEmpty().isEmail();
    req.checkBody('password', 'Mật khẩu không hợp lệ, vui lòng kiểm tra lại.').notEmpty();

    var errors = req.validationErrors();

    if(errors){
    	var messages = [];
    	errors.forEach(function(error){
    		messages.push(error.msg);
    	});
    	return done(null, false, req.flash('error', messages));
    }

    //check member input
    Member.findOne({
    	'local.email': email
    }, function(err, member){
    	if(err){
    		return done(err);
    	}
    	if(!member){
    		return done(null, false, {
    			message: 'Tài khoản này không tồn tại, vui lòng kiểm tra lại.'
    		});
    	}

    	if(!member.validPassword(password)){
    		return done(null, false,{
    			message: 'Mật khẩu không chính xác, vui lòng nhập lại.'
    		});
    	}

    	if(member.isInActivated(member.status)){
    		return done(null, false,{
    			message: 'Tài khoản của bạn chưa kích hoạt, vui lòng kích hoạt rồi đăng nhập lại.'
    		});
    	}

    	if(member.isSuspended(member.status)){
    		return done(null, false,{
    			message: 'Tài khoản của bạn hiện đang bị khóa, vui lòng kiểm tra lại.'
    		});
    	}

    	provider = "local";
    	return done(null, member);
    });
}));