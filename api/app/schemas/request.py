from pydantic import BaseModel, Field, field_validator
from enum import Enum
from typing import Optional


class ModelType(str, Enum):
    DECISION_TREE = "decision_tree"
    NEURAL_NETWORK = "neural_network"


class PredictRequest(BaseModel):
    age: float = Field(..., gt=0, description="Age in years")
    height: float = Field(..., gt=0, description="Height in centimeters")
    weight: float = Field(..., gt=0, description="Weight in kilograms")
    model_type: ModelType = Field(
        default=ModelType.DECISION_TREE,
        description="Model to use for prediction: decision_tree or neural_network"
    )
    
    @field_validator("age", "height", "weight")
    @classmethod
    def validate_positive(cls, v):
        if v <= 0:
            raise ValueError("Value must be positive")
        return v


class GarmentCategory(str, Enum):
    UPPER_BODY = "Upper-body"
    LOWER_BODY = "Lower-body"
    DRESS = "Dress"


class VirtualTryOnRequest(BaseModel):
    category: GarmentCategory = Field(
        default=GarmentCategory.UPPER_BODY,
        description="Category of garment: Upper-body, Lower-body, or Dress"
    )
    n_samples: int = Field(
        default=1,
        ge=1,
        le=4,
        description="Number of samples to generate (1-4)"
    )
    n_steps: int = Field(
        default=20,
        ge=20,
        le=40,
        description="Number of diffusion steps (20-40)"
    )
    image_scale: float = Field(
        default=2.0,
        ge=1.0,
        le=5.0,
        description="Image scale factor (1-5)"
    )
    seed: int = Field(
        default=-1,
        description="Random seed for reproducibility (-1 for random)"
    )
