"""
WinVinaya LMS — FastAPI application entry point.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_redoc_html
from starlette.middleware.sessions import SessionMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.cache import cache
from app.middleware.logging import LoggingMiddleware
from app.middleware.rate_limit import limiter
from app.core.exceptions import LMSException


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    import os
    if not os.path.exists(settings.STORAGE_ROOT):
        os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
    yield
    # Shutdown
    await cache.close()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=None,
)

# ── Rate limiter ──────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Session middleware (required by Authlib OAuth state) ──────────────────────
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="lax",
    https_only=False,   # set True in production behind HTTPS
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)


# ── Custom Exception Handlers ─────────────────────────────────────────────────
@app.exception_handler(LMSException)
async def lms_exception_handler(request: Request, exc: LMSException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js",
    )


# ── Static files ──────────────────────────────────────────────────────────────
if settings.DEBUG:
    import os
    if not os.path.exists(settings.STORAGE_ROOT):
        os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
    app.mount("/storage", StaticFiles(directory=settings.STORAGE_ROOT), name="storage")


# ── API Routers ───────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# ── Root ─────────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME}"}
