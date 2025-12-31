# API'S

## API CRIAR usuario

* Pelo Terminal

```bash
curl -X POST "http://localhost:8000/api/v1/users/new" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome",
    "email": "email@teste.com",
    "password": "Senha@123"
  }'
```

## API DELETAR usuario

* Pelo Terminal

```bash
curl -X DELETE "http://localhost:8000/api/v1/users/{user_id}"
```

## API LISTAR usuarios

* Pelo Terminal

```bash
curl -X GET "http://localhost:8000/api/v1/users"
```

## API usuario LISTAR POR ID 

* Pelo Terminal

```bash
curl -X GET "http://localhost:8000/api/v1/users/{user_id}"
```