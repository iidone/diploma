from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class BotBlock(BaseModel):
    type: str
    content: str
    category: Optional[str] = "rules"

class BotConfigBase(BaseModel):
    blocks: List[BotBlock]

class BotConfigResponse(BotConfigBase):
    id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

