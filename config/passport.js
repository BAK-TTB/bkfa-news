const validator = require('express-validator');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const pool = require('../model')

pool.connect( (err, client, done) => {

  passport.serializeUser(function(user, done) {
    done(null, user.idthanhvien);
  });

  passport.deserializeUser(function(id, done) {
    client.query("SELECT * FROM thanhvien WHERE idthanhvien = $1 ",[id], (err, res) => {
      done(err, res.rows[0]);
    });
  });

  passport.use(
    'local-dang-ky',
    new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    (req, email, password, done) => {
      req.checkBody('name', 'Vui lòng nhập họ tên của quý khách.').notEmpty();
      req.checkBody('email', 'Địa chỉ Email không hợp lệ, vui lòng kiểm tra lại.').notEmpty().isEmail();
      req.checkBody('password', 'Mật khẩu không hợp lệ, phải ít nhất từ ' + 6 + ' ký tự trở lên, vui lòng kiểm tra lại.').notEmpty().isLength({
        min: 6
      });
      req.checkBody('password', 'Xác nhận mật khẩu không giống nhau, vui lòng kiểm tra lại.').equals(req.body.confirm);

      let errors = req.validationErrors();
      if(errors){
        var messages = [];
        errors.forEach(function(error){
          messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
      }

      console.log("Đăng ký với:",email, password);

      client.query("SELECT * FROM thanhvien WHERE email=$1", [email], (err, res) => {
        if (err) {
          return done(err);
        }
        if (res.rows.length) {
          return done(null, false, req.flash('error', 'Địa chỉ email này đã được sử dụng, vui lòng kiểm tra lại!'));
        } else {
          let newUser = {
            tenthanhvien: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, null, null)
          };
          client.query('INSERT INTO thanhvien(tenthanhvien, email, matkhau) VALUES($1, $2, $3)', [ newUser.tenthanhvien, newUser.email, newUser.password ], (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("Thêm tài khoản mới:", email);

              client.query("SELECT * FROM thanhvien WHERE email=$1", [email], (err, res) => {
                newUser.idthanhvien = res.rows[0].idthanhvien;
                return done(null, newUser);
              });
            }
          });
        }
      });
    })
  );


  passport.use(
    'local-dang-nhap',
    new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    (req, email, password, done) => {
      req.checkBody('email', 'Địa chỉ Email không hợp lệ, vui lòng kiểm tra lại.').notEmpty().isEmail();
      req.checkBody('password', 'Mật khẩu không hợp lệ, vui lòng kiểm tra lại.').notEmpty();
      let errors = req.validationErrors();
      if(errors){
        var messages = [];
        errors.forEach(function(error){
          messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
      }

      client.query("SELECT * FROM thanhvien WHERE email=$1",[email], (err, res) => {
        if (err){
          return done(err);
        }
        if (!res.rows.length) {
          return done(null, false, req.flash('error', 'Tài khoản này không tồn tại, vui lòng kiểm tra lại.'));
        }
        if (!bcrypt.compareSync(password, res.rows[0].matkhau)) {
          return done(null, false, req.flash('error', 'Rất tiếc! Mật khẩu không đúng.'));
        }
        return done(null, res.rows[0]);
      });
    })
  );

}); // end pool.connect
