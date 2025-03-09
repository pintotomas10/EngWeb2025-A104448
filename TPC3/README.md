# TPC3 - Lista de Alunos

**Data:** 2025-03-09

## Autor

> **Nome:** Tomás Pinto Rodrigues
> **ID:** A104448
> **Foto:**
>![Foto Perfil](https://github.com/user-attachments/assets/575cd72e-b849-4e66-a39b-5c8552c4e80e)

## Resumo
Este trabalho consiste em criar um serviço em nodejs para visualizar dados de uma **Lista de Alunos**. Os dados são obtidos de uma API local servida pelo `json-server`.
Neste website é possivel observar as seguintes páginas: <br>
- **Página principal:** Onde é possivel ver os alunos;<br>
- **Página de alunos:** Onde é possivel ver uma tabela com a informação dos alunos (ao clicar num aluno é possivel observar toda a informação desse aluno); Também existem 2 botões, um deles para editar os dados do aluno (Edit) e outro para eliminar o aluno (Delete); Contém também tem um botão para adicionar alunos novos (+);<br>

## Para executar
1. Iniciar o `json-server` para servir os dados:
   ```sh
   json-server --w alunos.json
   ```
2. Iniciar o servidor Node.js:
   ```sh
   node alunos-server.js
   ```
3. Aceder às páginas no navegador:
   - [http://localhost:7777/](http://localhost:7777/) → Página principal
   - [http://localhost:7777/alunos](http://localhost:7777/alunos) → Lista de alunos <br>
   - [http://localhost:7777/alunos/A100701](http://localhost:7777/alunos/A100701) → Página de um aluno <br>
   - [http://localhost:7777/alunos/registo](http://localhost:7777/alunos/registo) → Formulário para adicionar novo aluno <br>
   - [http://localhost:7777/alunos/edit/A100701](http://localhost:7777/edit/A100701) → Formulário para editar o registo de um aluno <br>
   - [http://localhost:7777/alunos/delete/A100701](http://localhost:7777/delete/A100701) → Formulário para eliminar o registo de um aluno
