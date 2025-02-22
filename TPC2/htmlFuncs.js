export function genMainPage(data){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Escola Música</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-cyan">
                    <h1>Escola Música</h1>
                </header>

                <div class="w3-container">
                    <ul class="w3-ul">
                        <li>
                            <a href="/alu">Lista de Alunos</a>
                        </li>
                        <li>
                            <a href="/cur">Lista de Cursos</a>
                        </li>
                        <li>
                            <a href="/ins">Lista de Instrumentos</a>
                        </li>
                    </ul>
                </div>
                
                <footer class="w3-container w3-cyan">
                    <h5>Generated in EngWeb2025 ${data}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}

export function genAluPage(lalu,data){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Alunos</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-orange">
                    <h1>Lista de Alunos</h1>
                </header>
                <h6><a href='/' class='w3-button w3-orange'>Voltar</a></h6>
                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                                <th>Id</th>
                                <th>Nome</th>
                                <th>Curso</th>
                                <th>Instrumento</th>
                        </tr>`
                       
                    lalu.forEach(alu => {
                        pagHTML += ` 
                        <tr>
                            <td><a href='/alu/${alu.id}'>${alu.id}</a></td>
                            <td>${alu.nome}</td>
                            <td>${alu.curso}</td>
                            <td>${alu.instrumento}</td>
                        </tr>`
                    });

                    pagHTML += ` </table>
                </div>

                <h6><a href='/' class='w3-button w3-orange'>Voltar</a></h6>
                <footer class="w3-container w3-orange">
                    <h5>Generated in EngWeb2025 ${data}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}

export function genAluno(aluno, date){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>${aluno.id}</title>
            <link rel="stylesheet" type="text/css" href="/w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-orange">
                    <h1>${aluno.nome}</h1>    
                    <h3>${aluno.id}</h3>
                </header>

                <div class="w3-container">
                    <p><b>Data Nascimento:</b> ${aluno['dataNasc']}</p>
                    <p><b>Curso:</b> ${aluno['curso']}</p>
                    <p><b>Ano Curso:</b> ${aluno['anoCurso']}</p>
                    <p><b>Instrumento:</b> ${aluno['instrumento']}</p>
                </div>

                
                <h6><a href='/alu' class='w3-button w3-orange'>Voltar</a></h6>
                <footer class="w3-container w3-orange">
                    <h5>Generated in EngWeb2025 ${date}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}

export function genCurPage(lcur, data){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Cursos</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-yellow">
                    <h1>Lista de Cursos</h1>
                </header>
                <h6><a href='/' class='w3-button w3-yellow'>Voltar</a></h6>
                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                                <th>Id</th>
                                <th>Designação</th>
                                <th>Duração</th>
                                <th>Instrumento</th>
                        </tr>`
                       
                    lcur.forEach(ins => {
                        pagHTML += ` 
                        <tr>
                            <td><a href='/cur/${ins.id}'>${ins.id}</a></td>
                            <td>${ins.designacao}</td>
                            <td>${ins.duracao}</td>
                            <td>${ins.instrumento['#text']}</td>
                        </tr>`
                    });

                    pagHTML += ` </table>
                </div>
                <h6><a href='/' class='w3-button w3-yellow'>Voltar</a></h6>
                <footer class="w3-container w3-yellow">
                    <h5>Generated in EngWeb2025 ${data}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}

export function genCurso(curso, ligacoes,mapAlunos, date){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>${curso.designacao}</title>
            <link rel="stylesheet" type="text/css" href="/w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-yellow">
                    <h1>${curso.designacao}</h1>    
                    <h3>${curso.id}</h3>
                </header>
                <h6><a href='/cur' class='w3-button w3-yellow'>Voltar</a></h6>
                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                        </tr>`

    ligacoes.forEach(aluno => {
        pagHTML += `
            <tr>
                <td>${aluno['id']}</td>
                <td><a href='/alu/${aluno.id}'>${mapAlunos.get(aluno.id)}</a></td>
            </tr>
        `
    })

    pagHTML += `
                    </table>
                </div>
                
                <h6><a href='/cur' class='w3-button w3-yellow'>Voltar</a></h6>
                <footer class="w3-container w3-yellow">
                    <h5>Generated in EngWeb2025 ${date}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}

export function genInsPage(lins, data){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Instrumentos</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-green">
                    <h1>Lista Instrumentos</h1>
                </header>
                <h6><a href='/' class='w3-button w3-green'>Voltar</a></h6>
                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                                <th>Id</th>
                                <th>Nome</th>
                        </tr>`
                       
                    lins.forEach(ins => {
                        pagHTML += ` 
                        <tr>
                            <td><a href='/ins/${ins.id}'>${ins.id}</a></td>
                            <td>${ins['#text']}</td>
                        </tr>`
                    });

                    pagHTML += ` 
                    </table>
                </div>
                <h6><a href='/' class='w3-button w3-green'>Voltar</a></h6>
                <footer class="w3-container w3-green">
                    <h5>Generated in EngWeb2025 ${data}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}

export function genInstrumento(instrumento, ligacoes,mapAlunos, date){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>${instrumento['#text']}</title>
            <link rel="stylesheet" type="text/css" href="/w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-green">
                    <h1>${instrumento['#text']}</h1>    
                    <h3>${instrumento.id}</h3>
                </header>
                <h6><a href='/ins' class='w3-button w3-green'>Voltar</a></h6>
                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                        </tr>`

    ligacoes.forEach(aluno => {
        pagHTML += `
            <tr>
                <td>${aluno['id']}</td>
                <td><a href='/alu/${aluno.id}'>${mapAlunos.get(aluno.id)}</a></td>
            </tr>
        `
    })

    pagHTML += `
                    </table>
                </div>
                
                <h6><a href='/ins' class='w3-button w3-green'>Voltar</a></h6>
                <footer class="w3-container w3-green">
                    <h5>Generated in EngWeb2025 ${date}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML
}