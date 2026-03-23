from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_current_user, get_current_admin
from app.db.session import get_db
from app.models.groups import Group, GroupMember
from app.models.user import User
from app.models.enrollment import Enrollment, EnrollmentStatus, EnrollmentSource

router = APIRouter()

@router.get("/", response_model=List[Any])
async def list_groups(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all groups."""
    result = await db.execute(select(Group))
    return result.scalars().all()

@router.post("/", response_model=Any, status_code=status.HTTP_201_CREATED)
async def create_group(
    name: str,
    description: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new group (Admin only)."""
    group = Group(name=name, description=description, created_by=current_user.id)
    db.add(group)
    await db.commit()
    await db.refresh(group)
    return group

@router.post("/{group_id}/members", status_code=status.HTTP_201_CREATED)
async def add_group_member(
    group_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Add a user to a group (Admin only)."""
    # Check if group exists
    group = await db.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Check if user exists
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already a member
    member_check = await db.execute(
        select(GroupMember).filter(GroupMember.group_id == group_id, GroupMember.user_id == user_id)
    )
    if member_check.scalars().first():
        raise HTTPException(status_code=400, detail="User already in group")
    
    member = GroupMember(group_id=group_id, user_id=user_id)
    db.add(member)
    await db.commit()
    return {"status": "success", "message": "User added to group"}

@router.post("/{group_id}/enroll", status_code=status.HTTP_201_CREATED)
async def enroll_group_in_course(
    group_id: int,
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Enroll all members of a group into a course (Admin only)."""
    group = await db.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Fetch all members
    result = await db.execute(
        select(GroupMember).filter(GroupMember.group_id == group_id)
    )
    members = result.scalars().all()
    
    enrollments_added = 0
    for member in members:
        # Check if already enrolled
        enr_check = await db.execute(
            select(Enrollment).filter(Enrollment.user_id == member.user_id, Enrollment.course_id == course_id)
        )
        if enr_check.scalars().first():
            continue
            
        enrollment = Enrollment(
            user_id=member.user_id,
            course_id=course_id,
            source=EnrollmentSource.group,
            group_id=group_id,
            status=EnrollmentStatus.active
        )
        db.add(enrollment)
        enrollments_added += 1
        
    await db.commit()
    return {"status": "success", "enrollments_added": enrollments_added}
