from fastapi import APIRouter, HTTPException, status, Depends, Response, Request, BackgroundTasks
from sqlalchemy import text
from sqlalchemy.orm import Session
from src.database.database import engine, get_session, Base
import json
import logging

logger = logging.getLogger(__name__)




router = APIRouter(prefix="/v1/health")


@router.get('', tags = ["Backend check"], 
            summary= "Check API work",
            status_code= status.HTTP_200_OK)
async def get_health():
    return {"message": "OK"}



@router.get("/db_check", tags = ["Backend check"], 
            summary= "Check database connection",
            status_code= status.HTTP_200_OK)
async def db_check(db: Session = Depends(get_session)):
    try:
        result = db.execute(text("SELECT 1"))
        return {
            "status": "success", 
            "message": "Database connection is working",
            "database": str(engine.url)
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Database connection failed: {str(e)}"
        }
