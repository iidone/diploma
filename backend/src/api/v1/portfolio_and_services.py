from typing_extensions import List
from src.models.portfolio import PortfolioModel
from src.schemas.portfolio import CreatePortfolio, PortfolioResponse
from src.models.services import ServicesModel
from src.schemas.services import ServicesResponse, CreateService
from src.services.AuthService import get_current_user
from src.models.users import UsersModel
from fastapi import APIRouter, HTTPException, status, Depends, Response, Path, Form, File, UploadFile, BackgroundTasks, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, delete, and_, func
from src.database.deps import SessionDep
from typing import Optional
import os
import uuid
from datetime import date

router = APIRouter(prefix="/v1/portfolio_and_services")

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024
UPLOAD_DIR = "static/uploads/portfolio"

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_extension(filename: str) -> str:
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

@router.get("/portfolio", response_model=List[PortfolioResponse], tags=['Портфолио и услуги'], summary=['Получить все элементы портфолио'])
async def get_all_portfolio(session: SessionDep):
    try:
        result = await session.execute(select(PortfolioModel))
        users = result.scalars().all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error of get portfolio: {str(e)}')
    

@router.get("/services", response_model=List[ServicesResponse], tags=['Портфолио и услуги'], summary=['Получить все услуги'])
async def get_all_services(session: SessionDep):
    try:
        result = await session.execute(select(ServicesModel))
        users = result.scalars().all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error of get all services: {str(e)}')
    

@router.post("/create_portfolio", response_model=PortfolioResponse, tags=['Портфолио и услуги'], summary=['Добавить элемент портфолио (с загрузкой файла)'])
async def create_portfolio(
    session: SessionDep,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    photo_url: Optional[str] = Form(None),
    photo_file: Optional[UploadFile] = File(None),
    current_user: UsersModel = Depends(get_current_user)
):
    try:
        final_photo_url = photo_url

        if photo_file:
            contents = await photo_file.read()
            if len(contents) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Размер файла превышает {MAX_FILE_SIZE // (1024 * 1024)}MB"
                )
            
            if not allowed_file(photo_file.filename):
                raise HTTPException(
                    status_code=400,
                    detail=f"Недопустимый формат файла. Разрешены: {', '.join(ALLOWED_EXTENSIONS)}"
                )

            file_ext = get_file_extension(photo_file.filename)
            unique_filename = f"{uuid.uuid4()}.{file_ext}"

            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            os.makedirs(UPLOAD_DIR, exist_ok=True)
            
            with open(file_path, "wb") as f:
                f.write(contents)
            
            final_photo_url = f"/static/uploads/portfolio/{unique_filename}"

        portfolio = PortfolioModel(
            name=name,
            description=description,
            photo_url=final_photo_url
        )

        session.add(portfolio)
        await session.commit()

        await session.refresh(portfolio)

        return portfolio

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f'error to create portfolio element: {str(e)}')
    

@router.post("/create_service", response_model=ServicesResponse, tags=['Портфолио и услуги'], summary=['Добавить услугу'])
async def create_service(session: SessionDep, portfolio_data: CreateService):
    try:
        service = ServicesModel(
            name=portfolio_data.name,
            description=portfolio_data.description,
            photo_url=portfolio_data.photo_url,
            price=portfolio_data.price
        )

        session.add(service)
        await session.commit()

        await session.refresh(service)

        return service

    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=f'error to create service: {str(e)}')
        