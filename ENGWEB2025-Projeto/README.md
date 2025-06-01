# Relatório de Implementação - Projeto "O Meu Eu Digital"

**Data:** 2025-06-01

## Autor

> **Nome:** Tomás Pinto Rodrigues
> **ID:** A104448
> **Foto:**
>![Foto Perfil](https://github.com/user-attachments/assets/575cd72e-b849-4e66-a39b-5c8552c4e80e)


Este projeto corresponde à implementação de uma aplicação web para gestão de um diário digital, no contexto da unidade curricular de Engenharia Web (2025), segundo as diretrizes definidas pelo modelo OAIS.

API a correr na porta 2004
APP a correr na porta 2003
---

## ✅ Funcionalidades Implementadas

### 📁 Ingestão (SIP → AIP)
- É possível fazer upload de um ficheiro ZIP contendo:
  - Ficheiros de dados em `data/`
  - Metadados em `data/meta/`
  - Manifesto `manifesto-SIP.json`
- O sistema valida:
  - Existência do manifesto
  - Integridade dos ficheiros via `manifest-sha256.txt`
  - Correspondência entre ficheiros e respetivos metadados
- Após validação, os ficheiros são armazenados no `FileStore` e os metadados no MongoDB

### 👤 Autenticação e Sessão
- Sistema de login e registo de utilizadores
- Suporte a múltiplos utilizadores
- Sessão por cookies
- Logout disponível

### 📝 Gestão de Entradas
- Criação de novas entradas no diário manualmente ou por upload de ZIP
- Classificação por tipo (ex: foto, evento, viagem)
- Campo de descrição e visibilidade (público/privado)
- Visualização de entradas privadas do próprio utilizador e públicas dos restantes

### 🔁 Alternância de visibilidade
- Dono da entrada pode tornar um ficheiro público ou privado diretamente da view

### 💬 Comentários
- É possível adicionar comentários às entradas do diário
- Comentários são datados e visíveis junto ao ficheiro

### 📄 Gestão de Documentos
- É possível associar novos documentos a uma entrada após criação
- Documentos têm metadados como tipo MIME, nome, data de modificação

### 💾 Disseminação (DIP)
- Download de entradas como ZIP com:
  - `manifesto-SIP.json`
  - Documentos
  - Metadados

### 👀 Acesso Público
- Utilizadores não autenticados só veem entradas públicas
- Possibilidade de explorar o diário sem iniciar sessão

---

## ❌ Funcionalidades Não Implementadas

### 🗑️ Eliminar entradas
- Não existe botão nem rota para apagar entradas
- É possível apagar entradas diretamente no MongoDB com queries manuais

### ⚙️ Administração
- Não existe painel de administração para gerir utilizadores, recursos ou estatísticas
- Não foi implementado registo de logs estruturados

### 📊 Estatísticas de utilização
- Não há análise nem dashboard sobre downloads ou acessos

### 📢 Integração com redes sociais
- Não foi incluída funcionalidade de partilha no Facebook, Twitter, etc.

---

## 🐞 Limitações Atuais / Bugs Conhecidos

- ❗ O botão "Tornar privado/público" aparece também nas entradas públicas de outros utilizadores, mas **não funciona** (restrição não aplicada corretamente)
- ❗ O botão "Ver documento" apenas funciona corretamente para documentos próprios. Para documentos públicos de outros utilizadores, o acesso falha.
- ❗ A funcionalidade de download só funciona corretamente a partir da **página principal** (`/diary`) — **não funciona em "Minhas Entradas"** devido a erro de autenticação com o token na rota da API.
- ❗ O upload de documentos novos em entradas já criadas funciona, mas **não é validado contra os metadados** como no ZIP (SIP).
- ❗ A view de detalhes de uma entrada pública de outro utilizador não mostra corretamente os documentos (500 ao aceder ao documento diretamente).

---

## 🧪 Testado Com
- MongoDB
- Node.js com Express
- Pug templates
- Axios para comunicação com API
- JSZip e Multer para processamento de ficheiros

---

## 📝 Notas Finais

Apesar de algumas funcionalidades não estarem concluídas, o essencial do fluxo **SIP → AIP → DIP** foi implementado com sucesso. A aplicação permite:
- Criar, visualizar e comentar entradas
- Associar ficheiros
- Gerar pacotes para download
- Garantir visibilidade e autenticação