import logging
import sys
from app.core.config import settings


class ClientIPFilter(logging.Filter):
    def __init__(self):
        super().__init__()
        self.client_ip = "system"
    
    def filter(self, record):
        record.client_ip = self.client_ip
        return True


client_ip_filter = ClientIPFilter()


def setup_logging():
    # Create handler with client_ip in format
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter("%(asctime)s [%(levelname)s] [%(client_ip)s] %(name)s: %(message)s")
    )
    handler.addFilter(client_ip_filter)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    root_logger.addHandler(handler)


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    return logger
