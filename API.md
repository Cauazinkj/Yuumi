# API'S

## API criar usuario

* Pelo Terminal

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome",
    "email": "email@teste.com",
    "password": "Senha@123"
  }'
```

