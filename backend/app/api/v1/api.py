from fastapi import APIRouter
from app.api.v1.endpoints import users, courses, auth, media, enrollments, progress, certificates, admin, oauth, content, groups

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(oauth.router, prefix="/auth/oauth", tags=["oauth / sso"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(enrollments.router, prefix="/enrollments", tags=["enrollments"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["certificates"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(groups.router, prefix="/groups", tags=["groups"])


@api_router.get("/health", tags=["health"])
async def health_check():
    from app.core.config import settings
    return {"status": "healthy", "environment": settings.ENVIRONMENT}
