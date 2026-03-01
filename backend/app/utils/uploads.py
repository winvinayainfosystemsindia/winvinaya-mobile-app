import os
import uuid
from fastapi import UploadFile
from app.core.config import settings

async def save_upload_file(upload_file: UploadFile, sub_folder: str = "") -> str:
    """
    Saves an uploaded file to the specified subfolder within the upload directory.
    Returns the relative path to the saved file.
    """
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    upload_path = os.path.join(settings.UPLOAD_DIR, sub_folder)
    if not os.path.exists(upload_path):
        os.makedirs(upload_path, exist_ok=True)
        
    file_path = os.path.join(upload_path, unique_filename)
    
    with open(file_path, "wb") as buffer:
        content = await upload_file.read()
        buffer.write(content)
        
    return os.path.join(sub_folder, unique_filename)
