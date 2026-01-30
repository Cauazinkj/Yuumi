# Documentação da API Yummi - Receitas

## Base URL

*http://localhost:8000/api/v1*


## Autenticação
Todas as rotas protegidas exigem token JWT no header:
```http
Authorization: Bearer <seu_token_jwt>

Para obter token:

POST /auth/login
```bash
{
  "email": "usuario@email.com",
  "password": "Senha@123"
}
```

# Endpoints de Receitas

## API de criar receita

POST /recipes/

```bash
curl -X POST "http://localhost:8000/api/v1/recipes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Omelete Simples",
    "description": "Omelete rápido para o café da manhã",
    "ingredients": [
      {"name": "Ovos", "quantity": "2 unidades"},
      {"name": "Sal", "quantity": "1 pitada"},
      {"name": "Azeite", "quantity": "1 colher de sopa"}
    ],
    "steps": [
      {"step_number": 1, "description": "Bata os ovos com sal"},
      {"step_number": 2, "description": "Aqueça o azeite na frigideira"},
      {"step_number": 3, "description": "Despeje os ovos e cozinhe por 3 minutos"}
    ]
  }'
```

## API's de LISTAR receitas

### Listar todas as receitas

GET /recipes/

```bash
curl -X GET "http://localhost:8000/api/v1/recipes/" \
  -H "Content-Type: application/json"
```

### Para listar com paginação:

```bash
# Página 1 (itens 1-10)
curl -X GET "http://localhost:8000/api/v1/recipes/?skip=0&limit=10"

# Página 2 (itens 11-20)
curl -X GET "http://localhost:8000/api/v1/recipes/?skip=10&limit=10"
```

### Listar receita por ID

GET /recipes/{recipe_id}

```bash
# Substitua {recipe_id} pelo ID real (ex: 1)
curl -X GET "http://localhost:8000/api/v1/recipes/1" \
  -H "Content-Type: application/json"
```

### Buscar receitas por termo

```bash
# Busca por "bolo"
curl -X GET "http://localhost:8000/api/v1/recipes/?search=bolo"

```

### Filtrar por usuário específico

```bash
# Receitas do usuário com ID 1
curl -X GET "http://localhost:8000/api/v1/recipes/?user_id=1"
```

## API's de ATUALIZAR receitas

### Atualizar apenas o titulo

```bash
curl -X PUT "http://localhost:8000/api/v1/recipes/$RECIPE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Bolo de Cenoura SUPER Fofinho"
  }'
```

### Atualizar título e descrição

```bash
curl -X PUT "http://localhost:8000/api/v1/recipes/$RECIPE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Bolo de Cenoura Perfeito",
    "description": "Receita atualizada com dicas extras para ficar ainda mais fofinho"
  }'
```

### Adicionar novo ingrediente à receita

```bash
curl -X PUT "http://localhost:8000/api/v1/recipes/$RECIPE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ingredients": [
      {"name": "Cenoura", "quantity": "3 unidades médias"},
      {"name": "Ovos", "quantity": "4 unidades"},
      {"name": "Açúcar", "quantity": "2 xícaras"},
      {"name": "Óleo", "quantity": "1 xícara"},
      {"name": "Farinha de trigo", "quantity": "3 xícaras"},
      {"name": "Fermento em pó", "quantity": "1 colher de sopa"},
      {"name": "Canela em pó", "quantity": "1 colher de chá"}  # NOVO INGREDIENTE
    ]
  }'
```

## API de DELETAR Receitas

```bash
curl -X DELETE "http://localhost:8000/api/v1/recipes/{recipe_id}" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nStatus: %{http_code}\n"
```
