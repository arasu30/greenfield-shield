from fastapi import APIRouter, HTTPException, Depends
from app.api.schemas.insurance import (
    PremiumCalculationRequest,
    PremiumCalculationResponse,
    PayoutCalculationRequest,
    PayoutCalculationResponse
)
from app.services.insurance_service import InsuranceService

router = APIRouter(prefix="/insurance", tags=["Insurance"])

@router.post("/calculate-premium", response_model=PremiumCalculationResponse)
def calculate_premium(request: PremiumCalculationRequest):
    """
    Calculate the insurance premium based on crop type, season, and land area.
    """
    try:
        result = InsuranceService.calculate_premium(
            crop_type=request.crop_type,
            season=request.season,
            area_acres=request.area_acres
        )
        return PremiumCalculationResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error calculating premium")

@router.post("/calculate-payout", response_model=PayoutCalculationResponse)
def calculate_payout(request: PayoutCalculationRequest):
    """
    Calculate the insurance payout amount based on total coverage and assessed damage percentage.
    """
    try:
        payout = InsuranceService.calculate_payout(
            coverage=request.coverage,
            damage_percentage=request.damage_percentage
        )
        return PayoutCalculationResponse(payout_amount=payout)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error calculating payout")
