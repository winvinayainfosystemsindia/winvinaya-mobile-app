"""
Certificates endpoint — issue, verify, and list certificates.
"""
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_current_user
from app.core.config import settings
from app.core.exceptions import NotFoundError, BadRequestError
from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.repositories.course import course_repository
from app.repositories.user import user_repository
from app.schemas.certificate import CertificateResponse
from app.services.certificate import certificate_service
from app.services.storage import storage_service

router = APIRouter()


@router.post("/course/{course_id}", response_model=CertificateResponse,
             summary="Issue certificate when course is 100% complete")
async def issue_certificate(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Verify course exists
    course = await course_repository.get(db, course_id)
    if not course:
        raise NotFoundError("Course")

    # Verify enrollment and completion
    result = await db.execute(
        select(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id,
        )
    )
    enrollment = result.scalars().first()
    if not enrollment:
        raise BadRequestError("You are not enrolled in this course.")
    if enrollment.status != EnrollmentStatus.completed:
        raise BadRequestError(f"Course not completed yet. Progress: {enrollment.progress_percent:.1f}%")

    cert = await certificate_service.issue(db, user=current_user, course=course)
    resp = CertificateResponse.model_validate(cert)
    resp.pdf_url = storage_service.get_url(cert.pdf_path)
    return resp


@router.get("/verify/{verification_code}", summary="Public certificate verification")
async def verify_certificate(
    verification_code: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Anyone can verify a certificate via its unique code."""
    result = await db.execute(
        select(Certificate).filter(Certificate.verification_code == verification_code)
    )
    cert = result.scalars().first()
    if not cert:
        raise NotFoundError("Certificate")

    user = await user_repository.get(db, cert.user_id)
    course = await course_repository.get(db, cert.course_id)
    return {
        "valid": True,
        "issued_to": user.full_name if user else "Unknown",
        "course": course.title if course else "Unknown",
        "issued_at": cert.issued_at.isoformat(),
        "verification_code": str(cert.verification_code),
    }


@router.get("/my", response_model=List[CertificateResponse], summary="List my certificates")
async def my_certificates(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(Certificate).filter(Certificate.user_id == current_user.id)
    )
    certs = result.scalars().all()
    responses = []
    for cert in certs:
        r = CertificateResponse.model_validate(cert)
        r.pdf_url = storage_service.get_url(cert.pdf_path)
        responses.append(r)
    return responses
