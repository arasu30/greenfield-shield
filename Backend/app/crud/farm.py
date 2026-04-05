import logging
import os
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.shape import to_shape
from app.models.farm import Farm

# Logger for FarmCRUD
logger = logging.getLogger("FarmCRUD")

class FarmCRUD:
    @staticmethod
    def create_farm(
        db: Session, 
        farmer_id: int, 
        boundary_points: list, 
        farm_name: str = None, 
        crop_type: str = None,
        commit: bool = True
    ) -> Farm:
        try:
            # Filter for unique points to avoid geometry errors if the user stands still
            unique_points = []
            seen = set()
            for p in boundary_points:
                # Use dot notation for Pydantic objects
                lat, lng = p.lat, p.lng
                point_tuple = (round(lng, 6), round(lat, 6))
                if point_tuple not in seen:
                    unique_points.append(p)
                    seen.add(point_tuple)
            
            if len(unique_points) < 3:
                logger.error(f"Insufficient unique points: {len(unique_points)}")
                raise ValueError("A farm boundary must have at least 3 distinct unique locations.")

            # Ensure the polygon is closed
            coords = [(p.lng, p.lat) for p in unique_points]
            coords.append(coords[0])

            wkt_coords = ", ".join([f"{lng} {lat}" for lng, lat in coords])
            wkt = f"POLYGON(({wkt_coords}))"

            new_farm = Farm(
                farmer_id=farmer_id,
                farm_name=farm_name,
                crop_type=crop_type,
                boundary=f"SRID=4326;{wkt}"
            )

            db.add(new_farm)
            if commit:
                db.commit()
                db.refresh(new_farm)
            else:
                db.flush()
            
            # Use func.ST_Area to query the committed row's geography
            # ST_Area(geography) returns square meters
            area_sqm = db.query(func.ST_Area(Farm.boundary)).filter(Farm.id == new_farm.id).scalar()
            
            if area_sqm is not None:
                new_farm.area_acres = area_sqm / 4046.86
            else:
                new_farm.area_acres = 0.0
            
            if commit:
                db.commit()
                db.refresh(new_farm)
            else:
                db.flush()
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

    @staticmethod
    def get_boundary_points(farm: Farm) -> list[dict[str, float]]:
        """Extract lat/lng points from the farm's boundary geography."""
        try:
            if not farm.boundary:
                return []
            
            # Convert WKBElement to shapely geometry
            shape = to_shape(farm.boundary)
            
            # Get exterior coords (lng, lat)
            coords = list(shape.exterior.coords)
            
            # Return as list of {lat, lng} for the frontend
            return [{"lat": lat, "lng": lng} for lng, lat in coords]
        except Exception as e:
            logger.error(f"Error parsing boundary points: {str(e)}")
            return []
