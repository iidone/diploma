from fastapi import FastAPI, Request, HTTPException
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from src.api import main_router

app = FastAPI(
    title = "API",
    version = "1.0.0",
    docs_url=None
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

app.mount("/static", StaticFiles(directory="static", html=False), name="static")

@app.get("/docs", include_in_schema=False)
def custom_swagger():
    html_content = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="API Docs",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    ).body.decode("utf-8")

    custom_css_link = '<link rel="stylesheet" type="text/css" href="/static/dark_theme.css">'
    html_content = html_content.replace('</head>', custom_css_link + '</head>')

    return HTMLResponse(content=html_content)