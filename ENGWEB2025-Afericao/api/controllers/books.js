var Book = require('../models/book.js')

module.exports.getAllBooks = () => {
    return Book.find().exec()
}

module.exports.getBookById = id => {
    return Book.findById(id).exec()
}

module.exports.getBooksByCharacter = character => {
    return Book.find({ characters: character }).exec()
}

module.exports.getBooksByGenre = genre => {
    return Book.find({ genres: genre }).exec()
}

module.exports.getAllGenres = () => {
    return Book.distinct('genres').then(genres => genres.sort())
}

module.exports.getAllCharacters = () => {
    return Book.distinct('characters').then(chars => chars.sort())
}

module.exports.insert = book => {
    var newBook = new Book(book)
    return newBook.save()
}

module.exports.update = (id, book) => {
    return Book.findByIdAndUpdate(id, book, { new: true }).exec()
}

module.exports.delete = id => {
    return Book.findByIdAndDelete(id, { new: true }).exec()
} 
