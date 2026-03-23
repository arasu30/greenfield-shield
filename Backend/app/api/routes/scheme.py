from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.schemas.scheme import SchemeCreate, SchemeResponse
from app.crud import scheme as crud_scheme
from app.api.routes.auth import get_current_user_dependency
from app.models.user import User

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
    if current_user.role not in ["admin", "officer"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to create schemes."
        )
    return crud_scheme.create_scheme(db=db, scheme=scheme)
