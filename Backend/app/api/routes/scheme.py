from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.schemas.scheme import SchemeCreate, SchemeResponse
from app.crud import scheme as crud_scheme
from app.api.routes.auth import get_current_user_dependency
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/", response_model=List[SchemeResponse])
def read_schemes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all active agricultural schemes.
    Available to all authenticated users.
    """
    schemes = crud_scheme.get_schemes(db, skip=skip, limit=limit, active_only=True)
    return schemes

@router.post("/", response_model=SchemeResponse)
def create_scheme(
    scheme: SchemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dependency)
):
    """
    Create a new agricultural scheme.
    Only accessible by admin or officer roles.
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.OFFICER]:
        raise HTTPException(status_code=403, detail="Not authorized.")
    return crud_scheme.create_scheme(db=db, scheme=scheme)

@router.patch("/{scheme_id}", response_model=SchemeResponse)
def update_scheme(
    scheme_id: int,
    scheme_data: SchemeCreate, # Can reused SchemeCreate or make a new partial schema
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin only")
    return crud_scheme.update_scheme(db, scheme_id, scheme_data.model_dump())

@router.delete("/{scheme_id}")
def delete_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_dependency)
):
    if current_user.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin only")
    success = crud_scheme.delete_scheme(db, scheme_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {"message": "Scheme deactivated"}
