const admin = require('./admin');
const theloai = require('./theloai');
const loaitin = require('./loaitin');
const home = require('./home');

module.exports = (app) => {
	app.use('/', home)
  	app.use('/admin', admin)
  	app.use('/theloai', theloai)
  	app.use('/loaitin', loaitin)
}
