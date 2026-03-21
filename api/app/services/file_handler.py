import logging
import time
import shutil
from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)

# Temp folder configuration
BASE_TEMP_DIR = Path("temp")
UPLOAD_TEMP_DIR = BASE_TEMP_DIR / "upload"
OUTPUT_TEMP_DIR = BASE_TEMP_DIR / "output"

# Allowed file extensions and max file size
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def setup_temp_folders():
    UPLOAD_TEMP_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_TEMP_DIR.mkdir(parents=True, exist_ok=True)
    logger.info(f"Temp folders initialized: {UPLOAD_TEMP_DIR}, {OUTPUT_TEMP_DIR}")


def cleanup_old_files(folder: Path, max_age_hours: int = 24):
    if not folder.exists():
        return
    
    current_time = time.time()
    for file_path in folder.glob("*"):
        if file_path.is_file():
            file_age = current_time - file_path.stat().st_mtime
            if file_age > (max_age_hours * 3600):
                try:
                    file_path.unlink()
                    logger.debug(f"Cleaned up old file: {file_path}")
                except Exception as e:
                    logger.warning(f"Failed to delete old file {file_path}: {str(e)}")


def validate_image_file(file: UploadFile) -> None:
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )


async def save_upload_file(upload_file: UploadFile, prefix: str = "img") -> Path:
    validate_image_file(upload_file)
    
    # Generate unique filename
    file_ext = Path(upload_file.filename).suffix.lower()
    unique_filename = f"{prefix}_{uuid4().hex}{file_ext}"
    file_path = UPLOAD_TEMP_DIR / unique_filename
    
    # Read and validate file size
    content = await upload_file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    logger.info(f"Saved upload file: {file_path} ({len(content)} bytes)")
    return file_path


def save_result_image(source_path: str, prefix: str = "result") -> Path:
    if not Path(source_path).exists():
        raise FileNotFoundError(f"Result image not found: {source_path}")
    
    # Generate unique filename for output
    file_ext = Path(source_path).suffix
    unique_filename = f"{prefix}_{uuid4().hex}{file_ext}"
    output_path = OUTPUT_TEMP_DIR / unique_filename
    
    # Copy result to output folder
    shutil.copy2(source_path, output_path)
    logger.info(f"Saved result image: {output_path}")
    
    return output_path


def cleanup_files(*file_paths: Path):
    for file_path in file_paths:
        try:
            if file_path and file_path.exists():
                file_path.unlink()
                logger.debug(f"Cleaned up temp file: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup file {file_path}: {str(e)}")

setup_temp_folders()