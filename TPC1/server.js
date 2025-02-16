const http = require('http');
const axios = require('axios');

http.createServer((req, res) => {
    console.log("METHOD: " + req.method);
    console.log("URL: " + req.url);

    switch (req.method) {
        case "GET":
            if (req.url === "/") {  // sem nada depois da barra abre o menu principal
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write("<h1>Página Inicial</h1>");
                res.write("<ul>")
                res.write("<ul>")
                res.write("<li><a href='/reparacoes'>Lista das Reparações</a></li>")
                res.write("<li><a href='/intervencoes'>Lista das Intervenções</a></li>")
                res.write("<li><a href='/veiculos'>Lista dos Veículos</a></li>")
                res.write("</ul>")
                res.end()
            }
            else if (req.url === "/reparacoes") {  // se aparecer reparações, abre a lista de todas as reparações
                axios.get('http://localhost:3000/reparacoes?_sort=nome')
                    .then(resp => {
                        var reparacoes = resp.data;
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        res.write("<h1>Lista das Reparações</h1>");
                        res.write("<ul>");
                        reparacoes.forEach(element => {
                            res.write("<li>");
                            res.write(`<strong>Nome:</strong> ${element.nome} <br>`);
                            res.write(`<strong>NIF:</strong> <a href='/reparacoes/${element.nif}'>${element.nif}</a> <br>`);
                            res.write(`<strong>Data:</strong> ${element.data} <br>`);
                            res.write(`<strong>Marca:</strong> ${element.viatura.marcas} <br>`)
                            res.write(`<strong>Modelo:</strong> ${element.viatura.modelo} <br>`)
                            res.write(`<strong>Matrícula:</strong> ${element.viatura.matricula} <br>`)
                            res.write(`<strong>Número intervenções:</strong> ${element.nr_intervencoes} <br>`)
                            res.write("<strong>Intervenções:</strong>")
                            res.write("<ul>")
                                element.intervencoes.forEach(intervencao => {
                                    res.write(`<li><a href='/intervencoes/${intervencao}'>${intervencao}</a></li>`)
                                })
                            res.write("</ul>")
                            res.write("<br>")  //Adicionar uma linha vazia entre cada uma das reparações
                            res.write("</li>")
                        })
                        res.write("</ul>");
                        res.write("<h6><a href='/'>Voltar à Página Inicial</a></h6>");
                        res.end();
                    })
                    .catch(err => {
                        res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                        console.log("Erro ao obter reparações: ", err);
                        res.end();
                    });
            } 
            else if (req.url.match(/\/reparacoes\/.+/)) {  // se tiver reparações e algo mais, vai abrir o menu dessa reparação
                var nif = req.url.split("/")[2]; // utilizado para obter o nif da URL
                axios.get(`http://localhost:3000/reparacoes?nif=${nif}`)
                    .then(resp => {
                        var reparacoes = resp.data // é retornado uma lista 
                        var reparacao = reparacoes[0]
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        res.write(`<h1>Detalhes da Reparação (NIF: ${reparacao.nif})</h1>`);
                        res.write(`<strong>Nome:</strong> ${reparacao.nome}<br>`);
                        res.write(`<strong>Data:</strong> ${reparacao.data}<br>`);
                        res.write(`<strong>Marca:</strong> ${reparacao.viatura.marcas}<br>`);
                        res.write(`<strong>Modelo:</strong> ${reparacao.viatura.modelo}<br>`);
                        res.write(`<strong>Matrícula:</strong> ${reparacao.viatura.matricula}<br>`);
                        res.write(`<strong>Número de intervenções:</strong> ${reparacao.nr_intervencoes}<br>`);
                        // Lista das intervenções
                        res.write("<h1>Intervenções: </h1>");
                        res.write("<ul>");
                        reparacao.intervencoes.forEach(intervencao => {
                            res.write(`<li><a href='/intervencoes/${intervencao}'>${intervencao}</a></li>`);
                        });
                        res.write("</ul>");
                        res.write("<h6><a href='/reparacoes'>Voltar</a></h6>");
                        res.end();
                    })
                    .catch(err => {
                        res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                        console.log(err);
                        res.end();
                    });
            }
            else if (req.url === "/intervencoes") {  // se tiver intervenções, vai abrir a lista das intervenções
                axios.get('http://localhost:3000/intervencoes?_sort=codigo')
                .then(resp => {
                    var intervencoes = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<h1>Lista das Intervenções</h1>")
                    res.write("<ul>");
                    intervencoes.forEach(element => {
                        res.write("<li>")
                        res.write(`<strong>Código:</strong> <a href='/intervencoes/${element.codigo}'>${element.codigo}</a><br>`)
                        res.write(`<strong>Nome:</strong> ${element.nome} <br>`)
                        res.write(`<strong>Descrição:</strong> ${element.descricao} <br>`)
                        res.write("<br>")  //Adicionar uma linha vazia entre cada uma das intervenções
                        res.write("</li>")
                    });
                    res.write("</ul>");
                    res.write("<h6><a href='/'>Voltar à Página Inicial</a></h6>");
                    res.end();
                })
                .catch(err => {
                    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                    console.log("Erro ao obter reparações: ", err);
                    res.end();
                });
            }
            
            else if (req.url.match(/\/intervencoes\/.+/)) { // se tiver intervenções e algo mais, vai abrir o menu dessa intervenção
                var codigo = req.url.split("/")[2]; 
                axios.get(`http://localhost:3000/intervencoes?codigo=${codigo}`)
                    .then(resp => {
                        var intervencoes = resp.data 
                        var intervencao = intervencoes[0]
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        res.write(`<h1>Detalhes da Intervenção: ${intervencao.codigo}</h1>`);
                        res.write(`<strong>Código:</strong> ${intervencao.codigo}<br>`)
                        res.write(`<strong>Nome:</strong> ${intervencao.nome} <br>`)
                        res.write(`<strong>Descrição:</strong> ${intervencao.descricao} <br>`)
                        res.write(`<h6><a href="#" onclick="window.history.back()">Voltar</a></h6>`)
                        res.end()
                    })
                    .catch(err => {
                        res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                        console.log(err);
                        res.end();
                    }); 
            }

            else if (req.url === "/veiculos") { // se tiver veiculos, vai abrir a lista dos veiculos
            axios.get('http://localhost:3000/veiculos?_sort=marcas')
            .then(resp => {
                var veiculos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                res.write("<h1>Lista dos Veículos</h1>");
                res.write("<ul>");
                veiculos.forEach(element => {
                    res.write("<li>")
                    res.write(`<strong>Matrícula:</strong> ${element.matricula}<br>`)
                    res.write(`<strong>Marca:</strong> <a href='/veiculos/${element.marcas}'>${element.marcas}</a><br>`)
                    res.write(`<strong>Modelo:</strong> ${element.modelo} <br>`)
                    res.write("<br>")  //Adicionar uma linha vazia entre cada um dos veiculos
                    res.write("</li>")
                    });
        
                res.write("</ul>");
                res.write("<h6><a href='/'>Voltar à Página Inicial</a></h6>");
                res.end();
            })
            .catch(err => {
                res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                console.log("Erro ao obter veículos: ", err);
                res.end();
            }); 

            } else if (req.url.match(/\/veiculos\/.+/)) { // se tiver veiculos e algo mais, vai abrir o menu dessa marca de veiculos
                var marcas = decodeURIComponent(req.url.split("/")[2]) 
                axios.get(`http://localhost:3000/veiculos?marcas=${encodeURIComponent(marcas)}&_sort=modelo`)
                .then(resp => {
                    var veiculos = resp.data // é retornado uma lista 
                    console.log(veiculos)
                    var modelosMarcaContados = {} //objeto vazio em javascript
                    veiculos.forEach(veiculo => {
                        if (modelosMarcaContados[veiculo.modelo]) {
                            modelosMarcaContados[veiculo.modelo]++
                        } else {
                            modelosMarcaContados[veiculo.modelo] = 1
                        }
                    })
                    console.log(modelosMarcaContados)
                    var soma = veiculos.length
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                    res.write(`<h1>Veículos da marcas: ${marcas} - #${soma}</h1>`);
                    for (const [modelo, num] of Object.entries(modelosMarcaContados)) {
                        res.write(`<strong>Modelo:</strong> ${modelo} - <strong>#</strong> ${num}<br>`);
                    }
                    res.write(`<h6><a href='/veiculos'>Voltar</a></h6>`)
                    res.end()
                    })
                    .catch(err => {
                        res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                        console.log(err);
                        res.end();
                    });
            } else {
                res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'});
                res.end();
            } 

        break;

        default: // default para os erros
            res.writeHead(405, {'Content-Type': 'text/html;charset=utf-8'});
            res.end();
        break;
    }
}).listen(1234);

console.log("Servidor à escuta na porta 1234");