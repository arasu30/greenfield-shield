from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class ClaimStatus(str, enum.Enum):
    PENDING = "Pending Review"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class DisasterType(str, enum.Enum):
    FLOOD = "Flood"
    DROUGHT = "Drought"
    PEST_ATTACK = "Pest Attack"
    CYCLONE = "Cyclone"
    HAILSTORM = "Hailstorm"
    FIRE = "Fire"

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=False)
    
    crop_type = Column(String, nullable=False)
    disaster_type = Column(SQLEnum(DisasterType), nullable=False)
    affected_area = Column(Float, nullable=True) # Changed from String to Float
    ai_damage = Column(Float, nullable=True)      # Damage percentage from AI
    confidence = Column(Float, nullable=True)     # AI confidence percentage
    
    status = Column(SQLEnum(ClaimStatus), default=ClaimStatus.PENDING, nullable=False)
    is_settled = Column(Boolean, default=False, nullable=False) # Payout tracking
    
    # Relationships
    farmer = relationship("User", back_populates="claims")
    policy = relationship("Policy", back_populates="claims")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Claim(id={self.id}, farmer_id={self.farmer_id}, status={self.status})>"
