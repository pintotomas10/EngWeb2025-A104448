// routes/livros.js (nova app - porta 17001)
var express = require('express');
var router = express.Router();
var axios = require('axios');

const API_URL = 'http://localhost:17000/books';

// Página principal
router.get('/', function(req, res) {
  const date = new Date().toISOString().substring(0, 16);

  axios.get(API_URL)
    .then(dados => {
      res.status(200).render('index', {
        livros: dados.data,
        date: date
      });
    })
    .catch(error => res.status(500).render('error', { error: error }))
});

// Página de um autor (tem de vir antes da rota /:id)
router.get('/entidades/:idAutor', function(req, res) {
  const date = new Date().toISOString().substring(0, 16);
  const idAutor = req.originalUrl.split('/').pop(); // Ex: "Harper%20Lee"
  const nomeDecodificado = decodeURIComponent(idAutor); // Ex: "Harper Lee"

  axios.get(API_URL)
    .then(dados => {
      const livrosAutor = dados.data.filter(l => 
        l.author.includes(nomeDecodificado)
      );

      const total = livrosAutor.length;

      res.status(200).render('autor', {
        autorId: decodeURIComponent(idAutor),          // Ex: "Harper%20Lee"
        nome: decodeURIComponent(nomeDecodificado),   // Ex: "Harper Lee"
        livros: livrosAutor,
        total: total,
        date: date
      });
    })
    .catch(error => res.status(500).render('error', { error: error }))
});

// Página de um livro
router.get('/:id', function(req, res) {
  const date = new Date().toISOString().substring(0, 16);

  axios.get(`${API_URL}/${req.params.id}`)
    .then(dados => {
      res.status(200).render('livro', {
        livro: dados.data,
        date: date
      });
    })
    .catch(error => res.status(500).render('error', { error: error }))
});

module.exports = router;
