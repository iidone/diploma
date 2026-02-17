from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional
from datetime import date, datetime


class UserInfo(BaseModel):
    id: int

class TicketsResponse(BaseModel):
    id: int
    user_id: UserInfo
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

