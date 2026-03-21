from pydantic import BaseModel, Field
from typing import Optional


class BodyMeasurementRequest(BaseModel):
    """Request model for body measurement"""
    height_cm: Optional[float] = Field(
        default=152.0,
        description="User's height in centimeters. Default is 152.0 cm if not provided"
    )


class BodyMeasurements(BaseModel):
    """Body measurement results"""
    shoulder_width: float = Field(description="Shoulder width in centimeters")
    chest_width: float = Field(description="Chest width in centimeters")
    chest_circumference: float = Field(description="Chest circumference in centimeters")
    waist_width: float = Field(description="Waist width in centimeters")
    waist: float = Field(description="Waist circumference in centimeters")
    hip_width: float = Field(description="Hip width in centimeters")
    hip: float = Field(description="Hip circumference in centimeters")
    neck: float = Field(description="Neck circumference in centimeters")
    neck_width: float = Field(description="Neck width in centimeters")
    arm_length: float = Field(description="Arm length in centimeters")
    shirt_length: float = Field(description="Shirt length in centimeters")
    thigh: float = Field(description="Thigh width in centimeters")
    thigh_circumference: float = Field(description="Thigh circumference in centimeters")
    trouser_length: float = Field(description="Trouser length in centimeters")


class DebugInfo(BaseModel):
    """Debug information for troubleshooting"""
    scale_factor: Optional[float] = Field(description="Calculated scale factor used for measurements")
    focal_length: float = Field(description="Focal length used in calculations")
    user_height_cm: float = Field(description="User height used (provided or default)")


class BodyMeasurementResponse(BaseModel):
    """Response model for body measurement"""
    measurements: BodyMeasurements
    debug_info: DebugInfo


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(description="Error message describing what went wrong")
    pose: Optional[str] = Field(default=None, description="Which pose caused the error")
    code: Optional[str] = Field(default=None, description="Error code")
