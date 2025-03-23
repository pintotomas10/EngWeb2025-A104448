var express = require('express');
var router = express.Router();
const axios = require('axios')

// GET alunos
router.get('/', function(req, res) {
  var date = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:3000/alunos')
    .then(resp=> {
      res.status(200).render('studentsListPage', {lalunos: resp.data,  'date': date, title: 'Página dos Alunos'})
    })
    .catch(error => {
      console.log(error)
      res.status(500).render('error', {error: error})
    });
});

router.get('/registo', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16)
  res.status(200).render('studentFormPage', {'date': date, title: 'Registar aluno'})
});

router.post('/registo', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16)
  var result = req.body //objeto que vem
  
  if (result)  {
      axios.post('http://localhost:3000/alunos', result)
           .then(resp => {
            console.log(resp.data)
            res.status(201).redirect('/alunos')
           })
           .catch(erro => {
              res.status(500).render("error", {'error': erro})
           })
  }
});

router.get('/:id', function(req, res) {
  var date = new Date().toISOString().substring(0, 16)
  var id = req.params.id
  axios.get('http://localhost:3000/alunos/' + id)
    .then(resp=> {
      res.status(200).render('studentPage', {aluno: resp.data,  'date': date, title: 'Página do aluno'})
    })
    .catch(error => {
      console.log(error)
      res.status(500).render('error', {error: error})
    });
});


router.get('/edit/:id', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16)
  var id = req.params.id;
  axios.get("http://localhost:3000/alunos")
  .then( resp => {
    var dados = resp.data

    var aluno = dados.find(aluno => aluno._id === id);

    if (aluno) {
      res.render('studentFormEditPage', { aluno: aluno, date: date, title: 'Editar aluno'});
    } else {
      res.status(404).render('error', { error: 'Aluno não encontrado' });
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao obter os alunos' });
  });
});

router.post('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  let alunoAtualizado = { 
    nome: req.body.nome, // dados do form
    gitlink: req.body.gitlink
  };

  for (let i = 1; i <= 8; i++) {
    if (req.body[`tpc${i}`]) {
      alunoAtualizado[`tpc${i}`] = 1;
    } else {
      alunoAtualizado[`tpc${i}`] = 0;
    }
  }
  
  axios.put(`http://localhost:3000/alunos/${id}`, alunoAtualizado)
    .then(() => {
      res.redirect('/alunos');
    })
    .catch(error => {
      console.error(error);
      res.status(500).render('error', { error: 'Erro ao atualizar o aluno.' });
    });
});


router.get('/delete/:id', function(req, res) {
  var date = new Date().toISOString().substring(0, 16);
  var id = req.params.id;

  axios.get('http://localhost:3000/alunos')
    .then(resp => {
      var dados = resp.data;
      var aluno = dados.find(aluno => aluno._id === id);

      if (aluno) {
        res.render('studentDeletePage', {aluno: aluno, date: date, title: 'Eliminar aluno'});
      } else {
        res.render('error', { error: 'Aluno não encontrado' });
      }
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});


router.post('/delete/:id', function(req, res) {
  var id = req.params.id;

  axios.delete(`http://localhost:3000/alunos/${id}`)
    .then(() => {
      res.redirect('/alunos');
    })
    .catch(error => {
      console.error(error);
      res.status(500).render('error', { error: 'Erro ao remover o aluno' });
    });
});


module.exports = router;

