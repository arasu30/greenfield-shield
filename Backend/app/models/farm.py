from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from geoalchemy2 import Geography
from app.database.base import Base

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    farm_name = Column(String, nullable=True)
    crop_type = Column(String, nullable=True)
    
    # The spatial boundary of the farm
    # Using Geography type for accurate area calculations in acres
    # spatial_index=False ensures Alembic can manage the index explicitly
    boundary = Column(Geography(geometry_type='POLYGON', srid=4326, spatial_index=False), nullable=False)
    
    # Store calculated area for quick access
    area_acres = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Farm(id={self.id}, farmer_id={self.farmer_id}, name={self.farm_name})>"
