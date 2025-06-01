var ficheiro = require('../models/ficheiro');
var documento = require('../models/documento')

var fs = require('fs')
var jszip = require('jszip')
var uuidv4 = require('uuid').v4
var xml2js = require('xml2js')
var crypto = require('crypto')
var path = require('path')

const TIPOS_VALIDOS = [ 'foto', 'viagem', 'trabalho', 'formacao', 'evento', 'texto', 'audio', 'video' ];

module.exports.findAll = (userId) => {
  return ficheiro
    .find({ owner: userId })      
    .populate('documentos')
    .exec();
};

module.exports.findById = (id, userId) => {
  return ficheiro
    .findOne({ _id: id, owner: userId })
    .populate('documentos')
    .exec();
};

module.exports.findByIdPublicoOuPrivado = (id, username) => {
  return ficheiro.findOne({
    _id: id,
    $or: [
      { owner: username },
      { visivel: true }
    ]
  }).populate('documentos');
};



module.exports.create = async (dados) => {
  const novo = new ficheiro({
    titulo: dados.titulo,
    descricao: dados.descricao,
    visivel: dados.visivel,
    classificadores: dados.classificadores,
    owner: dados.owner,
    documentos: dados.documentos || [],
    comentarios: [],
    dataCriacao: dados.dataCriacao || new Date()
  });

  return await novo.save();
};



module.exports.delete = (id, username) => {
  console.log('id: ' + id + '  |   username: ' + username)
  ficheiro.find({_id: id, owner: username})
    .then(post => {
      documentos = post.files
      for(const doc of documentos) {
        documento.findOneAndDelete({_id: doc._id})
      }
    })
  return ficheiro.findOneAndDelete({_id : id, owner : username}).exec();
}


module.exports.findPublic = () => {
  return ficheiro
    .find({ visivel: true })
    .exec();
};


module.exports.findPublicById = (id) => {
  return ficheiro
    .findOne({ _id: id, visivel: true })
    .exec();
};


module.exports.setVisibility = (id, username, privacidade) => {
  return ficheiro
    .findOneAndUpdate({ _id: id, owner: username },{ visivel: privacidade },{ new: true })
    .exec();
};


module.exports.addComment = async (id, username, text) => {
  const ficheiroDoc = await ficheiro
    .findOne({ _id: id, owner: username })
    .exec();

  if (!ficheiroDoc) return null;

  ficheiroDoc.comentarios.push({ text: text });
  return ficheiroDoc.save();
};

module.exports.ingest = async (zipPath, username) => {
  try {
    const zipBuffer = fs.readFileSync(zipPath);
    const zip = await jszip.loadAsync(zipBuffer);

    // Procurar manifesto
    const manifestoFile = zip.file('manifesto-SIP.json') || zip.file('manifesto-SIP.xml');
    if (!manifestoFile) {
      return { error: 'Ficheiro manifesto-SIP.(json|xml) não encontrado.' };
    }

    // Ler e validar manifesto
    const postinfo = await lerManifesto(manifestoFile);
    const tipo = postinfo.tipo;

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return {
        error: 'Tipo inválido no manifesto. Deve ser um dos: ' + TIPOS_VALIDOS.join(', ')
      };
    }

    if (postinfo.fileCount === 0) {
      // Criar ficheiro vazio
      await ficheiro.create({
        titulo: postinfo.title,
        descricao: postinfo.description,
        documentos: [],
        owner: username,
        classificadores: [tipo],
        visivel: postinfo.public === false,
        dataCriacao: new Date()
      });

      return null;
    }

    // Verificar estrutura BagIt
    const bagit_manifest = zip.file('manifest-sha256.txt');
    const bagit_info = zip.file('bagit.txt');
    if (!bagit_manifest || !bagit_info) {
      return { error: `BagIt inválido: faltam manifest-sha256.txt ou bagit.txt` };
    }

    const bagit_manifest_text = await bagit_manifest.async('string');
    const manifest_parsed = parseManifest(bagit_manifest_text);

    try {
      if (!manifest_parsed || Object.keys(manifest_parsed).length === 0) {
        return { error: 'Manifesto SHA256 está vazio ou mal formatado.' };
      }      
      await verificarIntegridade(zip, manifest_parsed);
    } catch (e) {
      return { error: e.message };
    }

    // Criar diretório de destino
    const ficheiroUUID = uuidv4();
    const destFolder = path.join('public', 'fileStore', username, ficheiroUUID);
    fs.mkdirSync(destFolder, { recursive: true });

    // Processar documentos
    let documentos;
    try {
      documentos = await processarDocumentos(zip, destFolder, username, itemUUID);
    } catch (e) {
      return { error: e.message };
    }

    const document_ids = documentos.map(doc => doc._id);

    // Criar ficheiro associado
    const ficheiro_obj = new ficheiro({
      titulo: postinfo.titulo,
      descricao: postinfo.descricao,
      documentos: document_ids,
      owner: username,
      classificadores: [tipo],
      visivel: postinfo.public === false,
      dataCriacao: new Date()
    });

    // Guardar documentos e ficheiro
    await Promise.all(documentos.map(doc => doc.save()));
    await ficheiro_obj.save();

    return null;
  } catch (err) {
    console.error('Erro ao processar ZIP:', err);
    return { error: `Erro ao processar ficheiro ZIP: ${err.message}` };
  }
};

