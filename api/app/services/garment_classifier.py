import numpy as np
from pathlib import Path
from PIL import Image
from io import BytesIO
from app.core.logging import get_logger

logger = get_logger(__name__)

CLASS_NAMES = [
    "bikini",      # 0
    "bra",         # 1
    "dress",       # 2
    "longsleeve",  # 3
    "outwear",     # 4
    "pants",       # 5
    "shirt",       # 6
    "shorts",      # 7
    "skirt",       # 8
    "t-shirt",     # 9
    "underwear",   # 10
]

RESTRICTED_CLASSES = {"bikini", "bra", "underwear"}

_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


class GarmentClassifier:
    def __init__(self, model_path: str):
        self._session = None
        self._model_path = model_path

    def load(self) -> bool:
        try:
            import onnxruntime as ort
            path = Path(self._model_path)
            if not path.exists():
                logger.error(f"Garment classifier model not found at {path}")
                return False
            self._session = ort.InferenceSession(
                str(path),
                providers=["CPUExecutionProvider"],
            )
            logger.info(f"Garment classifier loaded from {path}")
            return True
        except Exception as e:
            logger.error(f"Failed to load garment classifier: {e}", exc_info=True)
            return False

    def is_ready(self) -> bool:
        return self._session is not None

    def _preprocess(self, image_bytes: bytes) -> np.ndarray:
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224), Image.BILINEAR)
        x = np.array(img, dtype=np.float32) / 255.0
        x = (x - _MEAN) / _STD
        x = x.transpose(2, 0, 1)
        x = np.expand_dims(x, axis=0)
        return x

    def classify(self, image_bytes: bytes) -> tuple[str, float]:
        if not self.is_ready():
            raise RuntimeError("Garment classifier is not loaded")

        x = self._preprocess(image_bytes)
        input_name = self._session.get_inputs()[0].name
        outputs = self._session.run(None, {input_name: x})
        logits = outputs[0][0]

        exp_logits = np.exp(logits - logits.max())
        probs = exp_logits / exp_logits.sum()

        idx = int(np.argmax(probs))
        return CLASS_NAMES[idx], float(probs[idx])

    def is_restricted(self, image_bytes: bytes) -> tuple[bool, str, float]:
        class_name, confidence = self.classify(image_bytes)
        return class_name in RESTRICTED_CLASSES, class_name, confidence


_classifier: GarmentClassifier | None = None

def get_garment_classifier() -> GarmentClassifier | None:
    return _classifier


def init_garment_classifier(model_path: str) -> bool:
    global _classifier
    _classifier = GarmentClassifier(model_path)
    return _classifier.load()
