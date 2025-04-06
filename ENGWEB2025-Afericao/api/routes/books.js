var express = require('express');
var router = express.Router();
var Book = require('../controllers/books')

/* GET all books (optionally filtered by character or genre). */
router.get('/', function(req, res, next) {
  const { character, genre } = req.query;

  if (character) {
    Book.getBooksByCharacter(character)
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(error));
  } else if (genre) {
    Book.getBooksByGenre(genre)
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(error));
  } else {
    Book.getAllBooks()
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(error));
  }
});

/* GET genres. */
router.get('/genres', function(req, res, next) {
  Book.getAllGenres()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* GET characters. */
router.get('/characters', function(req, res, next) {
  Book.getAllCharacters()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* GET book by ID. */
router.get('/:id', function(req, res, next) {
  Book.getBookById(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* POST new book */
router.post('/', function(req, res, next) {
  Book.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

/* PUT change book */
router.put('/:id', function(req, res, next) {
  Book.update(req.params.id, req.body)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
});

/* DELETE book */
router.delete('/:id', function(req, res, next) {
  Book.delete(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
});

module.exports = router;
