from fastapi import FastAPI, Request, HTTPException
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from src.api import main_router
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="API",
    version="1.0.0",
    docs_url=None
)

app.include_router(main_router)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://26.87.67.88:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static", html=False), name="static")

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="API",
        version="1.0.0",
        description="API Documentation",
        routes=app.routes,
    )
    
    openapi_schema["components"] = openapi_schema.get("components", {})
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/v1/users/login",
                    "scopes": {}
                }
            },
            "description": "Введите email и пароль для авторизации"
        }
    }
    
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/docs", include_in_schema=False)
async def custom_swagger():
    html_content = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="API Docs",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
        swagger_ui_parameters={
            "persistAuthorization": True,
            "displayRequestDuration": True,
        }
    ).body.decode("utf-8")

    custom_css_link = '<link rel="stylesheet" type="text/css" href="/static/dark_theme.css">'
    html_content = html_content.replace('</head>', custom_css_link + '</head>')
    
    script_to_add = """
    <script>
    window.onload = function() {
        // Убеждаемся, что UI загрузился
        setTimeout(function() {
            // Ищем кнопку Authorize и добавляем обработчик
            const checkButton = setInterval(function() {
                const authorizeBtn = document.querySelector('.btn.authorize');
                if (authorizeBtn) {
                    clearInterval(checkButton);
                    console.log('Authorize button found');
                }
            }, 500);
        }, 1000);
    }
    </script>
    """
    html_content = html_content.replace('</body>', script_to_add + '</body>')

    return HTMLResponse(content=html_content)