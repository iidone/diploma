from typing_extensions import List
from fastapi import APIRouter, HTTPException, status, Depends, Response, Path, Form, File, UploadFile, BackgroundTasks, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, delete, and_, func
from src.models.users import UsersModel
from src.database.deps import SessionDep
from typing import Optional
import logging
import os
import uuid
from datetime import date, datetime
from src.schemas.users import CreateUser, UserResponse, LoginResponse
from src.services.AuthService import (
    add_to_blacklist,
    pwd_context,
    oauth2_scheme,
    create_access_token,
    authenticate_user,
    token_blacklist,
    verify_password,
    check_email_exists,
    get_password_hash,
    get_current_user
)

templates = Jinja2Templates(directory="src/templates")
router = APIRouter(prefix="/v1/users")


@router.get("/users", response_model=List[UserResponse], tags=['Пользователи'], summary=['Получить всех пользователей'])
async def get_all_users(session: SessionDep):
    try:
        result = await session.execute(select(UsersModel))
        users = result.scalars().all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error of get all users: {str(e)}')
    

@router.post("/users", response_model=UserResponse, tags=['Пользователи'], summary=['Регистрация'])
async def register_user(session: SessionDep, user_data: CreateUser):
    try:
        existing_user = await check_email_exists(user_data.email, session)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Пользователь с таким email уже существует"
            )
        hashed_password = get_password_hash(user_data.password)

        user = UsersModel(
            email=user_data.email,
            password=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            patronymic=user_data.patronymic,
            role="common",
            date_of_reg=date.today()
        )

        session.add(user)
        await session.commit()
        await session.refresh(user)

        return user
    
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f'Register error: {str(e)}'
        )
    

@router.post("/login", tags=["Пользователи"], summary="Авторизация", include_in_schema=False)
async def login_user(
    session: SessionDep,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    try:
        user = await authenticate_user(form_data.username, form_data.password, session)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Неверный email или пароль",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": user.email})

        await session.commit()

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_info": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "patronymic": user.patronymic,
                "role": user.role,
                "date_of_reg": user.date_of_reg.isoformat() if user.date_of_reg else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка авторизации"
        )