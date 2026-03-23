from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SchemeBase(BaseModel):
    name: str
    description: str
    eligibility_criteria: Optional[str] = None
    benefits: Optional[str] = None
    required_documents: Optional[str] = None
    is_active: bool = True

class SchemeCreate(SchemeBase):
    pass

class SchemeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    benefits: Optional[str] = None
    required_documents: Optional[str] = None
    is_active: Optional[bool] = None

class SchemeResponse(SchemeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
