import httpx
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.coding import CodingExercise, CodeSubmission
from app.core.config import settings

logger = logging.getLogger(__name__)

PISTON_URL = "https://emkc.org/api/v2/piston/execute"

class CodeRunnerService:
    async def run_code(self, language: str, source_code: str, stdin: str = "") -> Dict[str, Any]:
        """
        Execute code using the Piston API.
        """
        # Mapping common names to Piston aliases if needed
        lang_map = {
            "python": "python",
            "javascript": "javascript",
            "js": "javascript",
            "typescript": "typescript",
            "ts": "typescript",
            "java": "java",
            "cpp": "cpp",
            "c": "c"
        }
        
        target_lang = lang_map.get(language.lower(), language)
        
        payload = {
            "language": target_lang,
            "version": "*",
            "files": [
                {
                    "content": source_code
                }
            ],
            "stdin": stdin
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(PISTON_URL, json=payload, timeout=10.0)
                response.raise_for_status()
                return response.json()["run"] # {stdout, stderr, code, signal, output}
        except Exception as e:
            logger.error(f"Piston API error: {e}")
            return {"stdout": "", "stderr": f"Execution error: {str(e)}", "code": 1, "output": ""}

    async def evaluate_submission(self, db: AsyncSession, user_id: int, exercise_id: int, code: str) -> CodeSubmission:
        """
        Run code against test cases and save submission.
        """
        exercise_stmt = await db.execute(select(CodingExercise).where(CodingExercise.id == exercise_id))
        exercise = exercise_stmt.scalar_one_or_none()
        if not exercise:
            raise ValueError("Exercise not found")
            
        test_cases = exercise.test_cases or []
        passed_count = 0
        last_output = ""
        overall_status = "accepted"
        
        for tc in test_cases:
            result = await self.run_code(exercise.language, code, tc.get("input", ""))
            actual_output = result.get("stdout", "").strip()
            expected_output = tc.get("expected_output", "").strip()
            
            if actual_output == expected_output:
                passed_count += 1
            else:
                overall_status = "wrong_answer"
                if result.get("stderr"):
                    overall_status = "runtime_error"
                
            last_output = result.get("output", "")
            
        score = (passed_count / len(test_cases) * 100) if test_cases else 100
        
        submission = CodeSubmission(
            exercise_id=exercise_id,
            user_id=user_id,
            code=code,
            language=exercise.language,
            status=overall_status,
            output=last_output,
            score=int(score)
        )
        
        db.add(submission)
        await db.commit()
        await db.refresh(submission)
        return submission

code_runner_service = CodeRunnerService()
