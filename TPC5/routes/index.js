var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16)
  res.render('index', {title: 'Página Inicial',
                       'date': date});
});


module.exports = router;
