from pydantic_settings import BaseSettings
from typing import Dict


class Settings(BaseSettings):
    # Model paths for all three models
    MODEL_PATHS: Dict[str, str] = {
        "decision_tree": "models/decision_tree_model.pkl",
        "neural_network": "models/mlp_model.pkl",
        "naive_bayes": "models/naive_bayes_model.pkl"
    }
    MODEL_VERSION: str = "dev"
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
