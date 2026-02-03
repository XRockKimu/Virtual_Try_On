from pydantic_settings import BaseSettings
from typing import Dict
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    MODEL_DECISION_TREE_PATH: str
    MODEL_NEURAL_NETWORK_PATH: str
    MODEL_VERSION: str
    LOG_LEVEL: str = "INFO"
    GEMINI_API_KEY: str = ""
    
    @property
    def MODEL_PATHS(self) -> Dict[str, str]:
        return {
            "decision_tree": self.MODEL_DECISION_TREE_PATH,
            "neural_network": self.MODEL_NEURAL_NETWORK_PATH,
        }
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
