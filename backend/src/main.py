from fastapi import FastAPI
from src.api import main_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title = "API",
    version = "1.0.0",
    docs_url="/docs"
)
app.include_router(main_router)


origins = [
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)