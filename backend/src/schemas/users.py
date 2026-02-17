from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional
from datetime import date, datetime

class CreateUser(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    patronymic: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v


class UserResponse(BaseModel):
    id: int
    email: str
    password: str
    first_name: str
    last_name: str
    patronymic: str
    date_of_reg: date
    role: str

    model_config = ConfigDict(from_attributes=True)

    

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr