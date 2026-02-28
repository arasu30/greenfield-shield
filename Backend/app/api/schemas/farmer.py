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
