from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional
from datetime import date, datetime


class ChatRequest(BaseModel):
    chat_id: Optional[int] = None
    message: str

    model_config = ConfigDict(from_attributes=True)

class MessageSchema(BaseModel):
    role: str
    content: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class ChatResponse(BaseModel):
    chat_id: int
    role: str = "assistant"
    content: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)