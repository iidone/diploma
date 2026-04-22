from typing_extensions import List
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import select
from src.models.users import UsersModel
from src.models.bot_config import BotConfig
from src.database.deps import SessionDep
from src.services.AuthService import get_current_user
from src.schemas.users import UserResponse
from src.schemas.bot_config import BotConfigResponse
from pydantic import BaseModel
from typing import Dict, List
import json

router = APIRouter(prefix="/admin", tags=['Админ панель'])

@router.get("/users", response_model=List[UserResponse])
async def get_all_users_admin(session: SessionDep, current_user: UsersModel = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администраторов")
    
    try:
        result = await session.execute(select(UsersModel))
        users = result.scalars().all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error getting users: {str(e)}')

@router.get("/bot-config", response_model=BotConfigResponse)
async def get_bot_config(session: SessionDep, current_user: UsersModel = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администраторов")
    
    try:
        config = await session.get(BotConfig, 1)
        if not config:
            raise HTTPException(status_code=404, detail="Конфигурация не найдена")
        
        blocks = json.loads(config.blocks) if config.blocks else []
        return {
            "id": config.id,
            "blocks": blocks,
            "updated_at": config.updated_at.isoformat() if config.updated_at else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class BotConfigUpdate(BaseModel):
    blocks: List[Dict[str, str]]

@router.put("/bot-config", response_model=BotConfigResponse)
async def update_bot_config(
    config_data: BotConfigUpdate,
    session: SessionDep,
    current_user: UsersModel = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администраторов")
    
    try:
        config = await session.get(BotConfig, 1)
        if not config:
            config = BotConfig(id=1, blocks=json.dumps(config_data.blocks, ensure_ascii=False))
            session.add(config)
        else:
            config.blocks = json.dumps(config_data.blocks, ensure_ascii=False)
        
        await session.commit()
        await session.refresh(config)
        
        return {
            "id": config.id,
            "blocks": config_data.blocks,
            "updated_at": config.updated_at.isoformat() if config.updated_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/users/{user_id}/promote")
async def promote_to_admin(
    user_id: int,
    session: SessionDep,
    current_user: UsersModel = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администраторов")
    
    try:
        user = await session.get(UsersModel, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        user.role = "admin"
        await session.commit()
        await session.refresh(user)
        return {"message": "Пользователь повышен до администратора", "user": user}
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    session: SessionDep,
    current_user: UsersModel = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администраторов")
    
    try:
        user = await session.get(UsersModel, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        if user.id == current_user.id:
            raise HTTPException(status_code=400, detail="Нельзя удалить самого себя")
        
        await session.delete(user)
        await session.commit()
        return {"message": "Пользователь удален"}
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

