"""
LocalStorageService — all file operations on the local filesystem.
Uses aiofiles for non-blocking async I/O.
"""
import os
import uuid
import aiofiles
import aiofiles.os

from fastapi import UploadFile
from typing import AsyncIterator

from app.core.config import settings
from app.core.exceptions import StorageError


CHUNK_SIZE = 1024 * 1024  # 1 MB chunks


class LocalStorageService:

    @staticmethod
    def _abs(relative_path: str) -> str:
        """Resolve a relative storage path to an absolute filesystem path."""
        return os.path.join(settings.STORAGE_ROOT, relative_path)

    @staticmethod
    def _ensure_dir(path: str) -> None:
        """Synchronously create parent directories if they don't exist."""
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def get_url(self, relative_path: str) -> str:
        """Return the public URL for a stored file."""
        return f"{settings.BASE_URL}/storage/{relative_path.lstrip('/')}"

    async def save(self, file: UploadFile, relative_path: str) -> str:
        """
        Save an UploadFile to storage.
        Returns the relative path stored (for DB).
        """
        abs_path = self._abs(relative_path)
        self._ensure_dir(abs_path)
        try:
            async with aiofiles.open(abs_path, "wb") as out:
                while chunk := await file.read(CHUNK_SIZE):
                    await out.write(chunk)
            return relative_path
        except Exception as exc:
            raise StorageError(f"Failed to save file: {exc}") from exc

    async def save_bytes(self, data: bytes, relative_path: str) -> str:
        """Save raw bytes to storage (used for generated PDFs/images)."""
        abs_path = self._abs(relative_path)
        self._ensure_dir(abs_path)
        try:
            async with aiofiles.open(abs_path, "wb") as out:
                await out.write(data)
            return relative_path
        except Exception as exc:
            raise StorageError(f"Failed to save bytes: {exc}") from exc

    async def delete(self, relative_path: str) -> None:
        """Delete a file from storage."""
        abs_path = self._abs(relative_path)
        try:
            if await aiofiles.os.path.exists(abs_path):
                await aiofiles.os.remove(abs_path)
        except Exception as exc:
            raise StorageError(f"Failed to delete file: {exc}") from exc

    async def stream(
        self, relative_path: str, start: int, end: int
    ) -> AsyncIterator[bytes]:
        """Yield file bytes in the given byte range (for HTTP 206 responses)."""
        abs_path = self._abs(relative_path)
        if not os.path.exists(abs_path):
            raise StorageError("File not found in storage.")
        async with aiofiles.open(abs_path, "rb") as f:
            await f.seek(start)
            remaining = end - start + 1
            while remaining > 0:
                chunk = await f.read(min(CHUNK_SIZE, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
                yield chunk

    def get_size(self, relative_path: str) -> int:
        """Return the file size in bytes."""
        return os.path.getsize(self._abs(relative_path))

    def exists(self, relative_path: str) -> bool:
        return os.path.exists(self._abs(relative_path))


storage_service = LocalStorageService()
