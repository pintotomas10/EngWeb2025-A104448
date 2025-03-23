# TPC5 - Lista de Alunos

**Data:** 2025-03-23

## Autor

> **Nome:** Tomás Pinto Rodrigues
> **ID:** A104448
> **Foto:**
>![Foto Perfil](https://github.com/user-attachments/assets/575cd72e-b849-4e66-a39b-5c8552c4e80e)

## Resumo
1. Este trabalho envolveu o desenvolvimento de uma aplicação para **gestão de alunos**, composta por dois serviços principais: uma API de dados e um front-end.
2. A **API de dados** foi implementada em Node.js e tem a função de processar pedidos REST, interagindo com uma base de dados **MongoDB** para fornecer as informações necessárias.
3. Para importar dados para a base de dados, utilizou-se um ficheiro JSON contendo os dados dos alunos.
4. O serviço de **front-end** é responsável por apresentar páginas web dinâmicas geradas com templates **PUG**. Através deste serviço, os utilizadores podem visualizar a lista de alunos, adicionar novos registos, modificar informações e remover entradas.
5. Os dois serviços comunicam entre si, sendo que o front-end faz requisições à API sempre que necessita de dados.
6. A aplicação disponibiliza **várias páginas**:
    - Uma **página inicial** com a opção para visualizar a lista de alunos.
    - A **página dedicada aos alunos** apresenta uma tabela com os respetivos dados, onde os nomes são links para as páginas individuais de cada aluno.
    - Esta mesma página inclui dois botões principais: **"Editar"**, para modificar as informações de um aluno, e **"Eliminar"**, para remover o registo. Além disso, há um botão "+" para adicionar um novo aluno.
    - A **página de edição** disponibiliza um formulário para atualizar os dados de um aluno.
    - A **página de registo** permite a inserção de novos alunos.
    - Existe ainda uma página específica para a **eliminar** o aluno.

### MongoDB  
1. Foi utilizado o container no Docker para o MongoDB criado na aula, com o nome **mongoEW**.  
2. Para que o ficheiro JSON do dataset fosse corretamente reconhecido pelo MongoDB, foram feitas alterações ao ficheiro original, deixando apenas a lista de alunos. O ficheiro JSON modificado encontra-se em ![alunos.json](apiAlunos/alunos.json).  
3. Este ficheiro foi importado para o Docker, onde foi criada a base de dados **EW2025**, que inclui a coleção **alunos** contendo os dados do dataset.  
4. Os seguintes comandos foram utilizados para estas operações, fora do container:  
    - `docker cp alunos.json mongoEW:/tmp` (para copiar o dataset para o container)  
    - `docker start mongoEW` (para iniciar o container)  
    - `docker exec -it mongoEW sh` (para aceder ao terminal do container)  
5. Dentro do container, o comando utilizado para importar os dados foi:  
    - `mongoimport -d EW2025 -c alunos alunos.json --jsonArray` (para importar os dados para a coleção **alunos**)  

### API de dados  
1. O servidor da API de dados está localizado em ![apiAlunos](apiAlunos/).  
2. A estrutura do servidor da API de dados é composta por três partes principais:  
    - **controllers**, que contém a lógica das operações realizadas na base de dados e interage com o **model**.  
    - **models**, que define a estrutura dos dados dentro da base de dados.  
    - **routes**, que define as rotas da API e direciona os pedidos recebidos para a função correspondente no **controller**.  

### Front-end  
1. O servidor de front-end utiliza **Express** e está configurado para escutar na porta **9999**.  
2. Neste servidor, são implementados os métodos **GET** e **POST** para interagir com a API de dados.  
3. Existem duas componentes principais neste servidor:  
    - **routes**, onde o ficheiro ![index.js](routes/index.js) contém a rota para a página inicial da aplicação web, e o ficheiro ![alunos.js](routes/alunos.js) define as várias rotas relacionadas com a gestão dos alunos.  
    - **views**, que contém os ficheiros em **PUG**, responsáveis por gerar as páginas HTML da aplicação.  

## Para executar
### Servidor API de dador
Abrir um terminal dentro da pasta apiAlunos
1. **Iniciar o docker:** `docker start mongoEW`
2. **Executar o servidor:** `npm start`

### Servidor Front-end
Abrir um terminal dentro da pasta TPC5
1. **Executar o servidor:** `npm start`
2. **Ver página inicial:** http://localhost:9999/
3. **Ver lista de alunos:** http://localhost:9999/alunos 
4. **Ver o aluno A100701:** http://localhost:9999/alunos/A100701
5. **Editar o aluno A100701:** http://localhost:9999/alunos/edit/A100701
6. **Remover o aluno A100701:** http://localhost:9999/alunos/delete/A100701
7. **Registar um novo aluno:** http://localhost:9999/alunos/registo