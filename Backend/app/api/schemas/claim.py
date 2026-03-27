from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.claim import ClaimStatus, DisasterType
from app.api.schemas.policy import PolicyResponse

class ClaimBase(BaseModel):
    policy_id: int
    crop_type: str
    disaster_type: DisasterType
    affected_area: Optional[float] = None # Changed from String to Float
    ai_damage: Optional[float] = None
    confidence: Optional[float] = None

class ClaimCreate(ClaimBase):
    pass

class ClaimUpdate(BaseModel):
    status: ClaimStatus

class ClaimResponse(ClaimBase):
    id: int
    farmer_id: int
    farmer_name: Optional[str] = None
    policy: Optional[PolicyResponse] = None
    status: ClaimStatus
    is_settled: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OfficerDashboardStats(BaseModel):
    pending_count: int
    approved_count: int
    rejected_count: int
    total_count: int
    active_policies_count: int = 0
    pending_policies_count: int = 0
    expired_policies_count: int = 0
