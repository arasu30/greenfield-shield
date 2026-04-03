from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class PolicyStatus(str, enum.Enum):
    ACTIVE = "Active"
    EXPIRED = "Expired"
    PENDING = "Pending"

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=True) # Link to scheme
    crop_type = Column(String, nullable=False)
    season = Column(String, nullable=False)
    premium = Column(Float, nullable=False)
    coverage = Column(Float, nullable=False)
    status = Column(SQLEnum(PolicyStatus), default=PolicyStatus.ACTIVE, nullable=False)
    
    # Relationships
    farmer = relationship("User", back_populates="policies")
    claims = relationship("Claim", back_populates="policy")
    
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Policy(id={self.id}, farmer_id={self.farmer_id}, crop={self.crop_type})>"
