from pydantic import BaseModel
from typing import Any, Optional, List


class CropDamageRequest(BaseModel):
    farm_id: int
    gee_asset_id: Optional[str] = "LANDSAT/LC08/C02/T1_L2"
    scale: Optional[int] = 30


class CropDamageResponse(BaseModel):
    farm_id: int
    farm_name: Optional[str]
    crop_type: Optional[str]
    area_acres: Optional[float]
    geotiff_shape: tuple
    damage_prediction: int  # 0 or 1
    nasnet_predictions: Optional[List[dict]] = None
    gee_asset_used: str
    message: Optional[str] = None
