from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.routes.auth import get_current_user_dependency
from app.api.schemas.farmer import FarmerDashboardStats, DashboardStat
from app.api.schemas.policy import (
    PolicyCreate,
    PolicyResponse,
    PaymentIntentRequest,
    PaymentIntentResponse,
    PaymentConfirmationRequest
)
from app.services.stripe_service import StripeService
from app.crud.farm import FarmCRUD
from app.crud.policy import PolicyCRUD
from app.crud.claim import ClaimCRUD
from app.models.user import UserRole
from app.models.policy import Policy
from app.models.farm import Farm
from app.utils.errors import AccessDenied
from app.api.schemas.claim import ClaimCreate, ClaimResponse
from app.api.schemas.insurance import (
    PremiumCalculationRequest,
    PremiumCalculationResponse,
    PayoutCalculationRequest,
    PayoutCalculationResponse
)
from app.services.insurance_service import InsuranceService
from geoalchemy2 import functions as geofunc
from typing import List
from app.api.schemas.farmer import SaveFarmRequest, SaveFarmResponse, FarmInfo

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
                # Use func.ST_Area to query the row's geography
                from sqlalchemy import func
                area_sqm = db.query(func.ST_Area(Farm.boundary)).filter(Farm.id == farm.id).scalar()
                
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
    my_policies = PolicyCRUD.get_policies_by_farmer(db, current_user["id"])
    active_policies = [p for p in my_policies if p.status == "Active"]
    total_coverage = sum(p.coverage for p in active_policies if p.coverage)
    
    # Fetch claim data
    from app.crud.claim import ClaimCRUD
    my_claims = ClaimCRUD.get_claims_by_farmer(db, current_user["id"])
    
    stats = [
        DashboardStat(
            title="Active Policies",
            value=str(len(active_policies)),
            sub=f"Protecting {total_area:.1f} acres",
            icon="ShieldCheck",
            color="text-emerald-400",
            bg="bg-emerald-500/10",
            border="border-emerald-500/20"
        ),
        DashboardStat(
            title="Total Coverage",
            value=f"₹{total_coverage/100000:.1f}L" if total_coverage >= 100000 else f"₹{total_coverage:,}",
            sub="Active protection amount",
            icon="Wallet",
            color="text-blue-400",
            bg="bg-blue-500/10",
            border="border-blue-500/20"
        ),
        DashboardStat(
            title="Claims Filed",
            value=str(len(my_claims)),
            sub="Reported crop damages",
            icon="FileText",
            color="text-amber-400",
            bg="bg-amber-500/10",
            border="border-amber-500/20"
        ),
        DashboardStat(
            title="Crop Health",
            value="92%",
            sub="Satellite monitored",
            icon="TrendingUp",
            color="text-teal-400",
            bg="bg-teal-500/10",
            border="border-teal-500/20"
        )
    ]
    
    # Prepare farm details for the dashboard
    farm_details = []
    for farm in farms:
        farm_details.append({
            "id": farm.id,
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

@router.get("/farms", response_model=List[FarmInfo])
def get_my_farms(
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get all registered farms for the current farmer"""
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can view their farms")
    
    farms = FarmCRUD.get_farms_by_farmer(db, current_user["id"])
    return [
        FarmInfo(
            id=f.id,
            name=f.farm_name,
            area=f.area_acres if f.area_acres is not None else 0.0,
            crop_type=f.crop_type,
            boundary=FarmCRUD.get_boundary_points(f)
        ) for f in farms
    ]

@router.post("/calculate-premium", response_model=PremiumCalculationResponse)
def calculate_premium(request: PremiumCalculationRequest, db: Session = Depends(get_db)):
    """
    Calculate the insurance premium based on crop type, season, and land area.
    """
    try:
        result = InsuranceService.calculate_premium(
            db=db,
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

@router.post("/create-payment-intent", response_model=PaymentIntentResponse)
def create_payment_intent(
    payment_data: PaymentIntentRequest,
    current_user = Depends(get_current_user_dependency)
):
    """Create a Stripe payment intent for policy purchase"""
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can create payment intents")

    # Convert premium to cents for Stripe (assuming premium is in dollars)
    amount_in_cents = int(payment_data.premium * 100)

    raw_metadata = {
        'farmer_id': str(current_user['id']),
        'crop_type': payment_data.crop_type,
        'season': payment_data.season,
        'scheme_id': str(payment_data.scheme_id) if payment_data.scheme_id else None,
        'proofs': str(payment_data.proofs) if payment_data.proofs else None
    }
    metadata = {k: v for k, v in raw_metadata.items() if v is not None}

    try:
        payment_intent = StripeService.create_payment_intent(
            amount=amount_in_cents,
            currency="inr", # Use INR to fix currency mismatch (premium * 100 paise)
            metadata=metadata
        )
        return PaymentIntentResponse(**payment_intent)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/confirm-payment", response_model=PolicyResponse)
def confirm_payment(
    confirmation_data: PaymentConfirmationRequest,
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Confirm payment and create policy after successful payment"""
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can confirm payments")

    try:
        # Verify payment intent status
        payment_status = StripeService.confirm_payment_intent(confirmation_data.payment_intent_id)

        if payment_status['status'] != 'succeeded':
            raise HTTPException(status_code=400, detail="Payment not completed")

        # Create policy after successful payment
        policy_data = PolicyCreate(
            crop_type=confirmation_data.crop_type,
            season=confirmation_data.season,
            premium=confirmation_data.premium,
            coverage=confirmation_data.coverage,
            scheme_id=confirmation_data.scheme_id,
            proofs=confirmation_data.proofs
        )

        return PolicyCRUD.create_policy(db, current_user["id"], policy_data)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/buy-policy", response_model=PolicyResponse)
def buy_policy(
    policy_data: PolicyCreate,
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Register a new policy for the farmer (legacy endpoint - use payment flow instead)"""
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

@router.post("/create-claim", response_model=ClaimResponse)
async def create_claim(
    policy_id: int = Form(...),
    crop_type: str = Form(...),
    disaster_type: str = Form(...),
    affected_area: float = Form(...),
    description: str = Form(None),
    files: List[UploadFile] = File(None),
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Submit a new insurance claim with optional photo evidence"""
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can submit claims")
    
    # Verify the policy belongs to the farmer
    policy = db.query(Policy).filter(Policy.id == policy_id, Policy.farmer_id == current_user["id"]).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found or access denied")
        
    # Process files (In real life, upload to S3. Here, we'll log them)
    file_paths = []
    if files:
        import os
        upload_dir = "uploads/claims"
        os.makedirs(upload_dir, exist_ok=True)
        for file in files:
            file_path = f"{upload_dir}/{policy_id}_{file.filename}"
            # In a real app, you'd save the file content:
            # with open(file_path, "wb") as f: f.write(await file.read())
            file_paths.append(file_path)

    claim_data = ClaimCreate(
        policy_id=policy_id,
        crop_type=crop_type,
        disaster_type=disaster_type,
        affected_area=affected_area,
        description=description
    )
    
    return ClaimCRUD.create_claim(db, current_user["id"], claim_data)


@router.post("/save-farm", response_model=SaveFarmResponse)
def save_farm(
    data: SaveFarmRequest,
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """
    Save a mapped farm for the current authenticated farmer.
    Supports point-and-click mapping from the web dashboard.
    """
    if current_user["role"] != UserRole.FARMER:
        raise AccessDenied("Only farmers can register farms")

    if len(data.boundary_points) < 3:
        raise HTTPException(
            status_code=422,
            detail="A farm boundary needs at least 3 GPS points to form a valid area."
        )

    # Use the authenticated user's ID for security
    farm = FarmCRUD.create_farm(
        db=db,
        farmer_id=current_user["id"],
        boundary_points=data.boundary_points,
        farm_name=data.farm_name,
        crop_type=data.crop_type,
    )

    return SaveFarmResponse(
        farm_id=farm.id,
        farmer_id=farm.farmer_id,
        farm_name=farm.farm_name,
        crop_type=farm.crop_type,
        area_acres=farm.area_acres or 0.0,
        message="Farm saved successfully"
    )
