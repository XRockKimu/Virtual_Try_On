from pydantic import BaseModel
from typing import List, Optional


class Alternative(BaseModel):
    size: str
    score: float


class PredictResponse(BaseModel):
    recommended_size: str
    alternatives: List[Alternative]
    model_version: str
    alternatives_note: Optional[str] = None


class VirtualTryOnResponse(BaseModel):
    image_url: str
    message: str
    category: str
    processing_time: float    


class ReadyResponse(BaseModel):
    ready: bool
    detail: str
    model_version: Optional[str] = None
