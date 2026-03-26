from pydantic import BaseModel, Field

class PremiumCalculationRequest(BaseModel):
    crop_type: str = Field(..., description="Crop type (e.g., Rice, Wheat)")
    season: str = Field(..., description="Season (e.g., Kharif, Rabi)")
    area_acres: float = Field(..., gt=0, description="Farm area in acres")

class PremiumCalculationResponse(BaseModel):
    premium: float
    coverage: float

class PayoutCalculationRequest(BaseModel):
    coverage: float = Field(..., ge=0, description="Total coverage amount")
    damage_percentage: float = Field(..., ge=0, le=100, description="Assessed damage percentage")

class PayoutCalculationResponse(BaseModel):
    payout_amount: float
