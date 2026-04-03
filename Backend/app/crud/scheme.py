from sqlalchemy.orm import Session
from app.models.scheme import Scheme
from app.api.schemas.scheme import SchemeCreate

def get_scheme(db: Session, scheme_id: int):
    return db.query(Scheme).filter(Scheme.id == scheme_id).first()

def get_schemes(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(Scheme)
    if active_only:
        query = query.filter(Scheme.is_active == True)
    return query.offset(skip).limit(limit).all()

def create_scheme(db: Session, scheme: SchemeCreate):
    db_scheme = Scheme(
        name=scheme.name,
        description=scheme.description,
        eligibility_criteria=scheme.eligibility_criteria,
        benefits=scheme.benefits,
        required_documents=scheme.required_documents,
        is_active=scheme.is_active
    )
    db.add(db_scheme)
    db.commit()
    db.refresh(db_scheme)
    return db_scheme

def update_scheme(db: Session, scheme_id: int, scheme_data: dict):
    db_scheme = get_scheme(db, scheme_id)
    if db_scheme:
        for key, value in scheme_data.items():
            setattr(db_scheme, key, value)
        db.commit()
        db.refresh(db_scheme)
    return db_scheme

def delete_scheme(db: Session, scheme_id: int):
    db_scheme = get_scheme(db, scheme_id)
    if db_scheme:
        db_scheme.is_active = False # Soft delete
        db.commit()
        return True
    return False
