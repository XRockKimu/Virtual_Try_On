import numpy as np
import pandas as pd
from app.schemas.request import PredictRequest
from app.schemas.response import PredictResponse, Alternative
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class Predictor:
    FEATURE_ORDER = ["height", "weight", "age"]

    MODEL_NAMES = {
        "decision_tree": "Decision Tree",
        "neural_network": "Neural Network (MLP)",
        "naive_bayes": "Naive Bayes"
    }

    # Reverse mapping (fix numeric outputs)
    SIZE_MAPPING = {
        1: "XXS",
        2: "S",
        3: "M",
        4: "L",
        5: "XL",
        6: "XXL",
        7: "XXXL"
    }

    def __init__(self, model, model_type: str = "decision_tree"):
        self.model = model
        self.model_type = model_type

    def predict(self, request: PredictRequest) -> PredictResponse:
        try:
            # Prepare input data
            input_data = pd.DataFrame([{
                "height": request.height_cm,
                "weight": request.weight_kg,
                "age": request.age
            }])

            # Ensure correct feature order
            input_data = input_data[self.FEATURE_ORDER]

            # Get numeric prediction
            pred = int(self.model.predict(input_data)[0])

            # Convert numeric prediction → size label
            recommended_size = self.SIZE_MAPPING.get(pred, "Unknown")

            alternatives = []
            alternatives_note = None

            # Alternatives with probabilities
            if hasattr(self.model, "predict_proba"):
                try:
                    probas = self.model.predict_proba(input_data)[0]
                    classes = self.model.classes_

                    # Top 3 predictions
                    top_indices = np.argsort(probas)[::-1][:3]

                    alternatives = [
                        Alternative(
                            size=self.SIZE_MAPPING.get(int(classes[idx]), "Unknown"),
                            score=float(probas[idx])
                        )
                        for idx in top_indices
                    ]

                except Exception as e:
                    logger.warning(f"Could not compute alternatives: {e}")
                    alternatives_note = "Alternatives unavailable"

            else:
                alternatives_note = "Model does not support probability predictions"

            model_display_name = self.MODEL_NAMES.get(self.model_type, self.model_type)

            return PredictResponse(
                recommended_size=recommended_size,
                alternatives=alternatives,
                model_version=f"{settings.MODEL_VERSION} ({model_display_name})",
                alternatives_note=alternatives_note
            )

        except Exception as e:
            logger.error(f"Prediction error: {e}", exc_info=True)
            raise
