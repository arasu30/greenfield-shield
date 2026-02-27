import logging
import os
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.farm import Farm

# Configure logging to a file
log_file = os.path.join(os.getcwd(), "registration_debug.log")
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("FarmCRUD")

class FarmCRUD:
    @staticmethod
    def create_farm(
        db: Session, 
        farmer_id: int, 
        boundary_points: list[dict[str, float]], 
        farm_name: str = None, 
        crop_type: str = None
    ) -> Farm:
        logger.info(f"Starting create_farm for farmer_id: {farmer_id}")
        
        try:
            # Filter for unique points to avoid geometry errors if the user stands still
            unique_points = []
            seen = set()
            for p in boundary_points:
                point_tuple = (round(p["lng"], 6), round(p["lat"], 6))
                if point_tuple not in seen:
                    unique_points.append(p)
                    seen.add(point_tuple)

            if len(unique_points) < 3:
                logger.error(f"Insufficient unique points: {len(unique_points)}")
                raise ValueError("A farm boundary must have at least 3 distinct unique locations.")

            # Ensure the polygon is closed
            coords = [(p["lng"], p["lat"]) for p in unique_points]
            coords.append(coords[0])

            wkt_coords = ", ".join([f"{lng} {lat}" for lng, lat in coords])
            wkt = f"POLYGON(({wkt_coords}))"
            
            logger.info(f"WKT prepared successfully")

            new_farm = Farm(
                farmer_id=farmer_id,
                farm_name=farm_name,
                crop_type=crop_type,
                boundary=f"SRID=4326;{wkt}"
            )

            db.add(new_farm)
            db.commit()
            db.refresh(new_farm)
            
            # Calculate area in acres using PostGIS ST_Area
            # ST_Area(geograph) returns square meters
            area_sqm = db.query(func.ST_Area(new_farm.boundary)).scalar()
            new_farm.area_acres = area_sqm / 4046.86
            
            db.commit()
            db.refresh(new_farm)
            logger.info(f"Farm created with ID: {new_farm.id}, Area: {new_farm.area_acres} acres")
            return new_farm

        except Exception as e:
            logger.error(f"Error in create_farm: {str(e)}", exc_info=True)
            db.rollback()
            raise e

    @staticmethod
    def get_farms_by_farmer(db: Session, farmer_id: int) -> list[Farm]:
        return db.query(Farm).filter(Farm.farmer_id == farmer_id).all()

    @staticmethod
    def get_farm_by_id(db: Session, farm_id: int) -> Farm:
        """Get a farm by its ID, including boundary geometry."""
        return db.query(Farm).filter(Farm.id == farm_id).first()
