from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class ClaimStatus(str, enum.Enum):
    PENDING = "Pending Review"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=False)
    
    crop_type = Column(String, nullable=False)
    disaster_type = Column(String, nullable=False)
    affected_area = Column(String, nullable=True) # e.g. "3.5 acres"
    ai_damage = Column(Float, nullable=True)      # Damage percentage from AI
    confidence = Column(Float, nullable=True)     # AI confidence percentage
    
    status = Column(SQLEnum(ClaimStatus), default=ClaimStatus.PENDING, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Claim(id={self.id}, farmer_id={self.farmer_id}, status={self.status})>"
