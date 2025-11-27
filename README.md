# PROJETO YUUMI

## Descricao do projeto:

Um aplicativo de receitas, com intuito de me desenvolver e aprender sobre tecnologia. Quero criar boas praticas e me desenvolver como profissional

---

### Tecnologias: 

- **FastAPI** — Framework backend em Python  
- **PostgreSQL** — Banco de dados relacional  
- **SQLAlchemy** — ORM para modelagem e consultas  
- **Docker & Docker Compose** — Ambientes isolados e prontos pra rodar  

---

### ⚙️ Como rodar o projeto

Crie uma pasta para o projeto:

```
mkdir projeto
cd projeto
```

Criar ambiente virtual: 

```
python3 -m venv .venv
source .venv/bin/activate
```

---

### Fluxo correto:

Subir containers:

```
docker-compose up -d
```

Criar migration:

```
docker-compose exec yuumi_backend alembic revision --autogenerate -m "create tables"
```

Aplicar migration:

```
docker-compose exec yuumi_backend alembic upgrade head
```