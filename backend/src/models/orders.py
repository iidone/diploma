from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database.database import Base
from sqlalchemy import Date, Boolean, String, DECIMAL, DateTime, Integer, ForeignKey
from datetime import date, datetime
from typing import List, Optional

class OrdersModel(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    service_id: Mapped[int] = mapped_column(Integer, ForeignKey("services.id", ondelete="CASCADE"), index=True)
    description: Mapped[str] = mapped_column()
    created: Mapped[date] = mapped_column(Date, default=date.today)

    def __repr__(self) -> str:
        return f"Order(id={self.id}, user_id='{self.user_id}', service_id='{self.service_id}', created='{self.created}')"