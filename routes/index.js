const admin = require('./admin');
const theloai = require('./theloai');
const loaitin = require('./loaitin');
const baiviet = require('./baiviet');
const home = require('./home');
var conf = require('./conf');
var fileman = require('./fileman');

module.exports = (app) => {
	app.use('/', home)
  	app.use('/admin', admin)
  	app.use('/admin/theloai', theloai)
  	app.use('/admin/loaitin', loaitin)
  	app.use('/admin/baiviet', baiviet)
  	app.use('/conf.json', conf);
	app.use('/fileman', fileman);
}
