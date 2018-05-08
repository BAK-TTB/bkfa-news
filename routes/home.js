const Router = require('express-promise-router')
const router = new Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  	res.render('pages/layouts/index', { title: 'TTB' });
});

router.get('/file-manager.html', function(req, res, next) {
  res.render('layouts/index', { title: 'Roxy Fileman for Node.js' });
});

module.exports = router