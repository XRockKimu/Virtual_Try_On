from fastapi import APIRouter, Request
from app.schemas.response import HealthResponse, ReadyResponse


router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok")


@router.get("/ready", response_model=ReadyResponse)
async def ready(request: Request):
    model_loader = request.app.state.model_loader
    status = model_loader.get_status()
    return ReadyResponse(**status)
