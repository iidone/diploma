from typing_extensions import List
from src.models.portfolio import PortfolioModel
from src.schemas.portfolio import CreatePortfolio, PortfolioResponse
from src.models.services import ServicesModel
from src.schemas.services import ServicesResponse, CreateService
from fastapi import APIRouter, HTTPException, status, Depends, Response, Path, Form, File, UploadFile, BackgroundTasks, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, delete, and_, func
from src.database.deps import SessionDep
from typing import Optional

router = APIRouter(prefix="/v1/portfolio_and_services")

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
    

@router.post("/create_portfolio", response_model=PortfolioResponse, tags=['Портфолио и услуги'], summary=['Добавить элемент портфолио'])
async def create_portfolio(session: SessionDep, portfolio_data: CreatePortfolio):
    try:
        portfolio = PortfolioModel(
            name=portfolio_data.name,
            description=portfolio_data.description,
            photo_url=portfolio_data.photo_url,
            price=portfolio_data.price
        )

        session.add(portfolio)
        await session.commit()

        await session.refresh(portfolio)

        return portfolio

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
        