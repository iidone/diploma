from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database.database import Base
from sqlalchemy import Date, Boolean, String, DECIMAL, DateTime, Integer
from datetime import date, datetime
from typing import List, Optional

class PortfolioModel(Base):
    __tablename__ = "portfolio"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(index=True)
    description: Mapped[str] = mapped_column(index=True)
    photo_url: Mapped[Optional[str]] = mapped_column(String(500))
    price: Mapped[Optional[str]] = mapped_column()

    def __repr__(self) -> str:
        return f"Portfolio(id={self.id}, name='{self.name}')"