# TPC1 - Oficina de Reparações

**Data:** 2025-02-16

## Autor

> **Nome:** Tomás Pinto Rodrigues
> **ID:** A104448
> **Foto:**
>![Foto Perfil](https://github.com/user-attachments/assets/575cd72e-b849-4e66-a39b-5c8552c4e80e)

## Resumo
Este trabalho consiste em criar um servidor web desenvolvido em Node.js para visualizar dados de uma **oficina de reparações**. Os dados são obtidos de uma API local servida pelo `json-server`.
Neste servidor web é possivel obter a Lista de Reparações e os detalhes de cada uma delas, a Lista das Intervenções e os detalhes de cada uma delas, a Lista dos Veiculos e os detalhes de cada marca e modelo de veiculos. Também é possivel saber quantos veiculos existem de cada marca e modelo.

## Para executar
1. Criar o dataset novo de modo a os dados estarem armazenados corretamente (cria o ficheiro reparacoes.json)
   ```sh
   python3 cria_dataset.py
   ```
2. Instalar as dependências:
   ```sh
   npm install axios
   ```
3. Iniciar o `json-server` para servir os dados:
   ```sh
   json-server --w reparacoes.json
   ```
4. Iniciar o servidor Node.js:
   ```sh
   node server.js
   ```
5. Aceder às páginas no navegador:
   - [http://localhost:1234/](http://localhost:1234/) → Página principal
   - [http://localhost:1234/reparacoes](http://localhost:1234/reparacoes) → Lista de reparações <br>
      Para ver o menu de uma reparação é so clicar no número da reparação
   - [http://localhost:1234/intervencoes](http://localhost:1234/intervencoes) → Lista de intervenções <br>
      Para ver o menu de uma intervenção é so clicar no número da intervenção
   - [http://localhost:1234/veiculos](http://localhost:1234/veiculos) → Lista de marcas e modelos <br>
      Para ver o menu de uma marca é so clicar no nome da marca
