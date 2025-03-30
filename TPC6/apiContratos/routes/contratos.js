var express = require('express');
var router = express.Router();
var Contrato = require('../controllers/contrato')

/* GET all contrats. */
router.get('/', function(req, res, next) {
  console.log(req.query)
  if(req.query.entidade && req.query.tipo){
    Contrato.getAllContractsFilterByEntidadeAndTipo(req.query.entidade, req.param.tipo)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  }else if(req.query.entidade){
    //http://localhost:16000/contratos?tipoprocedimento=Consulta%20Prévia
    Contrato.getAllContractsFilterByEntidade(req.query.entidade)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  }  else if (req.query.tipo){
    Contrato.getAllContractsFilterByTipo(req.query.tipo)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  }else {
    Contrato.getAllContracts()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
  }
});

/* GET entidades.*/
router.get('/entidades', function(req, res, next) {
  Contrato.getEntidades()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

//GET /contratos/entidades/:id
router.get('/entidades/:id', function(req, res, next) {
  Contrato.getEntidadesID(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(404).jsonp(error))
});

/* GET contract by ID. */
router.get('/:id', function(req, res, next) {
  Contrato.getContractById(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* GET tipos.*/
router.get('/tipos', function(req, res, next) {
  Contrato.getTipos()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});


/* POST new contract */
router.post('/', function(req, res, next) {
  Contrato.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* PUT change contract */
router.post('/:id', function(req, res, next) {
  Contrato.update(req.params.id, req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* DELETE contract */
router.post('/:id', function(req, res, next) {
  Contrato.delete(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

module.exports = router;
