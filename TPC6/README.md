# TPC6 - Gestão de Contratos

**Data:** 2025-03-23

## Autor

> **Nome:** Tomás Pinto Rodrigues
> **ID:** A104448
> **Foto:**
>![Foto Perfil](https://github.com/user-attachments/assets/575cd72e-b849-4e66-a39b-5c8552c4e80e)

## Resumo
Este TPC corresponde à resolução integral da ficha proposta no ficheiro `semana7_api_mdb_alunos.pdf`.

- A resolução do **1.2 Queries** encontra-se no ficheiro `queries.md`.
- A resolução do ponto **1.3 API de dados** encontra-se na pasta `apiContratos`.
- A resolução da interface encontra-se na pasta `appContratos`
Os testes ao seu funcionamento foram realizados através do Postman.

## Para executar
### Servidor API de dador
Abrir um terminal dentro da pasta apiContratos
1. **Iniciar o docker:** `docker start mongoEW`
2. **Executar o servidor:** `npm start`

### Servidor Front-end
Abrir um terminal dentro da pasta appContratos
1. **Executar o servidor:** `npm start`
2. **Ver página inicial - Lista de Contratos:** http://localhost:16001/
3. **Ver contrato 10451411:** http://localhost:16001/10451411
4. **Editar contrato 10451411:** http://localhost:16001/edit/10451411
5. **Registar Novo Contrato:** http://localhost:16001/registo 
6. **Eliminar Contrato 10451411:** http://localhost:16001/delete/10451411
7. **Ver todas as entidades:** http://localhost:16001/entidades
8. **Ver entidade 500980896:** http://localhost:16001/entidades/500980896