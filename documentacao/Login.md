# TESTE COMPLETO PASSO A PASSO:

*PASSO 1: Verifique se a API está respondendo*

```bash
curl http://localhost:8000/
```

---

*PASSO 2: Crie um usuário de teste*

```bash
curl -X POST "http://localhost:8000/api/v1/users/new" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "nome",
    "email": "email@teste.com", 
    "password": "Senha@123"
  }'
```

---

*PASSO 3: Faça login para obter o token*

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@teste.com",
    "password": "Senha@123"
  }'
```

---

*PASSO 4: Extraia o token da resposta*

```bash
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@teste.com",
    "password": "Senha@123"
  }')

# Mostre a resposta completa
echo "Resposta do login:"
echo "$LOGIN_RESPONSE" | python -m json.tool

# Extraia apenas o token (forma simples)
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo -e "\nToken extraído:"
echo "$TOKEN"
```

---

*PASSO 5: Teste o endpoint protegido /me*

```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

*Testei e funcionou kkkkkk*