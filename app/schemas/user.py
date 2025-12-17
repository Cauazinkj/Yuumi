from pydantic import BaseModel, EmailStr, field_validator, constr

class UserCreateSchema(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=8, max_length=32)

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("A senha deve ter pelo menos 8 caracteres")
        
        if len(v) > 32:
            raise ValueError("A senha deve ter no máximo 32 caracteres.")
        
        if not any(c.isupper() for c in v):
            raise ValueError("A senha deve conter pelo menos uma letra maiúscula.")
        
        if not any(c.islower() for c in v):
            raise ValueError("A senha deve conter pelo menos uma letra minúscula.")
        
        if not any(c.isdigit() for c in v):
            raise ValueError("A senha deve conter pelo menos um número.")
        
        especiais = "!@#$%^&*()-_=+[]{};:,.<>/?|\\"
        if not any(c in especiais for c in v):
            raise ValueError("A senha deve conter pelo menos um caractere especial.")
        
        return v
        

class UserReadSchema(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = {
        "from_attributes": True
    }