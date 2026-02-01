from pydantic import BaseModel, Field, field_validator
from enum import Enum
from typing import Optional


class ModelType(str, Enum):
    DECISION_TREE = "decision_tree"
    NEURAL_NETWORK = "neural_network"
    NAIVE_BAYES = "naive_bayes"


class PredictRequest(BaseModel):
    height_cm: float = Field(..., gt=0, description="Height in centimeters")
    weight_kg: float = Field(..., gt=0, description="Weight in kilograms")
    age: float = Field(..., gt=0, description="Age in years")
    model_type: ModelType = Field(
        default=ModelType.DECISION_TREE,
        description="Model to use for prediction: decision_tree, neural_network, or naive_bayes"
    )
    
    @field_validator("height_cm", "weight_kg", "age")
    @classmethod
    def validate_positive(cls, v):
        if v <= 0:
            raise ValueError("Value must be positive")
        return v
