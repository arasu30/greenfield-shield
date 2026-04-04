from pydantic import BaseModel
from typing import List, Optional

class DashboardStat(BaseModel):
    title: str
    value: str
    sub: str
    icon: str
    color: str
    bg: str
    border: str

class FarmInfo(BaseModel):
    name: Optional[str] = None
    area: Optional[float] = None
    crop_type: Optional[str] = None
    boundary: List[dict] = []

class FarmerDashboardStats(BaseModel):
    full_name: str
    farm_area_acres: float
    stats: List[DashboardStat]
    farms: List[FarmInfo] = []


# ── Add these two classes to your existing farmer.py schema ──

class BoundaryPoint(BaseModel):
    lat: float
    lng: float

class SaveFarmRequest(BaseModel):
    farmer_id: int
    farm_name: Optional[str] = "My Farm"
    crop_type: Optional[str] = None
    insurance_id: Optional[str] = None
    boundary_points: List[BoundaryPoint]

class SaveFarmResponse(BaseModel):
    farm_id: int
    farmer_id: int
    farm_name: Optional[str]
    crop_type: Optional[str]
    area_acres: float
    message: str