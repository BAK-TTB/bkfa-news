const admin = require('./admin');
const theloai = require('./theloai');
const loaitin = require('./loaitin');
const baiviet = require('./baiviet');
const home = require('./home');
const conf = require('./conf');
const fileman = require('./fileman');
const users = require('./users');

module.exports = (app) => {
	app.use
	app.use('/', home)
	app.use('/thanh-vien', users)
	// app.use('/login', home)
  	app.use('/admin', admin)
  	app.use('/admin/theloai', theloai)
  	app.use('/admin/loaitin', loaitin)
  	app.use('/admin/baiviet', baiviet)
  	app.use('/conf.json', conf);
	app.use('/fileman', fileman);
}