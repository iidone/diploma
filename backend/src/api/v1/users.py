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
from datetime import date
from src.schemas.users import UserResponse, TokenResponse, VerifyEmailRequest, ResendVerificationRequest

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