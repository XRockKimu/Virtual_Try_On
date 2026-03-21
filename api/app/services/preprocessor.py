import pandas as pd
import joblib
from pathlib import Path
from typing import Tuple
from app.core.logging import get_logger

logger = get_logger(__name__)


class DataPreprocessor:
    
    def __init__(self):
        self.scaler = None
        
    def load_scaler(self, scaler_path: str = None):
        if scaler_path is None:
            scaler_path = "models/feature_scaler.pkl"
        
        # Load the saved StandardScaler
        try:
            scaler_path_obj = Path(scaler_path)
            if scaler_path_obj.exists():
                self.scaler = joblib.load(scaler_path_obj)
                logger.info(f"StandardScaler loaded from {scaler_path}")
                logger.debug(f"Scaler mean: {self.scaler.mean_}")
                logger.debug(f"Scaler scale: {self.scaler.scale_}")
            else:
                logger.error(f"StandardScaler not found at {scaler_path_obj.absolute()}")
                logger.warning("Normalization will not be applied!")
        except Exception as e:
            logger.error(f"Error loading StandardScaler: {e}")
            self.scaler = None
    
    def preprocess_input(self, age: float, height: float, weight: float) -> pd.DataFrame:
        """
        Preprocess input features for size prediction.
        
        Steps:
        1. Create DataFrame with age, height, weight
        2. Apply StandardScaler transformation (if loaded)
        3. Add engineered features: bmi, weight-squared (if needed by model)
        
        Args:
            age: Age in years
            height: Height in cm
            weight: Weight in kg
            
        Returns:
            Preprocessed DataFrame ready for model prediction
        """
        input_data = pd.DataFrame({
            'age': [age],
            'height': [height],
            'weight': [weight]
        })
        
        logger.debug(f"Raw input: age={age}, height={height}, weight={weight}")
        
        # Add engineered features (must match training)
        input_data['bmi'] = input_data['height'] / input_data['weight']
        input_data['weight-squared'] = input_data['weight'] * input_data['weight']
        
        logger.debug(f"After feature engineering: {input_data.columns.tolist()}")
        
        # Apply StandardScaler normalization
        if self.scaler is not None:
            standardized_data = pd.DataFrame(
                self.scaler.transform(input_data),
                columns=input_data.columns
            )
            logger.debug(f"Standardized values: {standardized_data.values[0]}")
        else:
            logger.warning("No scaler loaded - using raw input (predictions may be incorrect!)")
            standardized_data = input_data
        
        return standardized_data
    
    def postprocess_output(self, predicted_size: int) -> str:
        """Convert predicted numeric label back to size string."""
        size_mapping = {
            1: "S",
            2: "M",
            3: "L",
            4: "XL",
            5: "XXXL"
        }
        
        return size_mapping.get(int(predicted_size), f"Size_{predicted_size}")
