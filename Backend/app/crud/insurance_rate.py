from sqlalchemy.orm import Session
from sqlalchemy import update
from app.models.insurance_rate import InsuranceRate

def get_rates(db: Session, skip: int = 0, limit: int = 100):
    """Get all insurance rates"""
    return db.query(InsuranceRate).offset(skip).limit(limit).all()

def get_rate_by_crop_and_season(db: Session, crop_type: str, season: str):
    """Get specific rate"""
    return db.query(InsuranceRate).filter(
        InsuranceRate.crop_type == crop_type,
        InsuranceRate.season == season
    ).first()

def upsert_rate(db: Session, crop_type: str, season: str, base_rate: float):
    """Create or update a rate"""
    db_rate = get_rate_by_crop_and_season(db, crop_type, season)
    if db_rate:
        db_rate.base_rate = base_rate
    else:
        db_rate = InsuranceRate(crop_type=crop_type, season=season, base_rate=base_rate)
        db.add(db_rate)
    db.commit()
    db.refresh(db_rate)
    return db_rate

def delete_rate(db: Session, rate_id: int):
    """Delete a rate"""
    db_rate = db.query(InsuranceRate).filter(InsuranceRate.id == rate_id).first()
    if db_rate:
        db.delete(db_rate)
        db.commit()
        return True
    return False
