var express = require('express');
var router = express.Router();
var path = require('path');
var ficheirosC = require('../controllers/ficheiro');
const documento = require('../models/documento');
var multer = require('multer')
var fs = require('fs')
const jszip = require('jszip');
var Auth = require('../auth/auth');
const logger = require('../aux/logger');

var upload = multer({ dest: 'uploads/' })

const TIPOS_VALIDOS = [ 'foto', 'viagem', 'trabalho', 'formacao', 'evento', 'texto', 'audio', 'video' ];


// GET /public/ficheiros
router.get('/public/ficheiros', async function(req, res) {
  try {
    const ficheiros = await ficheirosC.findPublic();
    res.status(200).jsonp(ficheiros);
  } catch (err) {
    res.status(500).jsonp({ error: 'Erro a obter itens públicos.' });
  }
});


// GET /public/ficheiros/:id
router.get('/public/ficheiros/:id', async function(req, res) {
  try {
    const ficheiro = await ficheirosC.findPublicById(req.params.id);
    if (ficheiro) {
      res.status(200).jsonp(ficheiro);
    } else {
      res.status(404).jsonp({ error: 'Ficheiro não encontrado ou não é público.' });
    }
  } catch (err) {
    res.status(500).jsonp({ error: 'Erro a obter ficheiro.' });
  }
});


// GET ficheiros
router.get('/', Auth.validate, async (req, res) => {
  try {
    console.log('🔍 Ficheiros do user:', req.user.username);
    const ficheiros = await ficheirosC.findAll(req.user.username);
    res.status(200).json(ficheiros);
  } catch (err) {
    console.error('❌ Erro ao obter ficheiros:', err);
    res.status(500).json({ error: 'Erro ao obter ficheiros' });
  }
});


// GET ficheiro by id
router.get('/:id', Auth.validate, async function(req, res) {
  try {
    const ficheiro = await ficheirosC.findByIdPublicoOuPrivado(req.params.id, req.user.username);
    if (ficheiro) {
      res.status(200).jsonp(ficheiro);
    } else {
      res.status(404).jsonp({ error: 'ficheiro não encontrado' });
    }
  } catch (err) {
    res.status(500).jsonp({ error: 'Erro ao obter ficheiro' });
  }
});


// POST ficheiro with file upload
router.post('/uploadZip', Auth.validate, upload.single('file'), (req, res) => {
  ficheirosC.ingest(req.file.path, req.user.username)
    .then(result => {
      if(result) { //function returns null if everything is okay!
        res.status(400).json(result)
      }
      else {
        res.status(201).json({message: "Post created successfully!"})
      }
    })
    .catch(err => {
      res.status(500).json({error: err})
    })
});


