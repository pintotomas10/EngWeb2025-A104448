# TPC2 - Escola de Música

**Data:** 2025-02-22

## Autor

> **Nome:** Tomás Pinto Rodrigues
> **ID:** A104448
> **Foto:**
>![Foto Perfil](https://github.com/user-attachments/assets/575cd72e-b849-4e66-a39b-5c8552c4e80e)

## Resumo
Este trabalho consiste em criar um serviço em nodejs para visualizar dados de uma **Escola de Música**. Os dados são obtidos de uma API local servida pelo `json-server`.
Neste website é possivel observar as seguintes páginas: <br>
- **Página principal:** Onde é possivel ver os alunos, os Cursos e os Instrumentos;<br>
- **Página de alunos:** Onde é possivel ver uma tabela com a informação dos alunos (ao clicar num aluno é possivel observar toda a informação desse aluno);<br>
- **Página de cursos:** Onde é possivel ver uma tabela com a informação dos cursos (ao clicar num curso é possivel observar todos os alunos que frequentam esse curso);<br>
- **Página de instrumentos:** Onde é possivel ver uma tabela com a informação dos instrumentos (ao clicar num instrumento é possivel observar todos os alunos que tocam esse instrumento).<br>



## Para executar
1. Iniciar o `json-server` para servir os dados:
   ```sh
   json-server --w db.json
   ```
2. Iniciar o servidor Node.js:
   ```sh
   node musica-server.js
   ```
3. Aceder às páginas no navegador:
   - [http://localhost:2004/](http://localhost:2004/) → Página principal
   - [http://localhost:2004/alu](http://localhost:2004/alu) → Lista de alunos <br>
      Para ver o menu de um aluno é so clicar no id do aluno
   - [http://localhost:2004/cur](http://localhost:2004/cur) → Lista de cursos <br>
      Para ver os alunos de um curso é so clicar no id do curso
   - [http://localhost:2004/ins](http://localhost:2004/ins) → Lista de instrumentos <br>
      Para ver os alunos que tocam um instrumento é so clicar no id do instrumento
