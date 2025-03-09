// alunos_server.js
// EW2024 : 04/03/2024
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {  // mandam chunks de dados, não mandam os dados todos juntos
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var alunosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                if(req.url == '/'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.genMainPage(d))
                    res.end()  
                }
                // GET /alunos --------------------------------------------------------------------
                if(req.url == '/alunos'){
                    axios.get('http://localhost:3000/alunos')
                            .then(resp => {
                                data=resp.data;
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.studentsListPage(data,d))
                                res.end()
                            })
                            .catch(error => {  
                                console.log(error)
                                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                                res.end(templates.errorPage(error,d))
                            });
                }
                // GET /alunos/:id --------------------------------------------------------------------
                else if(req.url.match(/\/alunos\/(A|PG)\d+$/)){
                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/alunos/" + id)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.studentPage(resp.data,d))
                            res.end()
                        })
                        .catch(erro => {
                            console.log(erro)
                            res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Erro</p>")
                            res.end()
                        })
                }
                // GET /alunos/registo --------------------------------------------------------------------
                else if(req.url == '/alunos/registo'){
                    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.write(templates.studentFormPage(d))
                    res.end()
                }
                // GET /alunos/edit/:id --------------------------------------------------------------------
                else if(req.url.match(/\/alunos\/edit\/(A|PG)\d+$/)){
                    id = req.url.split('/')[3]
                    axios.get("http://localhost:3000/alunos/" + id)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(templates.studentFormEditPage(resp.data,d))
                            res.end()
                        })
                        .catch(erro => {
                            console.log(erro)
                            res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Erro a ir buscar o registo</p>")
                            res.end()
                        })
                }
                // GET /alunos/delete/:id --------------------------------------------------------------------
                else if(req.url.match(/\/alunos\/delete\/(A|PG)\d+$/)){
                    id = req.url.split('/')[3]
                    axios.delete("http://localhost:3000/alunos/" + id)
                        .then(() => {
                            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write(`<p>Registo eliminado.</p>`)
                            res.write(templates.botaoPage())
                            res.end()
                        })
                        .catch(erro => {
                            console.log(erro)
                            res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Erro a eliminar o registo</p>")
                            res.end()
                        })
                }
                // GET ? -> Lancar um erro
                else{
                    res.writeHead(404, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.end()
                }
                break
            case "POST":
                // POST /alunos/registo --------------------------------------------------------------------
                if(req.url == '/alunos/registo'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            console.log(JSON.stringify(result))
                            axios.post("http://localhost:3000/alunos", result)
                                .then(resp => {
                                    res.writeHead(201, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write(`<p>Registo inserido: ${JSON.stringify(resp.data)}</p>`)
                                    res.write(templates.botaoPage())
                                    res.end()
                                })
                                .catch(erro => {
                                    console.log(erro)
                                    res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write("<p>Erro a inserir o registo</p>")
                                    res.end()
                                })
                        }else{
                            console.log("NO BODY DATA")
                            res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possivel obter os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST /alunos/edit/:id --------------------------------------------------------------------
                else if(req.url.match(/\/alunos\/edit\/(A|PG)\d+$/)){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.put("http://localhost:3000/alunos/" + result.id, result)
                                .then(resp => {
                                    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write(`<p>Registo alterado: ${JSON.stringify(resp.data)}</p>`)
                                    res.write(templates.botaoPage())
                                    res.end()
                                })
                                .catch(erro => {
                                    console.log(erro)
                                    res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                                    res.write("<p>Erro a alterar registo</p>")
                                    res.end()
                                })
                        }else{
                            console.log("NO BODY DATA")
                            res.writeHead(500, {'Content-Type' : 'text/html; charset=utf-8'})
                            res.write("<p>Não foi possivel obter os dados do body</p>")
                            res.end()
                        }
                    })
                }
                // POST ? -> Lancar um erro
                else{
                    res.writeHead(404, {'Content-Type' : 'text/html; charset=utf-8'})
                    res.end()
                }
                break
            default: 
                res.writeHead(501, {'Content-Type' : 'text/html; charset=utf-8'})
                res.end()
                break
        }
    }
})

alunosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



