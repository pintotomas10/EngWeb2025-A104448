var express = require('express');
var router = express.Router();
var axios = require('axios');
var multer = require('multer');
var upload = multer({ dest: 'tmp/' });
var fs = require('fs');
const FormData = require('form-data');


// Listar entradas públicas
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:2004/public/ficheiros');
    res.render('diario', { diaryEntries: response.data });
  } catch (err) {
    res.render('error', { error: err });
  }
});

// Mostrar formulário de nova entrada
router.get('/create', (req, res) => {
  if (!req.cookies.jwt) return res.redirect('/users/login');
  res.render('novaEntrada');
});

// Submeter nova entrada (sem ZIP)
router.post('/create', async (req, res) => {
  if (!req.cookies.jwt) return res.redirect('/users/login');

  const post = {
    titulo: req.body.title,
    descricao: req.body.descricao,  // garantir que o name="descricao" no form
    classificadores: [req.body.tipo],
    visivel: req.body.visivel === 'on'
  };

  try {
    await axios.post('http://localhost:2004/ficheiros', post, {
      headers: { Authorization: `Bearer ${req.cookies.jwt}` }
    });
    res.redirect('/diary');
  } catch (err) {
    res.render('error', { error: err });
  }
});

// Ver ficheiros do utilizador autenticado
router.get('/minhas', async (req, res) => {
    console.log('➡️ Entrou na rota /diary/minhas'); // Isto deve aparecer no terminal da APP (porta 2003)
  
    if (!req.cookies.jwt) {
      console.log('❌ Cookie JWT não encontrado');
      return res.redirect('/users/login');
    }
  
    console.log('✅ JWT do cookie:', req.cookies.jwt);
  
    try {
      const response = await axios.get('http://localhost:2004/ficheiros', {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`
        }
      });
  
      res.render('minhasEntradas', { diaryEntries: response.data });
    } catch (err) {
      console.error('❌ ERRO AO OBTER FICHEIROS:', err);
      res.render('error', { error: err });
    }
});

router.get('/uploadZip', (req, res) => {
  if (!req.cookies.jwt) return res.redirect('/users/login');
  res.render('uploadZip');
});

router.get('/:id/uploadDocs', (req, res) => {
  if (!req.cookies.jwt) return res.redirect('/users/login');
  res.render('associarDocs', { id: req.params.id });
});


router.post('/uploadZip', upload.single('file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path)); // Node stream

    const response = await axios.post('http://localhost:2004/ficheiros/uploadZip', formData, {
      headers: {
        ...formData.getHeaders(), // ✅ agora existe
        Authorization: `Bearer ${req.cookies.jwt}`
      }
    });

    res.redirect('/diary/minhas');
  } catch (err) {
    console.error('Erro ao enviar ZIP:', err.response?.data || err.message);
    res.render('error', { error: err.response?.data || err });
  }
});

router.get('/:id/download', async (req, res) => {
  if (!req.cookies.jwt) return res.redirect('/users/login');

  try {
    const response = await axios.get(`http://localhost:2004/ficheiros/${req.params.id}/download`, {
      headers: { Authorization: `Bearer ${req.cookies.jwt}` },
      responseType: 'arraybuffer'  // importante para ZIPs!
    });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="DIP-${req.params.id}.zip"`
    });

    res.send(response.data);
  } catch (err) {
    console.error('Erro ao obter ZIP:', err.response?.data || err.message);
    res.render('error', { error: err.response?.data || err });
  }
});


router.post('/:id/uploadDocs', upload.array('docs'), async (req, res) => {
  const jwt = req.cookies.jwt;
  if (!jwt) return res.redirect('/users/login');

  try {
    const docs = req.files.map(file => ({
      nome: file.originalname,
      path: file.path.replaceAll('\\', '/'),
      mimetype: file.mimetype,
      modificado: new Date(file.lastModifiedDate || Date.now())
    }));

    await axios.post(`http://localhost:2004/ficheiros/${req.params.id}/documentos`, docs, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    res.redirect(`/diary/${req.params.id}`);
  } catch (err) {
    console.error('Erro ao associar documentos:', err.response?.data || err.message);
    res.render('error', { error: err.response?.data || err });
  }
});


router.post('/:id/comentarios', async (req, res) => {
  const jwt = req.cookies.jwt;
  if (!jwt) return res.redirect('/users/login');

  try {
    console.log('📝 req.body:', req.body); // Adiciona isto para ver no terminal
    const { texto } = req.body;
    await axios.post(`http://localhost:2004/ficheiros/${req.params.id}/comentarios`, {
      texto
    }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });

    res.redirect(`/diary/${req.params.id}`);
  } catch (err) {
    console.error('Erro ao adicionar comentário:', err.response?.data || err.message);
    res.render('error', { error: err.response?.data || err });
  }
});

router.post('/:id/toggleVisibility', async (req, res) => {
  const jwt = req.cookies.jwt;
  if (!jwt) return res.redirect('/users/login');

  try {
    // Pedir à API para inverter a visibilidade
    const response = await axios.patch(
      `http://localhost:2004/ficheiros/${req.params.id}/toggleVisibility`,
      {},
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    res.redirect(`/diary/${req.params.id}`);
  } catch (err) {
    console.error('Erro ao mudar visibilidade:', err.response?.data || err.message);
    res.render('error', { error: err.response?.data || err });
  }
});

// Ver entrada específica
router.get('/:id', async (req, res) => {
  const jwt = req.cookies.jwt;

  const endpoint = jwt
    ? `http://localhost:2004/ficheiros/${req.params.id}`
    : `http://localhost:2004/public/ficheiros/${req.params.id}`;

  try {
    const response = await axios.get(endpoint, {
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
    });

    res.render('entradaDiario', {
      item: response.data,
      user: req.user?.username // ou extrai manualmente do JWT, se não estiver presente
    });
    
  } catch (err) {
    console.error('Erro ao obter entrada:', err.response?.data || err);
    res.render('error', { error: err });
  }
});

module.exports = router;
