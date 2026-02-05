# Yuumi API – Receitas

Documentação dos endpoints responsáveis pelo gerenciamento de receitas.

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

# Endpoints de Receitas:

## Criar Receita

*Endpoint*

```bash
POST /recipes/
```

*Autenticação*

* Obrigatória

*Request*

```bash
curl -X POST "http://localhost:8000/api/v1/recipes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Omelete Simples",
    "description": "Omelete rápido para o café da manhã",
    "ingredients": [
      { "name": "Ovos", "quantity": "2 unidades" },
      { "name": "Sal", "quantity": "1 pitada" },
      { "name": "Azeite", "quantity": "1 colher de sopa" }
    ],
    "steps": [
      { "step_number": 1, "description": "Bata os ovos com sal" },
      { "step_number": 2, "description": "Aqueça o azeite na frigideira" },
      { "step_number": 3, "description": "Despeje os ovos e cozinhe por 3 minutos" }
    ]
  }'
```

---

## Listar Receitas

---

### Listar todas as receitas

*Endpoint*

```bash
GET /recipes/
```

*Request*

```bash
curl -X GET "http://localhost:8000/api/v1/recipes/" \
  -H "Content-Type: application/json"
```

---

### Listar receitas com paginação

*Parâmetros*

* skip → quantidade de registros ignorados

* limit → quantidade de registros retornados

```bash
# Página 1 (itens 1–10)
curl -X GET "http://localhost:8000/api/v1/recipes/?skip=0&limit=10"

# Página 2 (itens 11–20)
curl -X GET "http://localhost:8000/api/v1/recipes/?skip=10&limit=10"
```

---

### Buscar receita por ID

*Endpoint*

```bash
GET /recipes/{recipe_id}
```

*Request*

```bash
curl -X GET "http://localhost:8000/api/v1/recipes/1" \
  -H "Content-Type: application/json"
```

---

### Buscar receitas por termo

*Observação*

* Em requisições via terminal, evite acentuação no termo de busca.

*Endpoint*

```bash
GET /recipes/?search={termo}
```

*Request*

```bash
curl -X GET "http://localhost:8000/api/v1/recipes/?search=bolo"
```

---

### Filtrar receitas por usuário

*Endpoint*

```bash
GET /recipes/?user_id={user_id}
```

*Request*

```bash
curl -X GET "http://localhost:8000/api/v1/recipes/?user_id=1"
```

---

## Atualizar Receita

*Endpoint*

```bash
PUT /recipes/{recipe_id}
```

*Autenticação*
* Obrigatória

---

### Atualizar apenas o título

```bash
curl -X PUT "http://localhost:8000/api/v1/recipes/{recipe_id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Bolo de Cenoura SUPER Fofinho"
  }'
```

---

### Atualizar título e descrição

```bash
curl -X PUT "http://localhost:8000/api/v1/recipes/{recipe_id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Bolo de Cenoura Perfeito",
    "description": "Receita atualizada com dicas extras para ficar ainda mais fofinho"
  }'
```

---

### Atualizar ingredientes da receita

```bash
curl -X PUT "http://localhost:8000/api/v1/recipes/{recipe_id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ingredients": [
      { "name": "Cenoura", "quantity": "3 unidades médias" },
      { "name": "Ovos", "quantity": "4 unidades" },
      { "name": "Açúcar", "quantity": "2 xícaras" },
      { "name": "Óleo", "quantity": "1 xícara" },
      { "name": "Farinha de trigo", "quantity": "3 xícaras" },
      { "name": "Fermento em pó", "quantity": "1 colher de sopa" },
      { "name": "Canela em pó", "quantity": "1 colher de chá" }
    ]
  }'
```

---

## Deletar Receita

*Endpoint*

```bash
DELETE /recipes/{recipe_id}
```

*Autenticação*
* Obrigatória

*Request*

```bash
curl -X DELETE "http://localhost:8000/api/v1/recipes/{recipe_id}" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nStatus: %{http_code}\n"
```
