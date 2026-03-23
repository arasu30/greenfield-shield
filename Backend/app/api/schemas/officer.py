from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.api.schemas.auth import UserResponse
from app.api.schemas.policy import PolicyResponse

class FarmerFarmInfo(BaseModel):
    id: int
    farm_name: Optional[str]
    crop_type: Optional[str]
    area_acres: Optional[float]
    boundary: List[dict] = []

    class Config:
        from_attributes = True

class FarmerListResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    created_at: datetime
    farms: List[FarmerFarmInfo] = []
    policies: List[PolicyResponse] = []

    class Config:
        from_attributes = True
