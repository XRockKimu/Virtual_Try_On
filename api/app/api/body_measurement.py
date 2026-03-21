from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
import logging

from app.schemas.body_measurement import (
    BodyMeasurementResponse,
    ErrorResponse,
    DebugInfo,
    BodyMeasurements
)
from app.services.body_measurement import BodyMeasurementService, DEFAULT_HEIGHT_CM


router = APIRouter()
logger = logging.getLogger(__name__)

body_measurement_service = BodyMeasurementService()


@router.post(
    "/measure",
    response_model=BodyMeasurementResponse,
    responses={
        200: {
            "description": "Measurements successfully calculated",
            "model": BodyMeasurementResponse
        },
        400: {
            "description": "Invalid request or image validation failed",
            "model": ErrorResponse
        }
    },
)
async def measure_body(
    front: UploadFile = File(..., description="Front full body required"),
    height_cm: Optional[float] = Form(
        default=DEFAULT_HEIGHT_CM,
        description="User's actual height in centimeters"
    ),
    left_side: Optional[UploadFile] = File(
        default=None,
        description="Left side for enhanced accuracy"
    )
):
    try:
        # Read front image
        front_image_bytes = await front.read()
        
        # Read side image if provided
        side_image_bytes = None
        if left_side:
            side_image_bytes = await left_side.read()
        
        # Process measurements
        measurements, debug_info = body_measurement_service.process_body_measurement(
            front_image=front_image_bytes,
            user_height_cm=height_cm,
            side_image=side_image_bytes
        )
        
        logger.info(f"Successfully calculated body measurements.")
        
        return BodyMeasurementResponse(
            measurements=BodyMeasurements(**measurements),
            debug_info=DebugInfo(**debug_info)
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Body measurement failed: {str(e)}")
    except Exception as e:
        logger.error(f"Error processing body measurement: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")