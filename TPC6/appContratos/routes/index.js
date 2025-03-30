var express = require('express');
var router = express.Router();
const axios = require('axios');
const { listSearchIndexes } = require('../../apiContratos/models/contrato');

const limite_registos = 50

// /
router.get('/', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)

  axios.get('http://localhost:16000/contratos')
    .then(resp => {
      lista = resp.data
      res.status(200).render("contractList", {lista: lista,tipo: 0,data: d,cor: "indigo",titulo: "Gestor de Contratos"});
    })
    .catch(error => {
      res.status(500).render("error", { error: error, data: d });
    });

});


//GET /registo
router.get('/registo', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)
  res.status(200).render('contractFormPage', { data: d,cor:"teal", titulo:"Adicionar Contrato"});

});

//POST /registo
router.post('/registo', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)
  var result = req.body

  if (result) {

    axios.post('http://localhost:16000/contratos', result)
      .then(resp => {

        axios.get("http://localhost:16000/contratos")
          .then(resp => {
        
            contrato_id = result._id

            lista = resp.data
            lista = lista.slice(0,limite_registos)

            res.status(201).render("contractList", {lista: lista, tipo: 1 ,contrato_id: contrato_id,pagina : 0,ant_pagina : 0,prox_pagina : 1,ultima_pagina:9999999,data: d, cor:"indigo", titulo:"Gestor de Contratos"})
            
          })
          .catch(erro => {
            res.status(500).render("error", {error: error, data: d})
          })

      })
      .catch (error => {
        res.status(500).render("error", {error: error, data: d})
      })

  }
  else {
    res.status(500).render("error", {error: "NO BODY DATA", data: d})
  }

});

//GET /delete/:id
router.get('/delete/:id', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)
  var id = req.params.id

  axios.delete('http://localhost:16000/contratos/' + id)
    .then(() => {

      axios.get("http://localhost:16000/contratos")
        .then(resp => {
      
          contrato_id = id

          lista = resp.data
          lista = lista.slice(0,50)

          res.status(201).render("contractList", {lista: lista, tipo: 3 ,contrato_id: contrato_id,pagina : 0,ant_pagina : 0,prox_pagina : 1,ultima_pagina:9999999,data: d, cor:"indigo", titulo:"Gestor de Contratos"})
          
        })
        .catch(erro => {
          res.status(500).render("error", {error: erro, data: d})
        })
    })
    .catch (error => {
      res.status(500).render("error", {error: error, data: d})
    })

});

//GET /edit/:id
router.get('/edit/:id', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)
  var id = req.params.id

  axios.get('http://localhost:16000/contratos/' + id)
    .then(resp => {

      res.status(200).render("contractFormEditPage", {contrato: resp.data, data: d, cor:"light-blue", titulo:"Editar Contrato"})
          
    })
    .catch (error => {
      res.status(500).render("error", {error: error, data: d})
    })

});

//GET /entidades
router.get('/entidades', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)

  axios.get('http://localhost:16000/contratos/entidades')
    .then(resp => {

      res.status(200).render("entitiesList", {lista: resp.data, data: d, cor:"deep-purple", titulo:"Lista de Entidades"})

    })
    .catch (error => {
      res.status(500).render("error", {error: error, data: d})
    })

});

//GET /entidades/:id
router.get('/entidades/:id', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)
  var id = req.params.id

  axios.get('http://localhost:16000/contratos/entidades/' + id)
    .then(resp => {

      var entity = resp.data[0]

      axios.get('http://localhost:16000/contratos?entidade=' + entity.nome)
        .then(resp2 => {
        
          res.status(200).render("entitiesPage", {entity_id: entity._id, entity_nome: entity.nome,valor: entity.totalMontante,lista: resp2.data, data: d, cor:"deep-purple", titulo:"Ver Empresa"})

        })
        .catch (error => {
          res.status(500).render("error", {error: error, data: d})
        })
          
    })
    .catch (error => {
      res.status(500).render("error", {error: error, data: d})
    })

});

//POST /edit/:id
router.post('/edit/:id', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)
  var result = req.body

  if (result) {

    axios.put('http://localhost:16000/contratos/' + result._id, result)
      .then(resp => {

        axios.get("http://localhost:16000/contratos")
          .then(resp => {
        
            contrato_id = result._id

            lista = resp.data
            lista = lista.slice(0,50)
  
            res.status(201).render("contractList", {lista: lista, tipo: 2 ,contrato_id: contrato_id,pagina : 0,ant_pagina : 0,prox_pagina : 1,ultima_pagina:9999999,data: d, cor:"indigo", titulo:"Gestor de Contratos"})
            
          })
          .catch(erro => {
            res.status(500).render("error", {error: erro, data: d})
          })

      })
      .catch (error => {
        res.status(500).render("error", {error: error, data: d})
      })

  }
  else {
    res.status(500).render("error", {error: "NO BODY DATA", data: d})
  }

});

//GET /:id
router.get('/:id', function(req, res, next) {

  var d = new Date().toISOString().substring(0, 10)
  var id = req.params.id

  axios.get('http://localhost:16000/contratos/' + id)
    .then(resp => {
      var contrato = resp.data
      res.status(200).render("contractPage", {contrato: contrato,data: d, cor:"indigo", titulo:"Contrato " + id})
    })
    .catch (error => {
      res.status(500).render("error", {error: error, data: d})
    })

});


module.exports = router;