// GET ficheiro as ZIP (DIP)
// GET /ficheiros/:id/download — exportar ficheiro como DIP ZIP
router.get('/:id/download', Auth.validate, async (req, res) => {
  try {
    // 1. Obter o ficheiro (AIP)
    const ficheiro = await ficheirosC.findById(req.params.id, req.user._id);
    if (!ficheiro) {
      return res.status(404).json({ error: 'Ficheiro não encontrado ou não pertence ao utilizador.' });
    }

    // 2. Obter documentos associados
    const documentos = await documento.find({ _id: { $in: ficheiro.documentos } });

    // 3. Criar ZIP
    const zip = new jszip();

    // 3.1 Adicionar manifesto-SIP.json (gerado a partir do ficheiro original)
    const manifesto = {
      title: ficheiro.titulo,
      description: ficheiro.descricao,
      tipo: ficheiro.classificadores[0] || 'sem-tipo',
      public: ficheiro.visivel,
      fileCount: documentos.length
    };
    zip.file('manifesto-SIP.json', JSON.stringify(manifesto, null, 2));

    // 3.2 Adicionar ficheiros e metadados em data/ e data/meta/
    for (const doc of documentos) {
      const fileData = fs.readFileSync(path.join(__dirname, '..', doc.path));
      const fileName = path.basename(doc.path);

      // Adicionar ficheiro
      zip.file(`data/${fileName}`, fileData);

      // Adicionar metainformação
      const metadata = {
        mimetype: doc.mimetype,
        lastModified: doc.modificado,
        name: doc.nome
      };
      zip.file(`data/meta/${fileName}.json`, JSON.stringify(metadata, null, 2));
    }

    // 4. Gerar ZIP em memória
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });

    // 5. Enviar resposta
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="DIP-${ficheiro._id}.zip"`
    });

    // Registar ação no log
    logger.logAction(req.user.username, 'download', req.params.id);

    res.send(buffer);

  } catch (err) {
    console.error('Erro ao gerar ZIP do ficheiro:', err);
    res.status(500).json({ error: 'Erro ao gerar ZIP do ficheiro.' });
  }
});

// DELETE ficheiro
router.delete('/:id', Auth.validate, function(req, res, next) {
    console.log('DELETE /ficheiros/' + req.params.id);
    ficheirosC.delete(req.params.id, req.user.username)
        .then(data => {
            if(data) {
                res.status(200).jsonp(data);
            } else {
                res.status(404).jsonp({ error: 'ficheiro não encontrado' });
            }
        })
        .catch(err => res.status(500).jsonp(err));
});

router.patch('/:id/toggleVisibility', Auth.validate, async (req, res) => {
  try {
    const f = await ficheirosC.findById(req.params.id, req.user.username);
    if (!f) return res.status(404).json({ error: 'Ficheiro não encontrado' });

    f.visivel = !f.visivel;
    await f.save();

    res.status(200).json({ message: 'Visibilidade atualizada', visivel: f.visivel });
  } catch (err) {
    console.error('Erro ao alternar visibilidade:', err);
    res.status(500).json({ error: 'Erro ao alterar visibilidade' });
  }
});



// SET visibility 
router.patch('/:id/visibility', Auth.validate, async (req, res) => {
  const visibilidade = req.body.visivel;

  if (typeof visibilidade !== 'boolean') {
    return res.status(400).json({ error: 'Campo visivel inválido (deve ser true ou false).' });
  }

  try {
    const resultados = await ficheirosC.setVisibility(req.params.id, req.user.username, visibilidade);
    if (!resultados) {
      return res.status(404).json({ error: 'ficheiro não encontrado ou não pertence ao utilizador.' });
    }
    res.status(200).json({ message: 'Visibilidade atualizada com sucesso.', ficheiro: resultados });
  } catch (err) {
    console.error('Erro ao atualizar visibilidade:', err);
    res.status(500).json({ error: 'Erro ao atualizar visibilidade.' });
  }
});

router.post('/:id/documentos', Auth.validate, async (req, res) => {
  try {
    const f = await ficheirosC.findById(req.params.id, req.user.username);
    if (!f) return res.status(404).json({ error: 'Ficheiro não encontrado' });

    const novosDocs = await documento.insertMany(req.body);
    const ids = novosDocs.map(doc => doc._id);

    f.documentos.push(...ids);
    await f.save();

    res.status(201).json({ message: 'Documentos associados com sucesso' });
  } catch (err) {
    console.error('Erro ao associar documentos:', err);
    res.status(500).json({ error: 'Erro ao associar documentos' });
  }
});

router.post('/:id/uploadDocs', upload.array('docs'), async (req, res) => {
  const jwt = req.cookies.jwt;
  if (!jwt) return res.redirect('/users/login');

  try {
    const form = new FormData();

    for (const file of req.files) {
      const stream = fs.createReadStream(file.path);
      form.append('docs', stream, file.originalname);
    }

    const response = await axios.post(
      `http://localhost:2004/ficheiros/${req.params.id}/documentos`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${jwt}`
        }
      }
    );

    res.redirect(`/diary/${req.params.id}`);
  } catch (err) {
    console.error('Erro ao associar documentos:', err.response?.data || err.message);
    res.render('error', { error: err.response?.data || err });
  }
});

// POST /:id/comentarios
router.post('/:id/comentarios', Auth.validate, async (req, res) => {
  try {
    const f = await ficheirosC.findByIdPublicoOuPrivado(req.params.id, req.user.username);
    if (!f) return res.status(404).json({ error: 'Ficheiro não encontrado' });

    const comentario = {
      texto: req.body.texto,
      data: new Date()
    };
    
    console.log("🧪 Comentário a inserir:", comentario);
    
    f.comentarios.push(comentario);
    
    console.log("📋 Comentários acumulados:", f.comentarios);
    await f.save();
    res.status(201).json({ message: 'Comentário adicionado com sucesso' });
  } catch (err) {
    console.error('Erro ao adicionar comentário:', err);
    res.status(500).json({ error: 'Erro ao adicionar comentário' });
  }
});



// GET /:id/comentarios
router.get('/:id/comments', Auth.validate, function(req, res, next) {
  console.log('GET /items/' + req.params.id + '/comments');

  ficheirosC.findById(req.params.id, req.user.username)
    .then(item => {
      if (item) {
        res.status(200).jsonp(item.comentarios);
      } else {
        res.status(404).jsonp({ error: 'Item not found' });
      }
      logger.logAction(req.user.username, 'view_comments', req.params.id); 
    })
    .catch(err => {
      console.error('Erro ao obter comentários:', err);
      res.status(500).jsonp({ error: 'Erro ao obter comentários.' });
    });
});

// POST /ficheiros — criar ficheiro sem ZIP (só metadados)
router.post('/', Auth.validate, async function(req, res) {
  try {
    const novoFicheiro = await ficheirosC.create({
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      classificadores: req.body.classificadores,
      visivel: req.body.visivel === true || req.body.visivel === 'true',
      owner: req.user.username,
      documentos: [],
      comentarios: [],
      dataCriacao: new Date()
    });

    res.status(201).jsonp(novoFicheiro);
  } catch (err) {
    console.error('Erro ao criar ficheiro:', err);
    res.status(500).jsonp({ error: 'Erro ao criar entrada.' });
  }
});


module.exports = router;