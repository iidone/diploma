from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from src.database.deps import SessionDep
from src.models.users import UsersModel
from src.services.AuthService import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=['Админ панель'])

class CreateAdminRequest(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str

@router.post("/create-admin")
async def create_admin_user(
    request: CreateAdminRequest,
    session: SessionDep,
    current_user: UsersModel = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администраторов")
    
    try:
        # Check if exists
        result = await session.execute(select(UsersModel).where(UsersModel.email == request.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Пользователь уже существует")
        
        from src.services.AuthService import get_password_hash
        hashed_password = get_password_hash(request.password)
        
        admin_user = UsersModel(
            email=request.email,
            password=hashed_password,
            first_name=request.first_name,
            last_name=request.last_name,
            role="admin"
        )
        
        session.add(admin_user)
        await session.commit()
        await session.refresh(admin_user)
        
        return {"message": "Администратор создан", "user_id": admin_user.id}
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

