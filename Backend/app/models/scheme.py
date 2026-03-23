from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class Scheme(Base):
    __tablename__ = "schemes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    description = Column(String, nullable=False)
    eligibility_criteria = Column(String, nullable=True) # Text describing eligibility
    benefits = Column(String, nullable=True)             # Text describing benefits
    required_documents = Column(String, nullable=True)   # Comma separated or text
    
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Scheme(id={self.id}, name={self.name}, is_active={self.is_active})>"
