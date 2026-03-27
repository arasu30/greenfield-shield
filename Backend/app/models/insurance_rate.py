from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class InsuranceRate(Base):
    __tablename__ = "insurance_rates"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_type = Column(String, nullable=False)
    season = Column(String, nullable=False)
    base_rate = Column(Float, nullable=False) # Premium percentage (e.g., 2.5 for 2.5%)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<InsuranceRate(crop={self.crop_type}, season={self.season}, rate={self.base_rate}%)>"
