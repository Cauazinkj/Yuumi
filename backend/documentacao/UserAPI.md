# Yuumi API – Usuários

Documentação dos endpoints responsáveis pelo gerenciamento de usuários.

---

## Base URL

*http://localhost:8000/api/v1*

---

## Autenticação

- Rotas protegidas exigem token JWT
- O token deve ser enviado no header:

```http
-H "Authorization: Bearer $TOKEN"
```

---

## Criar Usuário

*Endpoint*

```bash
POST /users/new
```

*Autenticação*
* Não requerida

*Request*
```bash
curl -X POST "http://localhost:8000/api/v1/users/new" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome",
    "email": "email@teste.com",
    "password": "Senha@123"
  }'
```

---

## Atualizar Usuário

*Endpoint*

```bash
PUT /users/{user_id}
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Nome Atualizado",
    "email": "email@teste.com",
    "password": "Nova@Senha123"
  }'
```

---

## Deletar Usuário

*Endpoint*

```bash
DELETE /users/{user_id}
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl -X DELETE "http://localhost:8000/api/v1/users/1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Listar Usuários

*Endpoint*

```bash
GET /users
```

*Request*

```bash
curl -X GET "http://localhost:8000/api/v1/users"
```

---

## Obter Usuário por ID

*Endpoint*

```bash
GET /users/{user_id}
```

*Request*

```bash
curl -X GET "http://localhost:8000/api/v1/users/1"
```
