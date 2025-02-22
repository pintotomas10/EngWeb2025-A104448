import axios from 'axios';
import { genMainPage, genAluPage, genCurPage, genInsPage, genAluno, genCurso, genInstrumento } from './htmlFuncs.js'
import { readFile } from 'fs'
import http from 'http';

http.createServer(async (req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(req.url == '/'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write(genMainPage(d))
        res.end()  
    }
    else if(req.url == '/alu'){
        axios.get('http://localhost:3000/alunos?sort=id')
            .then(function(resp){
                var alunos = resp.data
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(genAluPage(alunos,d))
                res.end()
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
            })
    }
    else if(req.url.match(/\/alu\/.+/)){
        var id = req.url.split("/")[2]
        var aluno = (await axios.get('http://localhost:3000/alunos?id=' + id)).data[0]
       

        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
        res.write(genAluno(aluno, d))
        res.end()
            
    }
    else if(req.url == '/cur'){
        axios.get('http://localhost:3000/cursos?_sort=id')
            .then(function(resp){
                var cursos = resp.data
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(genCurPage(cursos, d))
                res.end()
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
            })
    }
    else if(req.url.match(/\/cur\/.+/)){
        var id = req.url.split("/")[2]
        var curso = (await axios.get('http://localhost:3000/cursos?id=' + id)).data[0]
        var ligacoes = (await axios.get(`http://localhost:3000/alunos?curso=${id}&_sort=id`)).data
        var alunos = (await axios.get(`http://localhost:3000/alunos`)).data
        var mapAlunos = new Map()
                
        alunos.forEach(alunoaux => {
            mapAlunos.set(alunoaux.id, alunoaux.nome)
        })

        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
        res.write(genCurso(curso,ligacoes,mapAlunos, d))
        res.end()
            
    }
    else if(req.url == '/ins'){
        axios.get('http://localhost:3000/instrumentos')
            .then(function(resp){
                var instrumentos = resp.data
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(genInsPage(instrumentos, d))
                res.end()
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
            })
    }
    else if(req.url.match(/\/ins\/.+/)){
        var id = req.url.split("/")[2]
        var instrumento = (await axios.get('http://localhost:3000/instrumentos?id=' + id)).data[0]
        var ligacoes = (await axios.get(`http://localhost:3000/alunos?instrumento=${instrumento['#text']}&_sort=id`)).data;
        var alunos = (await axios.get(`http://localhost:3000/alunos`)).data
        var mapAlunos = new Map()
                
        alunos.forEach(alunoaux => {
            mapAlunos.set(alunoaux.id, alunoaux.nome)
        })

        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
        res.write(genInstrumento(instrumento,ligacoes,mapAlunos, d))
        res.end()
            
    }
    else if(req.url.match(/w3\.css$/)){
        readFile("w3.css", function(erro, dados){
            if(erro){
                res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na leitura do ficheiro: ' + erro + '</p>')
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/css'})
                res.end(dados)
            }
        })
    }
    else if(req.url.match(/favicon\.ico$/)){
        readFile("clave.png", function(erro, dados){
            if(erro){
                res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na leitura do ficheiro: ' + erro + '</p>')
            }
            else{
                res.writeHead(200, {'Content-Type': 'image/png'})
                res.end(dados)
            }
        })
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        res.end('<p>Operação não suportada: ' + req.url + '</p>')
    }
}).listen(2004)

console.log('Servidor à escuta na porta 2004...')
