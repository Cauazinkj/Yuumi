# PROJETO YUUMI

## Descricao do projeto:

Um aplicativo de receitas, com intuito de me desenvolver e aprender sobre tecnologia. Quero criar boas praticas e me desenvolver como profissional

*Swagger: http://localhost:8000/docs*
*ReDoc: http://localhost:8000/redoc*

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

**Criar ambiente virtual:**

```
python3 -m venv .venv
source .venv/bin/activate
source /home/caua/Yuumi/backend/.venv/bin/activate
```

---

### Fluxo correto:

**Subir containers:**

```
docker-compose build
docker-compose up -d
```

**Criar migration:**

```
docker-compose exec yuumi_backend alembic revision --autogenerate -m "create tables"
```

**Aplicar migration:**

```
docker-compose exec yuumi_backend alembic upgrade head
```

---

Comandos importantes:

```
docker compose exec yuumi_db bash
docker compose exec yuumi_backend bash
```

Serve para acessar o container do banco de dados e do backend, respectivamente.

### Para verificar dentro do db:

```
docker-compose exec yuumi_db psql -U postgres -d yuumi
\dt

SELECT * FROM users; (ou outra requisicao, por exemplo)
```

