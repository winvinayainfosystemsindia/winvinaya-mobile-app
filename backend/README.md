# Winvinaya LMS - Backend (FastAPI)

This is the industry-standard backend for the Winvinaya Learning Management System. It is built with FastAPI, PostgreSQL, and SQLAlchemy, following a professional MVC-inspired layered architecture.

## Architecture

- **api/v1/endpoints**: Controllers/Routers handling HTTP requests.
- **services**: Business logic layer.
- **repositories**: Data access layer (CRUD).
- **models**: SQLAlchemy database models.
- **schemas**: Pydantic models for data validation.
- **middleware**: Custom middlewares (e.g., logging).
- **core**: Configuration management (multi-environment).
- **db**: Database connection and session management.
- **utils**: Helper utilities (e.g., media uploads).

## Prerequisites

- **Python 3.10+**
- **PostgreSQL**
- **Docker & Docker Compose** (Optional, for containerized run)

## Setup & Environments

The backend supports three environments: `development` (default), `qa`, and `production`.

### 1. Environment Configuration
Create the appropriate `.env` file for your environment:
- For Development: Copy `.env.dev.example` to `.env.dev`
- For QA: Copy `.env.qa.example` to `.env.qa`
- For Production: Copy `.env.prod.example` to `.env.prod`

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

## Running the Application

### Option 1: Using Uvicorn (Local Development)
Set the `ENVIRONMENT` variable (default is `development`) and run:
```bash
# Windows (PowerShell)
$env:ENVIRONMENT="development"; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Linux/macOS
ENVIRONMENT=development uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Option 2: Using Docker Compose
```bash
docker-compose up --build
```

## Database Migrations (Alembic)

Migrations are automatically detected based on your models in `app/models/`.

### Generate a new migration
```bash
alembic revision --autogenerate -m "description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

## API Documentation

Once the server is running, you can access the interactive API docs at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Media Handling

Uploaded files (videos, documents) are stored in the `uploads/` directory. For production, ensure this directory is backed up. The Nginx configuration in `nginx/` is optimized for large file transfers (up to 5GB).

---
**Winvinaya Foundation** - *Empowering Careers, Enriching Lives.*
