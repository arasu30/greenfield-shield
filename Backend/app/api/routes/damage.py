from fastapi import APIRouter, HTTPException, status
from app.api.schemas.damage import GEEDamageRequest, DamageResponse
from app.services import gee_service, damage_service

router = APIRouter(prefix="/model", tags=["Model"])


@router.post(
    "/damage",
    response_model=DamageResponse,
    status_code=status.HTTP_200_OK,
)
def assess_damage(request: GEEDamageRequest):
    """Fetch a GeoTIFF via GEE, convert to npz/array, and run binary damage model."""
    try:
        arr = gee_service.fetch_geotiff_as_array(
            asset_id=request.asset_id,
            region=request.region,
            scale=request.scale,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"failed to fetch or convert geotiff: {e}",
        )

    try:
        damage_flag = damage_service.predict_damage_from_array(arr)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"damage prediction error: {e}",
        )

    return DamageResponse(damage=damage_flag)
