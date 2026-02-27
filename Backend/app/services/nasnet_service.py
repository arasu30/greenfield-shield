from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


class NASNetModel:
    """Singleton wrapper for the NASNet model to avoid reloading."""

    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            # Load the pre-trained Kaveri crop damage model
            model_path = Path(__file__).parent / "nasnet_kaveri_crop_damage.keras"
            cls._model = load_model(str(model_path))
        return cls._model


def predict_image(file_bytes: bytes):
    """Run a prediction on raw image bytes using the Kaveri crop damage model.

    Args:
        file_bytes: contents of an image file (JPEG/PNG/etc).
    Returns:
        A list of dictionaries containing crop damage prediction information.
    """

    # PIL handles a variety of image formats
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    # NASNetMobile expects 224x224 inputs
    img = img.resize((224, 224))

    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    # Normalize to [0, 1] if the model expects it
    x = x / 255.0

    preds = NASNetModel.get_model().predict(x)
    
    # The custom model outputs raw probabilities; format the response
    # If single output: damage probability
    # If multiple outputs: class probabilities for different damage levels
    if preds.ndim == 2 and preds.shape[1] == 1:
        # Single output: damage score
        damage_score = float(preds[0, 0])
        return [{"label": "damage_likelihood", "description": "Crop damage probability", "probability": damage_score}]
    else:
        # Multiple outputs: treat as class probabilities
        preds_flat = preds.flatten()
        return [
            {"label": f"class_{i}", "description": f"Class {i} probability", "probability": float(prob)}
            for i, prob in enumerate(preds_flat)
        ]
