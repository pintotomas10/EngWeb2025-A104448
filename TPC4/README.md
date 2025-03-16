# TPC3 - Lista de Alunos

**Data:** 2025-03-16

## Autor

> **Nome:** Tomás Pinto Rodrigues
> **ID:** A104448
> **Foto:**
>![Foto Perfil](https://github.com/user-attachments/assets/575cd72e-b849-4e66-a39b-5c8552c4e80e)

## Resumo
Este trabalho consiste em criar um serviço em nodejs para visualizar dados de uma **Lista de Filmes**. Os dados são obtidos de uma API local servida pelo `json-server`.
Neste website é possivel observar as seguintes páginas: <br>
- **Página inicial:** Onde é possivel seguir o link para a página dos filmes;<br>
- **Página principal:** Onde é possivel ver os filmes, juntamente com as suas informações;<br>
- **Página de um filme:** Onde é possivel ver as informações do filme (ano, elenco e genero). A partir desta página é possivel editar as informações do filme a partir de um formulário. <br>

## Para executar
1. Iniciar o `json-server` para servir os dados:
   ```sh
   json-server --w alunos.json
   ```
2. Iniciar o servidor npm:
   ```sh
   npm start
   ```
3. Aceder às páginas no navegador:
   - [http://localhost:2510/](http://localhost:2510/) → Página inicial
   - [http://localhost:2510/filmes](http://localhost:2510/filmes) → Lista de filmes <br>
   - [http://localhost:2510/filmes/Bait](http://localhost:2510/filmes/Bait) → Página de um filme <br>
   - [http://localhost:2510/filmes/Bait/edit](http://localhost:2510/filmes/Bait/edit) → Formulário para editar um filme <br>