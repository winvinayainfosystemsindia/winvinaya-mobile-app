from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class CertificateResponse(BaseModel):
    id: int
    public_id: UUID
    user_id: int
    course_id: int
    pdf_url: Optional[str] = None
    verification_code: UUID
    issued_at: datetime

    class Config:
        from_attributes = True
