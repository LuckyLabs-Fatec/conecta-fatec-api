# 🚀 Projeto Integrador: Fatec Conecta API

> Solução de software end-to-end para transformar desafios da comunidade em projetos desenvolvidos por alunos da Fatec.

## 📌 Visão Geral

Este projeto tem como objetivo desenvolver uma API para o projeto Fatec Conecta, criado para a disciplina de Desenvolvimento Web III, ministrada pela professora Janaina.

A solução apoia o fluxo de cadastro, organização e acompanhamento de propostas, projetos, cursos, feedbacks, notificações e alunos vinculados a projetos.

## 🎯 Problema de Negócio

O projeto busca atender à necessidade de conectar demandas da comunidade com projetos acadêmicos desenvolvidos por alunos.

- Qual é o contexto? Comunidade, alunos e mediadores precisam de um meio para registrar, organizar e acompanhar propostas e projetos.
- Quem é impactado? Comunidade, alunos, mediadores e participantes do projeto Fatec Conecta.
- Qual processo ou necessidade precisa ser atendida? Registro de propostas, gestão de projetos e acompanhamento das interações entre os envolvidos.

## 💡 Solução Proposta

API backend para gerenciamento das informações do Fatec Conecta.

- Tipo de sistema: API.
- Principais funcionalidades: autenticação, usuários, propostas, cursos, projetos, feedbacks, notificações e alunos em projetos.
- Tecnologias e arquitetura adotadas: Node.js, TypeScript, Express, Prisma e PostgreSQL.
- Diferenciais da solução: organização centralizada das informações, suporte ao acompanhamento de projetos e base para evolução futura da aplicação.

## 🏗️ Arquitetura da Solução

Cliente/API Consumer -> API Express -> Camada de Controllers -> Repositórios Prisma -> Banco de Dados PostgreSQL

Documentação da API disponível localmente em:

- `http://localhost:8080/docs`
- `http://localhost:8080/docs.json`

## 📚 Documentação do Projeto

- Link do Confluence: https://lucasperes019.atlassian.net/wiki/x/pwAR
- Link do Jira: https://lucasperes019.atlassian.net/jira/software/projects/KAN/boards/1?atlOrigin=eyJpIjoiZTc1ZGE2MzFjNzQ1NDE0NGJlNmIzM2ZlOTI3YmJmOTIiLCJwIjoiaiJ9
- Link para o documento de requisitos: https://docs.google.com/document/d/1_367sDNBJmtn5zKlAZjEclivZgnFFTJURF9pW4ps5OY/edit?usp=sharing

## 👥 Membros do Grupo

- Lucas Silva Peres
- Gustavo Campos Antunes
- Juan Lucas Silva
- Thiago Martins Domingues
- Gustavo Pires Formigoni

## 🗓️ Sprints

| Nº Sprint | Objetivo | Data Início | Data Término | Status |
| --- | --- | --- | --- | --- |
| 1 | Limpeza de menções ao Supabase. | 07/04/2026 | 21/04/2026 | Concluída |
| 2 | CRUD inicial de cadastro de usuários e ideias/propostas. | 28/04/2026 | 05/05/2026 | Em andamento |
| 3 | Estrutura de permissionamento para as rotas da API e para as telas do front-end. | 11/05/2026 | 18/05/2026 | Não iniciado |
| 4 | Telas do site integradas com as rotas da API. | 20/05/2026 | 17/06/2026 | Não iniciado |


## 🛠️ Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Frontend**: React, Next.js (em desenvolvimento)
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL, Prisma
- **Infraestrutura**: Render, Neon
- **Versionamento**: Git
- **Gestão**: Jira, Confluence
- **Documentação**: Swagger

## ⚙️ Funcionalidades

- Autenticação e cadastro de usuários.
- Gerenciamento de propostas.
- Gerenciamento de cursos.
- Gerenciamento de projetos.
- Gerenciamento de feedbacks.
- Gerenciamento de notificações.
- Gerenciamento de alunos em projetos.

## ✅ Resultados Esperados

- Organização das propostas enviadas pela comunidade.
- Apoio ao acompanhamento de projetos desenvolvidos por alunos.
- Centralização das informações do projeto Fatec Conecta.
- Base para evolução futura da aplicação.

## ▶️ Como Executar o Projeto

### 📋 Pré-requisitos

- Node.js 22
- pnpm

### 📦 Instalação

1. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis necessárias:

```env
PORT=8080
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
CORS_ORIGIN=
```

Ou copie o arquivo `.env-example` e renomeie como `.env`.

2. Instale as dependências:

```bash
pnpm install
```

### ▶️ Execução

Para iniciar o servidor em modo de desenvolvimento, utilize o comando:

```bash
pnpm run dev
```

O servidor estará rodando em:

```text
http://localhost:8080
```

### 🏗️ Build

```bash
pnpm run build
```

### 🧪 Testes

```bash
pnpm run test
```

### 🐞 Debug

- Para debugar o servidor no VS Code, copie o arquivo `.vscode/example-launch.json` para `.vscode/launch.json`.
- Em seguida, rode o projeto localmente com `F5`.
