import logging
from app.services.hf_backend import predict_image as hf_predict_image, fallback_result

def predict_image(file_bytes: bytes):
    """Thin wrapper for backward compatibility.
    Delegates to the new Hugging Face backend with fail‑proof handling.
    """
    try:
        return hf_predict_image(file_bytes)
    except Exception as e:
        logging.error(f"nasnet_service wrapper error: {e}")
        return fallback_result()
