from fastapi import APIRouter, File, UploadFile, HTTPException, status

from app.api.schemas.model import PredictionResponse
from app.services.nasnet_service import predict_image

router = APIRouter(prefix="/model", tags=["Model"])


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
)
async def predict(file: UploadFile = File(...)):
    """Accepts an image upload and returns NASNet predictions."""

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be an image",
        )

    contents = await file.read()
    try:
        results = predict_image(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during prediction: {e}",
        )

    return PredictionResponse(predictions=results)
