import logging
import sys
from app.core.config import settings


def setup_logging():
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper()),
        format="%(asctime)s [%(levelname)s] [%(client_ip)s] %(name)s: %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)]
    )


class ClientIPFilter(logging.Filter):
    def __init__(self):
        super().__init__()
        self.client_ip = "system"
    
    def filter(self, record):
        record.client_ip = self.client_ip
        return True


client_ip_filter = ClientIPFilter()


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.addFilter(client_ip_filter)
    return logger
