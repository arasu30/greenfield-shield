from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class GEEDamageRequest(BaseModel):
    asset_id: str
    # region can be a GeoJSON geometry or bounding box as a list of coords
    region: Any
    scale: Optional[int] = 30


class DamageResponse(BaseModel):
    damage: int  # 0 or 1
    explanation: Optional[str] = None
