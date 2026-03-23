from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.routes.auth import get_current_user_dependency, require_role
from app.api.schemas.claim import ClaimResponse, ClaimUpdate, OfficerDashboardStats
from app.api.schemas.officer import FarmerListResponse, FarmerFarmInfo
from app.api.schemas.policy import PolicyResponse
from app.crud.claim import ClaimCRUD
from app.crud.farm import FarmCRUD
from app.crud.user import UserCRUD
from app.models.user import UserRole, User
from app.models.claim import ClaimStatus
from app.models.policy import Policy
from typing import List

router = APIRouter(prefix="/officer", tags=["Officer"])

@router.get("/farmers", response_model=List[FarmerListResponse])
def get_farmers(
    current_user = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get list of all farmers and their farm details"""
    farmers = UserCRUD.get_farmers(db)
    results = []
    
    for farmer in farmers:
        farms = FarmCRUD.get_farms_by_farmer(db, farmer.id)
        
        # Manually construct to avoid validation error on implicit farms attribute
        farmer_data = FarmerListResponse(
            id=farmer.id,
            full_name=farmer.full_name,
            email=farmer.email,
            phone=farmer.phone,
            address=farmer.address,
            created_at=farmer.created_at
        )
        
        # Populate farm info with boundary points
        enriched_farms = []
        for f in farms:
            # Manually construct to avoid validation error on raw boundary field
            farm_info = FarmerFarmInfo(
                id=f.id,
                farm_name=f.farm_name,
                crop_type=f.crop_type,
                area_acres=f.area_acres,
                boundary=FarmCRUD.get_boundary_points(f)
            )
            enriched_farms.append(farm_info)
            
        farmer_data.farms = enriched_farms
        
        # Fetch policies
        from app.crud.policy import PolicyCRUD
        policies = PolicyCRUD.get_policies_by_farmer(db, farmer.id)
        farmer_data.policies = [PolicyResponse.from_orm(p) for p in policies]
        
        results.append(farmer_data)
        
    return results

@router.get("/stats", response_model=OfficerDashboardStats)
def get_officer_stats(
    current_user = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get statistics for the officer dashboard"""
    claims = ClaimCRUD.get_claims(db)
    from app.models.policy import PolicyStatus
    policies = db.query(Policy).all()
    
    pending = len([c for c in claims if c.status == ClaimStatus.PENDING])
    approved = len([c for c in claims if c.status == ClaimStatus.APPROVED])
    rejected = len([c for c in claims if c.status == ClaimStatus.REJECTED])
    
    active_policies = len([p for p in policies if p.status == PolicyStatus.ACTIVE])
    pending_policies = len([p for p in policies if p.status == PolicyStatus.PENDING])
    expired_policies = len([p for p in policies if p.status == PolicyStatus.EXPIRED])
    
    return OfficerDashboardStats(
        pending_count=pending,
        approved_count=approved,
        rejected_count=rejected,
        total_count=len(claims),
        active_policies_count=active_policies,
        pending_policies_count=pending_policies,
        expired_policies_count=expired_policies
    )

@router.get("/policies", response_model=List[PolicyResponse])
def get_all_policies(
    status: str = None,
    current_user = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get list of all policies, optionally filtered by status"""
    from app.crud.policy import PolicyCRUD
    policies = PolicyCRUD.get_all_policies(db, status=status)
    
    # Enrichment if needed (Farmer Names)
    results = []
    for policy in policies:
        # PolicyResponse from_orm works well, but if we need farmer names we might need to extend it
        # For now, PolicyResponse is enough as it has farmer_id
        results.append(PolicyResponse.from_orm(policy))
        
    return results

@router.get("/claims", response_model=List[ClaimResponse])
def get_claims(
    status: str = None,
    current_user = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get list of claims, optionally filtered by status"""
    claims = ClaimCRUD.get_claims(db, status=status)
    
    # Enrich with farmer names
    results = []
    for claim in claims:
        farmer = db.query(User).filter(User.id == claim.farmer_id).first()
        policy = db.query(Policy).filter(Policy.id == claim.policy_id).first()
        
        claim_resp = ClaimResponse.from_orm(claim)
        claim_resp.farmer_name = farmer.full_name if farmer else "Unknown Farmer"
        
        if policy:
            claim_resp.policy = PolicyResponse.from_orm(policy)
            
        results.append(claim_resp)
        
    return results

@router.patch("/claims/{claim_id}", response_model=ClaimResponse)
def update_claim_status(
    claim_id: int,
    update_data: ClaimUpdate,
    current_user = Depends(require_role(UserRole.OFFICER, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Approve or reject a claim"""
    claim = ClaimCRUD.update_claim_status(db, claim_id, update_data.status)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    farmer = db.query(User).filter(User.id == claim.farmer_id).first()
    policy = db.query(Policy).filter(Policy.id == claim.policy_id).first()
    
    resp = ClaimResponse.from_orm(claim)
    resp.farmer_name = farmer.full_name if farmer else "Unknown Farmer"
    
    if policy:
        resp.policy = PolicyResponse.from_orm(policy)
        
    return resp
