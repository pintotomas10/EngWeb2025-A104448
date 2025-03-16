var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET forms editar filme. */
router.get('/filmes/:title/edit', function(req, res) {
  let tituloFilme = decodeURIComponent(req.params.title); // Decodificar o título da URL
  
  axios.get('http://localhost:3000/filmes')
    .then(resp => {
      let filmes = resp.data;
      let filme = filmes.find(f => f.title.trim() === tituloFilme.trim()); // Garantir que não haja espaços extras
      if (filme) {
        res.render('editarFilme', { filme: filme, tit: "Editar Filme" });
      } else {
        res.status(404).render('error', { error: "Filme não encontrado" });
      }
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});

/* GET detalhes de um filme */
router.get('/filmes/:title', function(req, res) {
  axios.get('http://localhost:3000/filmes')
    .then(resp => {
      const filmes = resp.data;  // Lista de filmes
      const titleParam = decodeURIComponent(req.params.title); // Decodifica espaços e caracteres especiais
      const filme = filmes.find(f => f.title === titleParam);

      if (filme) {
        res.render('filme', { filme: filme, tit: "Detalhes do Filme" });
      } else {
        res.status(404).render('error', { error: "Filme não encontrado" });
      }
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});

/* GET lista de filmes */
router.get('/filmes', function(req, res) {
  axios.get('http://localhost:3000/filmes')
    .then(resp => {
      res.render('filmes', { lfilmes: resp.data, tit: "Lista de Filmes" });
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});

/* GET lista de filmes do ator */
router.get('/atores/:nome', function(req, res) {
  let ator = decodeURIComponent(req.params.nome);

  axios.get('http://localhost:3000/filmes')
    .then(resp => {
      let filmes = resp.data.filter(filme => filme.cast.includes(ator));

      res.render('ator', { ator: ator, filmes: filmes });
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});

/* POST editar filme */
router.post('/filmes/:title/edit', function(req, res) {
  var result = req.body;
  let title = req.params.title; // Certifique-se de que o título seja corretamente codificado

  console.log("Enviando PUT para:", `http://localhost:3000/filmes/${title}`);
  console.log("Dados enviados:", result);

  axios.put(`http://localhost:3000/filmes/${title}`, result)
    .then(resp => {
      console.log("Resposta do backend:", resp.data);
      res.status(201).redirect('/filmes');
    })
    .catch(erro => {
      console.log(erro);
      res.status(500).render("error", { 'error': erro });
    });
});


module.exports = router;