async function lerManifesto(ficheiro) {
    const conteudo = await ficheiro.async('string');
    return ficheiro.name.endsWith('.json') 
      ? JSON.parse(conteudo) 
      : await xml2js.parseStringPromise(conteudo);
}

function parseManifest(textoManifesto) {
  const map = textoManifesto
    .split(/\r?\n/)
    .reduce((acc, linha) => {
      const match = linha.match(/^([a-f0-9]{64})\s+(.+)$/i);
      if (match) {
        const [, hash, caminho] = match;
        acc[caminho.trim()] = hash.toLowerCase();
      }
      return acc;
    }, {});

  console.log("🧾 Manifesto SHA256 parseado:", map); // 👈 adiciona isto
  return map;
}


async function verificarIntegridade(zip, manifest) {
  for (const [caminho, hashEsperado] of Object.entries(manifest)) {
    const ficheiro = zip.file(caminho);
    if (!ficheiro) {
      throw new Error(`Ficheiro ${caminho} não existe no ZIP`);
    }

    const dados = await ficheiro.async('nodebuffer');
    const hash = crypto.createHash('sha256').update(dados).digest('hex');

    if (hash !== hashEsperado) {
      throw new Error(`Ficheiro ${caminho} está corrompido ou foi alterado`);
    }
  }
}

async function processarDocumentos(zip, destFolder, username, itemUUID) {
  const documentos = [];

  for (const [relative, file] of Object.entries(zip.files)) {
    if (file.dir || !relative.startsWith('data/') || relative.startsWith('data/meta/')) continue;

    const nome = path.basename(relative);
    const metaPath = `data/meta/${nome}.json`;

    if (!zip.files[metaPath]) {
      throw new Error(`Ficheiro ${relative} não tem metadados associados`);
    }

    const metadataRaw = await zip.files[metaPath].async('string');
    let metadata;
    try {
      metadata = JSON.parse(metadataRaw);
    } catch (e) {
      throw new Error(`Erro a ler metadados de ${nome}: ${e.message}`);
    }

    const dadosFicheiro = await file.async('nodebuffer');
    const destino = path.join('public', destFolder, username, itemUUID, nome);
    fs.writeFileSync(destino, dadosFicheiro);

    // Guarda no Mongo com o caminho RELATIVO a public/
    documentos.push(new documento({
      nome: nome,
      path: path.join('fileStore', username, itemUUID, nome).replace(/\\/g, '/'),
      mimetype: metadata.mimetype,
      modificado: metadata.modificado
    }));

  }

  return documentos;
}

module.exports.findByIdPublicoOuPrivado = async (id, username) => {
  return ficheiro
    .findOne({
      _id: id,
      $or: [
        { visivel: true },
        { owner: username }
      ]
    })
    .populate('documentos')
    .exec();
};

