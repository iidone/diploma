from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional
from datetime import date, datetime


class CreatePortfolio(BaseModel):
    name: str
    description: Optional[str] = None
    photo_url: Optional[str] = None


class PortfolioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    photo_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

