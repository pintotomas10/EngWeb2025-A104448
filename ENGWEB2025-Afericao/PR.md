# PR.md — Ficha de Aferição de Engenharia Web 2025

## 1. Informações Iniciais

Para este trabalho foi utilizada uma base de dados MongoDB.  
O campo `bookId` do dataset foi transformado no campo `_id`, obrigatório no MongoDB como identificador único de cada documento.

Cada livro foi importado para a coleção `livros` na base de dados `livros`.  
Os dados foram preparados e importados com os seguintes passos:
- Conversão de listas representadas como strings para listas JSON válidas
- Agrupamento dos objetos JSON individuais num único array válido, com colchetes [] e vírgulas entre objetos, para permitir a importação com mongoimport
- Substituição do campo `bookId` por `_id`

## 2. Configuração do MongoDB

A base de dados foi configurada no container Docker chamado `mongoEW` que foi criado na aula.

Comandos utilizados:

```bash
docker start mongoEW
docker cp db.json mongoEW:/tmp
docker exec mongoEW mongoimport -d livros -c livros /tmp/db.json --jsonArray
docker exec -it mongoEW sh
mongosh
use livros
show collections
```
A importação utilizou o ficheiro `db.json`.

## 3. Alteração do Dataset
### Corrige.py

Alguns campos do dataset original estavam mal formatados, com listas representadas como strings e valores numéricos também como strings. <br>
Foi usado um script em python para corrigir estes erros:
```bash
python3 corrige.py
```

Esse script:
- Corrigiu campos como `genres`, `characters`, `author`, entre outros, convertendo strings mal formadas em listas JSON válidas
- Removeu os parênteses retos (`[` e `]`) e as vírgulas entre objetos, permitindo processar o ficheiro linha a linha
- Corrigiu os campos `rating`,`bbeScore`,`price`,entre outros de modo a converter os seus valores de string para floats.

### Campo bookID
Para alterar o campo `bookId`para `_id`foi utilizado o VSCode, onde todos os valores `bookID` foram substituidos por `_id`.

## 4. Instruções de Como Executar as Aplicações

O repositório contém duas pastas separadas:

- `api`: API de dados (porta **17000**)
- `app`: Interface web (porta **17001**)

### Execução da API (`api`)
```bash
cd api
npm start
```

A API ficará disponível em:  
➡️ `http://localhost:17000/books`

Esta aplicação fornece uma API REST que permite:

- Listar todos os livros (`GET /books`)
- Obter um livro pelo seu ID (`GET /books/:id`)
- Filtrar livros por personagem (`GET /books?character=Nome`)
- Filtrar livros por género (`GET /books?genre=Género`)
- Listar todos os géneros distintos (`GET /books/genres`)
- Listar todas as personagens distintas (`GET /books/characters`)
- Inserir um novo livro (`POST /books`)
- Atualizar um livro existente (`PUT /books/:id`)
- Remover um livro da base de dados (`DELETE /books/:id`)

### Execução da interface web (`app`)

```bash
cd app
npm start
```

A interface estará acessível em:  
➡️ `http://localhost:17001`

Esta aplicação permite:

- Visualizar a lista de livros, com:
  - ID (com link para a página de detalhes do livro)
  - Título
  - Autores (cada um com link para a página do respetivo autor)
  - Data de publicação
  - Número de páginas

- Página de autor (`/entidades/:idAutor`):
  - Apresenta o **nome original** do autor (ex: `Harper Lee`)
  - Apresenta o **identificador utilizado na URL** (ex: `Harper%20Lee`)
  - Lista todos os livros desse autor
  - Indica o número total de livros

- Página de livro (`/:id`):
  - Mostra todos os campos do livro, exceto os que estejam nulos, vazios ou com listas vazias
  - Exibe a imagem da capa, se estiver disponível
  - Inclui botão para voltar à página principal


### Aceder à aplicação no navegador

Depois de ambas as aplicações estarem em execução, pode aceder às seguintes URLs:

- 📘 API de dados: `http://localhost:17000/books`  
  Permite consultar, inserir, editar e remover livros via endpoints REST.

- 🖥️ Interface web: `http://localhost:17001`  
  Permite navegar pela lista de livros, autores e ver os detalhes de cada obra de forma visual.