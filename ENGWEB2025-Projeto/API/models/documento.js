const mongoose = require('mongoose')

var documentoSchema = new mongoose.Schema({
    nome: String,
    path: String,
    mimetype: String,
    modificado: Date,
    upload: {type: Date, default: Date.now}
})

module.exports = mongoose.model('documento', documentoSchema)