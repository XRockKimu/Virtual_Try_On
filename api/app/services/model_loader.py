import joblib
from pathlib import Path
from typing import Optional, Any, Dict
from app.core.config import settings
from app.core.logging import get_logger


logger = get_logger(__name__)


class ModelLoader:
    def __init__(self):
        self.models: Dict[str, Optional[Any]] = {
            "decision_tree": None,
            "neural_network": None,
            "naive_bayes": None
        }
        self.model_status: Dict[str, dict] = {}
        self.is_loaded = False
    
    def load_model(self) -> bool:
        """Load all available models"""
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
        """Get a specific model by type"""
        return self.models.get(model_type)
    
    def is_model_ready(self, model_type: str) -> bool:
        """Check if a specific model is ready"""
        return self.models.get(model_type) is not None
    
    def is_ready(self) -> bool:
        """Check if at least one model is loaded"""
        return self.is_loaded
    
    def get_status(self) -> dict:
        """Get status of all models"""
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
