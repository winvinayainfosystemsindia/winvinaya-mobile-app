"""
CertificateService — PDF generation using ReportLab.
"""
import io
import uuid as uuid_lib
from datetime import datetime

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.models.certificate import Certificate
from app.models.user import User
from app.models.course import Course
from app.services.storage import storage_service
from app.repositories.base import BaseRepository


class CertificateService:

    def _generate_pdf(self, user: User, course: Course, issued_at: datetime, verification_code: str) -> bytes:
        """Generate a professional PDF certificate using ReportLab."""
        buf = io.BytesIO()
        doc = SimpleDocTemplate(
            buf,
            pagesize=landscape(A4),
            rightMargin=60,
            leftMargin=60,
            topMargin=60,
            bottomMargin=60,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "title",
            parent=styles["Normal"],
            fontSize=36,
            fontName="Helvetica-Bold",
            textColor=colors.HexColor("#1a1a2e"),
            alignment=TA_CENTER,
            spaceAfter=10,
        )
        subtitle_style = ParagraphStyle(
            "subtitle",
            parent=styles["Normal"],
            fontSize=14,
            fontName="Helvetica",
            textColor=colors.HexColor("#4a4a6a"),
            alignment=TA_CENTER,
            spaceAfter=6,
        )
        name_style = ParagraphStyle(
            "name",
            parent=styles["Normal"],
            fontSize=28,
            fontName="Helvetica-Bold",
            textColor=colors.HexColor("#16213e"),
            alignment=TA_CENTER,
            spaceAfter=8,
        )
        body_style = ParagraphStyle(
            "body",
            parent=styles["Normal"],
            fontSize=13,
            fontName="Helvetica",
            textColor=colors.HexColor("#444444"),
            alignment=TA_CENTER,
            spaceAfter=6,
        )
        small_style = ParagraphStyle(
            "small",
            parent=styles["Normal"],
            fontSize=9,
            fontName="Helvetica",
            textColor=colors.grey,
            alignment=TA_CENTER,
        )

        story = [
            Spacer(1, 0.3 * inch),
            Paragraph("CERTIFICATE OF COMPLETION", title_style),
            HRFlowable(width="80%", thickness=2, color=colors.HexColor("#0f3460"), spaceAfter=12),
            Paragraph("This is to certify that", subtitle_style),
            Spacer(1, 0.15 * inch),
            Paragraph(user.full_name or user.email, name_style),
            Spacer(1, 0.15 * inch),
            Paragraph("has successfully completed the course", body_style),
            Spacer(1, 0.15 * inch),
            Paragraph(f"<b>{course.title}</b>", name_style),
            Spacer(1, 0.3 * inch),
            HRFlowable(width="40%", thickness=1, color=colors.HexColor("#cccccc"), spaceAfter=12),
            Paragraph(f"Issued on: {issued_at.strftime('%B %d, %Y')}", body_style),
            Spacer(1, 0.2 * inch),
            Paragraph(f"Winvinaya LMS", subtitle_style),
            Spacer(1, 0.3 * inch),
            Paragraph(f"Verification Code: {verification_code}", small_style),
        ]

        doc.build(story)
        buf.seek(0)
        return buf.read()

    async def issue(
        self,
        db: AsyncSession,
        user: User,
        course: Course,
    ) -> Certificate:
        """Generate and store a certificate PDF, returning the Certificate record."""
        from sqlalchemy import select
        from app.models.certificate import Certificate as CertModel

        # Check for existing certificate
        result = await db.execute(
            select(CertModel).filter(
                CertModel.user_id == user.id,
                CertModel.course_id == course.id,
            )
        )
        existing = result.scalars().first()
        if existing:
            raise ConflictError("Certificate already issued for this course.")

        issued_at = datetime.utcnow()
        verification_code = str(uuid_lib.uuid4())
        pdf_bytes = self._generate_pdf(user, course, issued_at, verification_code)

        pdf_path = f"certificates/{user.id}/{course.id}/certificate.pdf"
        await storage_service.save_bytes(pdf_bytes, pdf_path)

        cert = CertModel(
            user_id=user.id,
            course_id=course.id,
            pdf_path=pdf_path,
            verification_code=verification_code,
            issued_at=issued_at,
        )
        db.add(cert)
        await db.commit()
        await db.refresh(cert)
        return cert


certificate_service = CertificateService()
