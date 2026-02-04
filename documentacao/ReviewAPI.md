# Documentação da API Yummi - Usuarios

## API para dar Review em uma receita

* Pelo Terminal

### Fazer login para fazer uma receita

```bash
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@teste.com",
    "password": "Senha@123"
  }')
```

*Fazer a Review de uma Receita*

```bash
curl -X POST "http://localhost:8000/api/v1/review/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "recipe_id": {recipe_id},
    "rating": 5,
    "comment": "Comentario."
  }'
```

## Listar todas as reviews de uma receita

```bash
curl "http://localhost:8000/api/v1/review/recipe/{recipe_id}"
```

## Ver minhas reviews

*Precisa ter feito o login, ai o $TOKEN, faz funcionar sem alteracao*

```bash
curl "http://localhost:8000/api/v1/review/user/me" \
  -H "Authorization: Bearer $TOKEN"
```

## Ver minha review específica para uma receita

```bash
curl "http://localhost:8000/api/v1/review/recipe/{recipe_id}/me" \
  -H "Authorization: Bearer $TOKEN"
```

## Ver estatísticas da receita

```bash
curl "http://localhost:8000/api/v1/review/recipe/{recipe_id}/stats"
```

## Obter uma review específica por ID

```bash
curl "http://localhost:8000/api/v1/review/{review_id}"
```

## Atualizar uma review

```bash
curl -X PUT "http://localhost:8000/api/v1/review/{review_id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 4,
    "comment": "Muito bom, mas poderia ter mais detalhes nos passos."
  }'
```

## Deletar uma review

```bash
curl -X DELETE "http://localhost:8000/api/v1/review/{review_id}" \
  -H "Authorization: Bearer $TOKEN"

echo "Review deletada com sucesso!"
```

*Funcionando kkkkkkkk*