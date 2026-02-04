# Documentação da API Yummi - Usuarios

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

## API para ATUALIZAR um usuario

* Pelo Terminal

```bash
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "nome",
    "email": "email@teste.com",
    "password": "Nova@Senha123"
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