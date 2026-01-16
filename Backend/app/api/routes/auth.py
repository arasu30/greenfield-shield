from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    TokenResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
)
from app.services.auth_service import AuthService
from app.models.user import UserRole
from app.utils.errors import InvalidToken, AccessDenied

# OAuth2 scheme for JWT
oauth2_scheme = HTTPBearer()


# Dependency to get current user from JWT token
def get_current_user_dependency(credentials = Depends(oauth2_scheme)):
    """Dependency for getting current user"""
    if not credentials:
        raise InvalidToken()
    
    payload = AuthService.verify_access_token(credentials.credentials)
    
    if not payload:
        raise InvalidToken()
    
    return {
        "id": int(payload.get("sub")),
        "email": payload.get("email"),
        "role": payload.get("role"),
    }


def require_role(*roles):
    """Dependency to require specific roles"""
    def role_checker(current_user = Depends(get_current_user_dependency)):
        if current_user["role"] not in roles:
            raise AccessDenied(f"This action requires one of these roles: {', '.join(roles)}")
        
        return current_user
    
    return role_checker


router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login endpoint for farmers, officers, and admins
    
    Returns user data and JWT tokens (access_token + refresh_token)
    """
    result = AuthService.login(db, credentials.email, credentials.password)
    
    return LoginResponse(
        user=result["user"],
        tokens=TokenResponse(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            expires_in=result["expires_in"],
        ),
    )

@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user (farmer, officer, or admin)
    
    For officers: Include department and officer_id
    """
    result = AuthService.register(
        db=db,
        email=user_data.email,
        full_name=user_data.full_name,
        password=user_data.password,
        role=user_data.role,
        phone=user_data.phone,
        address=user_data.address,
        department=user_data.department,
        officer_id=user_data.officer_id,
    )
    
    return LoginResponse(
        user=result["user"],
        tokens=TokenResponse(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            expires_in=result["expires_in"],
        ),
    )

@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def refresh_token(
    request: RefreshTokenRequest,
):
    """
    Refresh access token using refresh token
    """
    result = AuthService.refresh_access_token(request.refresh_token)
    
    return TokenResponse(
        access_token=result["access_token"],
        expires_in=result["expires_in"],
    )

@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    request: ChangePasswordRequest,
    current_user = Depends(get_current_user_dependency),
    db: Session = Depends(get_db),
):
    """
    Change user password
    """
    if request.new_password != request.confirm_password:
        raise ValueError("Passwords do not match")
    
    result = AuthService.change_password(
        db,
        current_user["id"],
        request.old_password,
        request.new_password,
    )
    
    return result

