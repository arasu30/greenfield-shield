from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.policy import PolicyStatus

class PolicyBase(BaseModel):
    crop_type: str
    season: str
    premium: float
    coverage: float
    scheme_id: Optional[int] = None

class PolicyCreate(PolicyBase):
    pass

class PolicyResponse(PolicyBase):
    id: int
    farmer_id: int
    status: PolicyStatus
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Payment schemas
class PaymentIntentRequest(BaseModel):
    crop_type: str
    season: str
    premium: float
    coverage: float
    scheme_id: Optional[int] = None

class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    amount: int
    currency: str
    status: str

class PaymentConfirmationRequest(BaseModel):
    payment_intent_id: str
    crop_type: str
    season: str
    premium: float
    coverage: float
    scheme_id: Optional[int] = None
