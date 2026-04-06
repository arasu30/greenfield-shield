from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.api.schemas.crop_assessment import CropDamageRequest, CropDamageResponse
from app.database.session import get_db
from app.services import crop_assessment_service, report_service

router = APIRouter(prefix="/assess", tags=["Crop Assessment"])


@router.post(
    "/damage",
    response_model=CropDamageResponse,
    status_code=status.HTTP_200_OK,
)
async def assess_crop_damage(
    request: CropDamageRequest,
    db: Session = Depends(get_db)
):
    """Assess crop damage for a specific farm.
    
    Pipeline:
    1. Fetch farm coordinates from database
    2. Query Google Earth Engine for GeoTIFF
    3. Convert GeoTIFF to NPZ array
    4. Run damage classification model
    
    Returns damage prediction (0 = no damage, 1 = damage detected)
    """
    try:
        result = crop_assessment_service.assess_crop_damage_for_farm(
            db=db,
            farm_id=request.farm_id,
            gee_asset_id=request.gee_asset_id,
            scale=request.scale,
        )
        
        # Format response
        return CropDamageResponse(
            farm_id=result["farm_id"],
            farm_name=result["farm_name"],
            crop_type=result["crop_type"],
            area_acres=result["area_acres"],
            geotiff_shape=result["geotiff_shape"],
            damage_prediction=result["damage_prediction"],
            nasnet_predictions=result["nasnet_predictions"],
            gee_asset_used=result["gee_asset_used"],
            message=f"Assessment complete. Damage detected: {bool(result['damage_prediction'])}"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Crop damage assessment failed: {str(e)}"
        )


@router.get(
    "/report/{farm_id}",
    status_code=status.HTTP_200_OK,
)
async def download_crop_report(
    farm_id: int,
    db: Session = Depends(get_db)
):
    """Generate and download a PDF crop report for a specific farm."""
    try:
        # Run assessment
        result = crop_assessment_service.assess_crop_damage_for_farm(
            db=db,
            farm_id=farm_id
        )
        
        # Generate PDF
        pdf_path = report_service.generate_crop_report_pdf(result)
        
        # Return as file for download
        return FileResponse(
            path=pdf_path,
            filename=f"CropReport_Farm_{farm_id}.pdf",
            media_type="application/pdf"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}"
        )
