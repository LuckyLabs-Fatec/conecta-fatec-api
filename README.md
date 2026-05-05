# Projeto Integrador: Fatec Conecta API

> Solução de software end-to-end para transformar desafios da comunidade em projetos desenvolvidos por alunos da Fatec.

---

## Visão Geral

Este projeto tem como objetivo desenvolver uma API para o projeto Fatec Conecta, criado para a disciplina de Desenvolvimento Web III, ministrada pela professora Janaina.

A solução apoia o fluxo de cadastro, organização e acompanhamento de propostas, projetos, cursos, feedbacks, notificações e alunos vinculados a projetos.

---

## Problema de Negócio

O projeto busca atender à necessidade de conectar demandas da comunidade com projetos acadêmicos desenvolvidos por alunos.

- Qual é o contexto? Comunidade, alunos e mediadores precisam de um meio para registrar, organizar e acompanhar propostas e projetos.
- Quem é impactado? Comunidade, alunos, mediadores e participantes do projeto Fatec Conecta.
- Qual processo ou necessidade precisa ser atendida? Registro de propostas, gestão de projetos e acompanhamento das interações entre os envolvidos.

---

## Solução Proposta

API backend para gerenciamento das informações do Fatec Conecta.

- Tipo de sistema: API.
- Principais funcionalidades: autenticação, usuários, propostas, cursos, projetos, feedbacks, notificações e alunos em projetos.
- Tecnologias e arquitetura adotadas: Node.js, TypeScript, Express, Prisma e PostgreSQL.
- Diferenciais da solução: organização centralizada das informações, suporte ao acompanhamento de projetos e base para evolução futura da aplicação.

---

## Arquitetura da Solução

Cliente/API Consumer -> API Express -> Camada de Controllers -> Repositórios Prisma -> Banco de Dados PostgreSQL

Documentação da API disponível localmente em:

- `http://localhost:8080/docs`
- `http://localhost:8080/docs.json`

---

## Documentação do Projeto

- Link do Confluence: https://lucasperes019.atlassian.net/wiki/x/pwAR
- Link do Jira: https://lucasperes019.atlassian.net/jira/software/projects/KAN/boards/1?atlOrigin=eyJpIjoiZTc1ZGE2MzFjNzQ1NDE0NGJlNmIzM2ZlOTI3YmJmOTIiLCJwIjoiaiJ9
- Link para o documento de requisitos: https://docs.google.com/document/d/1_367sDNBJmtn5zKlAZjEclivZgnFFTJURF9pW4ps5OY/edit?usp=sharing

---

## Sprints

| Nº Sprint | Objetivo | Data Início | Data Término |
| --- | --- | --- | --- |
| 1 | Configuração do ambiente, definição da arquitetura e implementação das funcionalidades de autenticação e cadastro de usuários. | 01/06/2024 | 14/06/2024 |
| 2 | Implementação das funcionalidades de gerenciamento de propostas, cursos e projetos. | | 15/06/2024 | 28/06/2024 |
| 3 | Implementação das funcionalidades de gerenciamento de feedbacks, notificações e alunos em projetos. | | 29/06/2024 | 12/07/2024 |
| 4 | Testes, ajustes finais e preparação para entrega. | 13/07/2024 | | 26/07/2024 |   

---

## Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Frontend**: React, Next.js (em desenvolvimento)
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL, Prisma
- **Infraestrutura**: Render, Neon
- **Versionamento**: Git
- **Gestão**: Jira, Confluence
- **Documentação**: Swagger

---

## Funcionalidades

- Autenticação e cadastro de usuários.
- Gerenciamento de propostas.
- Gerenciamento de cursos.
- Gerenciamento de projetos.
- Gerenciamento de feedbacks.
- Gerenciamento de notificações.
- Gerenciamento de alunos em projetos.

---

## Resultados Esperados

- Organização das propostas enviadas pela comunidade.
- Apoio ao acompanhamento de projetos desenvolvidos por alunos.
- Centralização das informações do projeto Fatec Conecta.
- Base para evolução futura da aplicação.

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js 22
- pnpm

### Instalação

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

### Execução

Para iniciar o servidor em modo de desenvolvimento, utilize o comando:

```bash
pnpm run dev
```

O servidor estará rodando em:

```text
http://localhost:8080
```

### Build

```bash
pnpm run build
```

### Testes

```bash
pnpm run test
```

### Debug

- Para debugar o servidor no VS Code, copie o arquivo `.vscode/example-launch.json` para `.vscode/launch.json`.
- Em seguida, rode o projeto localmente com `F5`.
