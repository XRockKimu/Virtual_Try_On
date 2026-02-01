from fastapi import APIRouter, Request, HTTPException
from app.schemas.request import PredictRequest
from app.schemas.response import PredictResponse
from app.services.predictor import Predictor
from app.core.logging import get_logger
from typing import Dict, Any


router = APIRouter()
logger = get_logger(__name__)


@router.post("/predict", response_model=PredictResponse)
async def predict(request: Request, body: PredictRequest):
    model_loader = request.app.state.model_loader
    
    if not model_loader.is_ready():
        raise HTTPException(status_code=503, detail="No models loaded")
    
    # Get the requested model type
    model_type = body.model_type.value
    
    if not model_loader.is_model_ready(model_type):
        raise HTTPException(
            status_code=503, 
            detail=f"Model '{model_type}' is not available. Please select a different model."
        )
    
    model = model_loader.get_model(model_type)
    predictor = Predictor(model, model_type)
    
    try:
        result = predictor.predict(body)
        logger.info(f"Prediction successful using {model_type}: {result.recommended_size}")
        return result
    except Exception as e:
        logger.error(f"Prediction failed with {model_type}: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/models")
async def get_models(request: Request) -> Dict[str, Any]:
    """Get information about available models"""
    model_loader = request.app.state.model_loader
    return model_loader.get_status()
