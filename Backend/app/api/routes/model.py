from fastapi import APIRouter, File, UploadFile, HTTPException, status

from app.api.schemas.model import PredictionResponse

router = APIRouter(prefix="/model", tags=["Model"])


import tempfile
import os
from gradio_client import Client, handle_file

@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
)
async def predict(file: UploadFile = File(...)):
    """Accepts an image upload and returns predictions from Hugging Face."""

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be an image",
        )

    contents = await file.read()
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name
            
        client = Client("arasu247/cropsure")
        result_str = client.predict(
            image_filepath=handle_file(tmp_path),
            api_name="/predict"
        )
        os.unlink(tmp_path)
        
        results = []
        for line in result_str.strip().split('\n'):
            if not line: continue
            try:
                parts = line.split(': ')
                prob = float(parts[-1])
                label_desc = parts[0].split(' (')
                label = label_desc[0].strip()
                desc = label_desc[1].replace(')', '').strip()
                results.append({"label": label, "description": desc, "probability": prob})
            except Exception:
                pass
                
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during prediction: {e}",
        )

    return PredictionResponse(predictions=results)
