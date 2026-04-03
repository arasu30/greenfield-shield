from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.routes.auth import get_current_user_dependency
from app.api.schemas.farmer import FarmerDashboardStats, DashboardStat
from app.api.schemas.policy import PolicyCreate, PolicyResponse
from app.crud.farm import FarmCRUD
from app.crud.policy import PolicyCRUD
from app.models.user import UserRole
from app.utils.errors import AccessDenied
from geoalchemy2 import functions as geofunc
from typing import List
from app.api.schemas.farmer import SaveFarmRequest, SaveFarmResponse

router = APIRouter(prefix="/farmer", tags=["Farmer"])

@router.get("/dashboard-stats", response_model=FarmerDashboardStats)
def get_dashboard_stats(
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get dynamic stats for the farmer dashboard"""
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can access this dashboard data")
    
    # Fetch farm data
    farms = FarmCRUD.get_farms_by_farmer(db, current_user["id"])
    
    total_area = 0.0
    for farm in farms:
        # If area_acres is zero or None, try to re-calculate it from boundary
        if not farm.area_acres or farm.area_acres < 0.01:
            try:
                # Use geofunc.ST_Area for explicit geoalchemy2 usage
                area_sqm = db.query(geofunc.ST_Area(farm.boundary)).scalar()
                
                if area_sqm and area_sqm > 0:
                    calculated_acres = area_sqm / 4046.86
                    farm.area_acres = calculated_acres
                    db.add(farm)
            except Exception:
                pass
        
        area = farm.area_acres if farm.area_acres is not None else 0.0
        total_area += area
    
    # Commit any updated area values
    try:
        db.commit()
    except Exception:
        db.rollback()

    # Fetch policy data
    active_policies = PolicyCRUD.get_active_policies_count(db, current_user["id"])
    
    stats = [
        DashboardStat(
            title="Active Policies",
            value=str(active_policies),
            sub=f"Protecting {total_area:.1f} acres",
            icon="ShieldCheck",
            color="text-blue-400",
            bg="bg-blue-500/10",
            border="border-blue-500/20"
        ),
        DashboardStat(
            title="Pending Claims",
            value="0",
            sub="No active claims",
            icon="AlertTriangle",
            color="text-amber-400",
            bg="bg-amber-500/10",
            border="border-amber-500/20"
        )
    ]
    
    # Prepare farm details for the dashboard
    farm_details = []
    for farm in farms:
        farm_details.append({
            "name": farm.farm_name,
            "area": farm.area_acres if farm.area_acres is not None else 0.0,
            "crop_type": farm.crop_type,
            "boundary": FarmCRUD.get_boundary_points(farm)
        })
    
    return FarmerDashboardStats(
        full_name=current_user.get("full_name") or "Farmer",
        farm_area_acres=total_area,
        stats=stats,
        farms=farm_details
    )

@router.post("/buy-policy", response_model=PolicyResponse)
def buy_policy(
    policy_data: PolicyCreate,
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Register a new policy for the farmer"""
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can purchase policies")
    
    return PolicyCRUD.create_policy(db, current_user["id"], policy_data)

@router.get("/my-policies", response_model=List[PolicyResponse])
def get_my_policies(
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get all policies for the logged in farmer"""
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can view their policies")
    
    return PolicyCRUD.get_policies_by_farmer(db, current_user["id"])
