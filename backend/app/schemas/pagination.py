"""
Standard pagination schemas for LMS API responses.

OffsetPage  - classic page/page_size pagination (tables, admin views)
CursorPage  - cursor-based pagination (feeds, infinite scroll)

Usage:
    from app.schemas.pagination import OffsetPage, CursorPage, paginate_query

    @router.get("/courses", response_model=OffsetPage[CourseRead])
    async def list_courses(page: int = 1, page_size: int = 20, ...):
        total, items = await course_repository.get_page(db, page, page_size)
        return OffsetPage.create(items=items, total=total, page=page, page_size=page_size)
"""
from __future__ import annotations

import math
from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field, model_validator

T = TypeVar("T")

# ── Constants ──────────────────────────────────────────────────────────────────
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100         # Hard cap — prevents data dumps


# ── Offset-based pagination ────────────────────────────────────────────────────

class OffsetPage(BaseModel, Generic[T]):
    """Standard page-based pagination envelope."""
    items: List[T]
    total: int = Field(..., description="Total number of matching records")
    page: int = Field(..., ge=1, description="Current page (1-indexed)")
    page_size: int = Field(..., ge=1, le=MAX_PAGE_SIZE)
    total_pages: int
    has_next: bool
    has_prev: bool

    model_config = {"from_attributes": True}

    @classmethod
    def create(
        cls,
        *,
        items: List[T],
        total: int,
        page: int,
        page_size: int,
    ) -> "OffsetPage[T]":
        total_pages = max(1, math.ceil(total / page_size)) if total else 1
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        )


# ── Cursor-based pagination ────────────────────────────────────────────────────

class CursorPage(BaseModel, Generic[T]):
    """
    Cursor-based pagination — ideal for infinite scroll / feeds.
    `next_cursor` is an opaque string (e.g. base64-encoded id or timestamp).
    """
    items: List[T]
    next_cursor: Optional[str] = Field(None, description="Pass as `cursor` in the next request")
    has_more: bool
    count: int = Field(..., description="Number of items in this page")

    model_config = {"from_attributes": True}

    @classmethod
    def create(
        cls,
        *,
        items: List[T],
        next_cursor: Optional[str],
    ) -> "CursorPage[T]":
        return cls(
            items=items,
            next_cursor=next_cursor,
            has_more=next_cursor is not None,
            count=len(items),
        )


# ── Query helpers ──────────────────────────────────────────────────────────────

def clamp_page_size(page_size: int) -> int:
    """Clamp page_size between 1 and MAX_PAGE_SIZE."""
    return max(1, min(page_size, MAX_PAGE_SIZE))


def offset_from(page: int, page_size: int) -> int:
    """Convert 1-indexed page number to SQL OFFSET."""
    return (max(1, page) - 1) * clamp_page_size(page_size)
