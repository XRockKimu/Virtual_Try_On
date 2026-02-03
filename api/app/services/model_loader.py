import joblib
from pathlib import Path
from typing import Optional, Any, Dict
from app.core.config import settings
from app.core.logging import get_logger
from app.services.preprocessor import DataPreprocessor


logger = get_logger(__name__)


class ModelLoader:
    def __init__(self):
        self.models: Dict[str, Optional[Any]] = {
            "decision_tree": None,
            "neural_network": None,
        }
        self.model_status: Dict[str, dict] = {}
        self.is_loaded = False
        self.preprocessor = DataPreprocessor()
    
    def load_model(self) -> bool:
        # Load preprocessing statistics from training data
        try:
            data_path = Path("data/final_test.csv")
            if data_path.exists():
                self.preprocessor.load_stats_from_data(str(data_path))
            else:
                logger.warning("Training data not found, using default preprocessing")
        except Exception as e:
            logger.warning(f"Could not load preprocessing stats: {e}")
        
        success_count = 0
        
        for model_name, model_path_str in settings.MODEL_PATHS.items():
            try:
                model_path = Path(model_path_str)
                
                if not model_path.exists():
                    error_msg = f"Model file not found at {model_path}"
                    logger.warning(error_msg)
                    self.model_status[model_name] = {
                        "loaded": False,
                        "error": error_msg
                    }
                    continue
                
                logger.info(f"Loading {model_name} model from {model_path}")
                self.models[model_name] = joblib.load(model_path)
                self.model_status[model_name] = {
                    "loaded": True,
                    "error": None
                }
                success_count += 1
                logger.info(f"{model_name} model loaded successfully")
                
            except Exception as e:
                error_msg = f"Failed to load {model_name} model: {str(e)}"
                logger.error(error_msg, exc_info=True)
                self.model_status[model_name] = {
                    "loaded": False,
                    "error": error_msg
                }
        
        self.is_loaded = success_count > 0
        logger.info(f"Loaded {success_count} out of {len(settings.MODEL_PATHS)} models")
        return self.is_loaded
    
    def get_model(self, model_type: str = "decision_tree") -> Optional[Any]:
        return self.models.get(model_type)
    
    def is_model_ready(self, model_type: str) -> bool:
        return self.models.get(model_type) is not None
    
    def is_ready(self) -> bool:
        return self.is_loaded
    
    def get_preprocessor(self) -> DataPreprocessor:
        return self.preprocessor
    
    def get_status(self) -> dict:
        models_info = {}
        for model_name in self.models.keys():
            status = self.model_status.get(model_name, {"loaded": False, "error": "Not initialized"})
            models_info[model_name] = {
                "ready": status.get("loaded", False),
                "error": status.get("error")
            }
        
        return {
            "ready": self.is_ready(),
            "models": models_info,
            "model_version": settings.MODEL_VERSION
        }
