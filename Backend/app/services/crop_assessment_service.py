import logging
import tempfile
from pathlib import Path

from sqlalchemy.orm import Session

from app.crud.farm import FarmCRUD
from app.services import gee_service, damage_service, nasnet_service

logger = logging.getLogger(__name__)


def assess_crop_damage_for_farm(
    db: Session,
    farm_id: int,
    gee_asset_id: str = "LANDSAT/LC08/C02/T1_L2",
    scale: int = 30,
) -> dict:
    """Complete pipeline: fetch farm -> GEE -> NPZ -> model prediction.
    
    Args:
        db: database session
        farm_id: ID of the farm to assess
        gee_asset_id: Google Earth Engine asset ID (default: Landsat 8 Collection 2)
        scale: spatial resolution in meters (default: 30)
    
    Returns:
        dict with farm info, GeoTIFF data, and damage prediction
    """
    
    try:
        # Step 1: Fetch farm from database
        logger.info(f"Fetching farm {farm_id} from database")
        farm = FarmCRUD.get_farm_by_id(db, farm_id)
        
        if not farm:
            raise ValueError(f"Farm with ID {farm_id} not found")
        
        logger.info(f"Farm found: {farm.farm_name}, crop: {farm.crop_type}")
        
        # Step 2: Extract coordinates from farm boundary
        logger.info("Extracting coordinates from farm boundary")
        region = gee_service.extract_coordinates_from_farm_boundary(farm)
        logger.info(f"Region extracted: {region}")
        
        # Step 3: Fetch GeoTIFF from Google Earth Engine
        logger.info(f"Fetching GeoTIFF from GEE asset: {gee_asset_id}")
        geotiff_array = gee_service.fetch_geotiff_as_array(
            asset_id=gee_asset_id,
            region=region,
            scale=scale
        )
        logger.info(f"GeoTIFF fetched, array shape: {geotiff_array.shape}")
        
        # Step 4: Convert array to NPZ (save temporarily)
        with tempfile.NamedTemporaryFile(suffix=".npz", delete=False) as tmp:
            npz_path = gee_service.convert_array_to_npz(geotiff_array, tmp.name)
            logger.info(f"NPZ saved to {npz_path}")
        
        # Step 5: Preprocess to model input (ndvi, vv, red)
        from app.services import preprocessing
        try:
            model_input = preprocessing.make_model_input_from_bands(geotiff_array)
        except Exception as e:
            # if preprocessing fails, fallback to raw array
            logger.warning(f"Preprocessing failed, using raw array: {e}")
            model_input = geotiff_array

        # Step 6: Run damage prediction using the Keras model
        logger.info("Running damage prediction on prepared data")
        damage_prediction = damage_service.predict_damage_from_array(model_input)
        logger.info(f"Damage prediction: {damage_prediction}")
        
        # Optional: also try NASNet if we have a visual representation
        # This would require converting the multispectral array to RGB
        nasnet_result = None
        try:
            # Convert multispectral to RGB for NASNet (simple approach: use first 3 bands)
            if geotiff_array.shape[0] >= 3:
                rgb_array = geotiff_array[:3, :, :]  # Take first 3 bands
                # Normalize to 0-255 range
                rgb_array = ((rgb_array - rgb_array.min()) / (rgb_array.max() - rgb_array.min()) * 255).astype('uint8')
                
                # Convert to PIL Image and then to bytes for NASNet
                import numpy as np
                from PIL import Image
                from io import BytesIO
                
                if rgb_array.shape[0] == 3:
                    # Transpose to (height, width, channels) for PIL
                    rgb_img = np.transpose(rgb_array, (1, 2, 0))
                    pil_img = Image.fromarray(rgb_img, mode='RGB')
                    
                    # Convert to bytes
                    img_bytes = BytesIO()
                    pil_img.save(img_bytes, format='JPEG')
                    img_bytes.seek(0)
                    
                    nasnet_result = nasnet_service.predict_image(img_bytes.getvalue())
                    logger.info(f"NASNet prediction: {nasnet_result}")
        except Exception as e:
            logger.warning(f"NASNet prediction failed (not critical): {e}")
        
        return {
            "farm_id": farm.id,
            "farm_name": farm.farm_name,
            "crop_type": farm.crop_type,
            "area_acres": farm.area_acres,
            "geotiff_shape": geotiff_array.shape,
            "npz_path": npz_path,
            "damage_prediction": damage_prediction,
            "nasnet_predictions": nasnet_result,
            "gee_asset_used": gee_asset_id,
            "region": region
        }
        
    except Exception as e:
        logger.error(f"Error in assess_crop_damage_for_farm: {e}", exc_info=True)
        raise
