import tempfile
import re
from gradio_client import Client, handle_file


def predict_image(file_bytes: bytes):
    """Run a prediction on raw image bytes using the Kaveri crop damage model on Hugging Face.

    Args:
        file_bytes: contents of an image file (JPEG/PNG/etc).
    Returns:
        A list of dictionaries containing crop damage prediction information.
    """
    client = Client("arasu247/cropsure")
    
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name
        
    result_str = client.predict(
        image_filepath=handle_file(tmp_path),
        api_name="/test_image"
    )
    
    results = []
    for line in result_str.strip().split("\n"):
        if not line:
            continue
        
        # Expected format from HF Space: "label (description): probability"
        match = re.match(r"^(.*?)\s+\((.*?)\):\s+([\d\.]+)$", line)
        if match:
            label = match.group(1).strip()
            desc = match.group(2).strip()
            prob = float(match.group(3))
            results.append({
                "label": label,
                "description": desc,
                "probability": prob
            })
            
    return results
