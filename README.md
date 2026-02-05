# 🍽️ Yuumi

Aplicação **fullstack** para gerenciamento de receitas, com autenticação, usuários, receitas e sistema de avaliações.

O projeto está sendo desenvolvido com foco em **boas práticas**, **arquitetura organizada** e **evolução contínua**, abrangendo backend e frontend.

---

## Funcionalidades

### Backend
- Autenticação com JWT
- Cadastro e gerenciamento de usuários
- CRUD completo de receitas
- Ingredientes e passos vinculados às receitas
- Sistema de reviews:
  - Avaliação por nota
  - Comentários
  - Estatísticas por receita
- Paginação e filtros de busca
- Documentação automática com Swagger e ReDoc

### Frontend (em desenvolvimento)
- Interface para consumo da API
- Autenticação de usuários
- Listagem e visualização de receitas
- Criação e avaliação de receitas
- Integração completa com o backend

---

## 📚 Documentação da API (Backend)

- **Swagger:** http://localhost:8000/docs  
- **ReDoc:** http://localhost:8000/redoc  

Documentação detalhada por módulo:

```
documentacao/
├── Login.md
├── RecipeAPI.md
├── ReviewAPI.md
└── UserAPI.md
```

---

## Tecnologias Utilizadas

### Backend
- **Python**
- **FastAPI**
- **PostgreSQL**
- **SQLAlchemy**
- **Alembic**
- **JWT**
- **Docker & Docker Compose**

### Frontend (planejado)
- **HTML + CSS**
- **React.js**
- Consumo de API REST
- Autenticação baseada em JWT

---

## Estrutura do Projeto

```
yuumi/
├── backend/
│ ├── app/
│ ├── alembic/
│ ├── Dockerfile
│ ├── docker-compose.yml
│ └── requirements.txt
│
├── frontend/ # em desenvolvimento
│
└── README.md
```

---

## ⚙️ Como Rodar o Projeto (Backend)

### Pré-requisitos
- Docker
- Docker Compose

---

### Subir os containers

```bash
docker-compose build
docker-compose up -d
```

---

### Criar migrations

```bash
docker-compose exec yuumi_backend alembic revision --autogenerate -m "create tables"
```

---

### Aplicar Migrations

```bash
docker-compose exec yuumi_backend alembic upgrade head
```

---

### Acessar os Containers

```bash
docker-compose exec yuumi_backend bash
docker-compose exec yuumi_db bash
```

---

### Acessar o Banco de Dados

```bash
docker-compose exec yuumi_db psql -U postgres -d yuumi
```

* Comandos úteis:

```sql
\dt
SELECT * FROM users;
SELECT * FROM recipes;
```

---

## Autenticação

A API utiliza JWT para proteger rotas sensíveis.
Após o login, envie o token no header:

```
Authorization: Bearer $TOKEN
```

---

### Objetivo do Projeto

Este projeto tem como objetivo:

* Desenvolver uma aplicação fullstack do zero
* Consolidar conhecimentos em backend com Python e FastAPI
* Evoluir para um frontend moderno consumindo a API
* Aplicar boas práticas de arquitetura e organização
* Servir como projeto de portfólio
