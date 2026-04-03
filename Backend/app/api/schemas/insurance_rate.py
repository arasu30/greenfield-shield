from pydantic import BaseModel
from datetime import datetime

class InsuranceRateBase(BaseModel):
    crop_type: str
    season: str
    base_rate: float

class InsuranceRateCreate(InsuranceRateBase):
    pass

class InsuranceRateResponse(InsuranceRateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
