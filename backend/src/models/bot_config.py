from sqlalchemy.orm import Mapped, mapped_column
from src.database.database import Base
from sqlalchemy import DateTime, Text
from datetime import datetime

class BotConfig(Base):
    __tablename__ = "bot_config"

    id: Mapped[int] = mapped_column(primary_key=True)
    blocks: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"BotConfig(id={self.id})"

