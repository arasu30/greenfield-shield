from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.routes.auth import get_current_user_dependency
from app.models.user import User, UserRole
from app.crud.user import UserCRUD
from app.crud import insurance_rate as crud_rate
from app.crud import scheme as crud_scheme
from app.api.schemas.auth import UserResponse
from app.api.schemas.insurance_rate import InsuranceRateCreate, InsuranceRateResponse
from app.api.schemas.scheme import SchemeCreate, SchemeResponse
from app.api.schemas.claim import ClaimResponse
from app.models.claim import Claim, ClaimStatus

router = APIRouter(prefix="/admin", tags=["Admin"])

def require_admin(current_user: dict = Depends(get_current_user_dependency)):
    """Dependency to check if user is admin"""
    if current_user.get("role") != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin access required"
        )
    return current_user

@router.get("/users", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db), _ = Depends(require_admin)):
    """List all users"""
    return UserCRUD.get_all_users(db)

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _ = Depends(require_admin)):
    """Delete a user"""
    success = UserCRUD.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.get("/rates", response_model=List[InsuranceRateResponse])
def get_rates(db: Session = Depends(get_db), _ = Depends(require_admin)):
    """Get all insurance rates"""
    return crud_rate.get_rates(db)

@router.post("/rates", response_model=InsuranceRateResponse)
def set_rate(rate: InsuranceRateCreate, db: Session = Depends(get_db), _ = Depends(require_admin)):
    """Set or update an insurance rate"""
    return crud_rate.upsert_rate(db, rate.crop_type, rate.season, rate.base_rate)

@router.delete("/rates/{rate_id}")
def delete_rate(rate_id: int, db: Session = Depends(get_db), _ = Depends(require_admin)):
    """Delete an insurance rate"""
    success = crud_rate.delete_rate(db, rate_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rate not found")
    return {"message": "Rate deleted successfully"}

@router.patch("/claims/{claim_id}/settle", response_model=ClaimResponse)
def settle_claim(claim_id: int, db: Session = Depends(get_db), _ = Depends(require_admin)):
    """Mark a claim as settled (paid)"""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    if claim.status != ClaimStatus.APPROVED:
        raise HTTPException(status_code=400, detail="Only approved claims can be settled")
        
    claim.is_settled = True
    db.commit()
    db.refresh(claim)
    return claim
