const mongoose = require('mongoose')
const documentoSchema = require('./documento')

const Ficheirochema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String,
  documentos: [{type: mongoose.Schema.Types.ObjectId,ref: 'documento',}],
  classificadores: [String],
  dataCriacao: { type: Date, default: Date.now },
  owner: String,
  visivel: { type: Boolean, default: false },
  comentarios: [{
    texto: {type: String, required: true},
    data: { type: Date, default: Date.now }
  }],
},{versionKey : false})

module.exports = mongoose.model('Ficheiro', Ficheirochema)