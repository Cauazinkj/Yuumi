# 🔐 Fluxo de Autenticação – Teste de Login (Passo a Passo)

Esta seção demonstra o fluxo completo de autenticação da API, desde a criação de um usuário até o acesso a um endpoint protegido utilizando JWT.

---

## ✅ Pré-requisitos

- API rodando localmente em *`http://localhost:8000`*

---

## 1️- Verificar se a API está online

```bash
curl http://localhost:8000/
```

---

## 2- Criar um usuário de teste

```bash
curl -X POST "http://localhost:8000/api/v1/users/new" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuário Teste",
    "email": "email@teste.com",
    "password": "Senha@123"
  }'
```

- Este usuário será utilizado nos próximos passos para autenticação.

---

## 3- Realizar login e obter o token JWT

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@teste.com",
    "password": "Senha@123"
  }'
```

*Resultado esperado:*
- Resposta JSON contendo o campo access_token.

---

## 4- Login com extração automática do token (opcional)

Este passo automatiza o login e extrai o token para uso nos próximos requests.

```bash
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@teste.com",
    "password": "Senha@123"
  }')

echo "Resposta do login:"
echo "$LOGIN_RESPONSE" | python -m json.tool

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo -e "\nToken extraído:"
echo "$TOKEN"
```

- O token será armazenado na variável de ambiente $TOKEN.

---

## 5- Acessar endpoint protegido (/auth/me)

```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

*Resultado esperado:*
- Retorno dos dados do usuário autenticado.