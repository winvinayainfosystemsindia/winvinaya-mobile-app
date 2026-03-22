from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.course import course_repository
from app.schemas.course import CourseCreate, CourseUpdate, LessonCreate, ModuleUpdate, LessonUpdate
from app.models.course import Course, Module, Lesson

class CourseService:
    async def create_course(self, db: AsyncSession, *, course_in: CourseCreate, instructor_id: int) -> Course:
        course_data = course_in.model_dump()
        if 'instructor_id' in course_data:
            del course_data['instructor_id']
        db_obj = Course(
            **course_data,
            instructor_id=instructor_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        # Re-fetch with modules loaded to satisfy CourseResponse schema
        return await self.get_course_structure(db, db_obj.id)

    async def get_courses(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Course]:
        return await course_repository.get_multi(db, skip=skip, limit=limit)

    async def get_course(self, db: AsyncSession, course_id: int) -> Optional[Course]:
        return await course_repository.get(db, id=course_id)

    async def add_module(self, db: AsyncSession, *, course_id: int, title: str, order: int = 0) -> Module:
        db_obj = Module(title=title, course_id=course_id, order=order)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        # Refetch with lessons loaded for ModuleResponse
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        result = await db.execute(
            select(Module)
            .options(selectinload(Module.lessons))
            .filter(Module.id == db_obj.id)
        )
        return result.scalars().first()

    async def create_lesson(self, db: AsyncSession, *, lesson_in: LessonCreate) -> Lesson:
        db_obj = Lesson(**lesson_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update_course(self, db: AsyncSession, *, course_id: int, course_in: CourseUpdate) -> Optional[Course]:
        db_obj = await course_repository.get(db, id=course_id)
        if not db_obj:
            return None
        updated_obj = await course_repository.update(db, db_obj=db_obj, obj_in=course_in)
        return await self.get_course_structure(db, updated_obj.id)

    async def update_module(self, db: AsyncSession, *, module_id: int, module_in: ModuleUpdate) -> Optional[Module]:
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        
        # We need a module repository ideally, but let's use direct DB for now or add to repo
        result = await db.execute(select(Module).filter(Module.id == module_id))
        db_obj = result.scalars().first()
        if not db_obj:
            return None
            
        update_data = module_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        # Refetch with lessons
        result = await db.execute(
            select(Module)
            .options(selectinload(Module.lessons))
            .filter(Module.id == db_obj.id)
        )
        return result.scalars().first()

    async def update_lesson(self, db: AsyncSession, *, lesson_id: int, lesson_in: LessonUpdate) -> Optional[Lesson]:
        from sqlalchemy import select
        result = await db.execute(select(Lesson).filter(Lesson.id == lesson_id))
        db_obj = result.scalars().first()
        if not db_obj:
            return None
            
        update_data = lesson_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_course_structure(self, db: AsyncSession, course_id: int) -> Optional[Course]:
        return await course_repository.get_with_modules(db, course_id=course_id)

course_service = CourseService()
