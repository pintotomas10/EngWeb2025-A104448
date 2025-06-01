var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/register', (req, res) => {
  res.render('registo');
});

router.post('/register', (req, res) => {
  const { uname: username, fname: name, password } = req.body;

  axios.post('http://localhost:2004/register', { username, name, password })
    .then(() => {
      console.log('Registo com sucesso!');
      res.redirect('/login');
    })
    .catch(err => {
      console.log('Erro no registo:', err);
      res.render('error', { error: err.response?.data || err });
    });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { uname: username, password } = req.body;

  axios.post('http://localhost:2004/login', { username, password })
    .then(response => {
      console.log('Login com sucesso!');
      res.cookie('jwt', response.data.token, { maxAge: 86400000, httpOnly: true });
      res.redirect('/diary');
    })
    .catch(err => {
      console.log('Erro no login:', err);
      res.render('error', { error: err.response?.data || err });
    });
});

router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});


module.exports = router;
