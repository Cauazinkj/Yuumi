# ⭐ Yuumi API – Reviews

Documentação dos endpoints responsáveis pelo sistema de avaliações (reviews) das receitas.

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

## Login (Pré-requisito para rotas protegidas)

```bash
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@teste.com",
    "password": "Senha@123"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
```

---

## Criar Review

*Endpoint*

```bash
POST /review/
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl -X POST "http://localhost:8000/api/v1/review/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "recipe_id": 1,
    "rating": 5,
    "comment": "Receita excelente!"
  }'
```

---

## Listar Reviews de uma Receita

*Endpoint*

```bash
GET /review/recipe/{recipe_id}
```

*Request*

```bash
curl "http://localhost:8000/api/v1/review/recipe/1"
```

---

## Listar Minhas Reviews

*Endpoint*

```bash
GET /review/user/me
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl "http://localhost:8000/api/v1/review/user/me" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Ver Minha Review de uma Receita

*Endpoint*

```bash
GET /review/recipe/{recipe_id}/me
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl "http://localhost:8000/api/v1/review/recipe/1/me" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Estatísticas de Reviews da Receita

*Endpoint*

```bash
GET /review/recipe/{recipe_id}/stats
```

*Request*

```bash
curl "http://localhost:8000/api/v1/review/recipe/1/stats"
```

---

## Obter Review por ID

*Endpoint*

```bash
GET /review/{review_id}
```

*Request*

```bash
curl "http://localhost:8000/api/v1/review/1"
```

---

## Atualizar Review

*Endpoint*

```bash
PUT /review/{review_id}
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl -X PUT "http://localhost:8000/api/v1/review/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 4,
    "comment": "Muito bom, mas poderia ter mais detalhes nos passos."
  }'
```

---

## Deletar Review

*Endpoint*

```bash
DELETE /review/{review_id}
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl -X DELETE "http://localhost:8000/api/v1/review/1" \
  -H "Authorization: Bearer $TOKEN"
```
