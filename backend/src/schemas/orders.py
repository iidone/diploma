from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional
from datetime import date, datetime


class OrdersResponse(BaseModel):
    id: int
    user_id: int
    service_id: int
    description: Optional[str] = None
    created: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

