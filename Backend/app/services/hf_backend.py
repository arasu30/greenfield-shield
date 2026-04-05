import tempfile
import re
import os
from typing import List, Dict
from gradio_client import Client, handle_file

# Configuration for the Hugging Face model
HF_MODEL_ID = "arasu247/cropsure"

def _call_hf_model(file_path: str) -> str:
    """Internal helper to call the HF model and return raw result string.
    Raises any exception to be handled by the caller.
    """
    client = Client(HF_MODEL_ID)
    result = client.predict(
        image_filepath=handle_file(file_path),
        api_name="/predict"
    )
    return result

def _parse_result(result_str: str) -> List[Dict[str, any]]:
    """Parse the raw result string from HF model into structured list.
    Expected format per line: "label (description): probability"
    """
    results: List[Dict[str, any]] = []
    for line in result_str.strip().split("\n"):
        if not line:
            continue
        match = re.match(r"^(.*?)\s+\((.*?)\):\s+([\d\.]+)$", line)
        if match:
            label = match.group(1).strip()
            desc = match.group(2).strip()
            prob = float(match.group(3))
            results.append({"label": label, "description": desc, "probability": prob})
    return results

def fallback_result() -> List[Dict[str, any]]:
    """Return a deterministic fallback result when model call fails.
    This ensures the API remains robust and always returns a predictable schema.
    """
    return [{"label": "unknown", "description": "fallback", "probability": 0.0}]

def predict_image(file_bytes: bytes) -> List[Dict[str, any]]:
    """Public entry point: predict image using HF model with safe fallback.
    The function writes the incoming bytes to a temporary file, calls the model,
    parses the result, and returns it. If any step fails, a fallback result is
    returned instead of raising an exception.
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name
        try:
            raw_result = _call_hf_model(tmp_path)
            parsed = _parse_result(raw_result)
            return parsed if parsed else fallback_result()
        finally:
            # Ensure temporary file is cleaned up regardless of success
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
    except Exception as e:
        # Log the exception if a logging system is available (placeholder)
        # print(f"HF backend error: {e}")
        return fallback_result()
