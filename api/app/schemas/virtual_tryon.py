from enum import Enum
from pydantic import BaseModel, Field


class GarmentCategory(str, Enum):
    """Enum for garment categories used in virtual try-on."""
    UPPER_BODY = "upperbody"
    LOWER_BODY = "lowerbody"
    DRESS = "dress"


class VirtualTryOnResponse(BaseModel):
    """Response model for virtual try-on endpoints."""
    image_url: str = Field(..., description="URL or path to the generated try-on image")
    message: str = Field(..., description="Status message")
    category: str = Field(..., description="Category of the try-on (HD, DC, Gemini or garment type)")
    processing_time: float = Field(..., description="Time taken to process the request in seconds")
