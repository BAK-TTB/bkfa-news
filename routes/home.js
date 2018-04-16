const Router = require('express-promise-router')
const router = new Router()

module.exports = router

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('layouts/index');
});