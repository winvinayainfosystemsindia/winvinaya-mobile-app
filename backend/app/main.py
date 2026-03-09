from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_redoc_html

from app.api.v1.api import api_router
from app.core.config import settings
from app.middleware.logging import LoggingMiddleware
from app.core.exceptions import LMSException

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    import os
    if not os.path.exists(settings.STORAGE_ROOT):
        os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
    yield
    # Shutdown logic

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=None, # Disable default
)

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js",
    )

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

# Custom Exception Handlers
@app.exception_handler(LMSException)
async def lms_exception_handler(request: Request, exc: LMSException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Static files for local development (NGINX handles this in prod)
if settings.DEBUG:
    import os
    if not os.path.exists(settings.STORAGE_ROOT):
        os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
    app.mount("/storage", StaticFiles(directory=settings.STORAGE_ROOT), name="storage")

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME}"}
