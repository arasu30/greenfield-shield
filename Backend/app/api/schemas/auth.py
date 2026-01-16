from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    full_name: str
    role: UserRole
    phone: Optional[str]
    address: Optional[str]
    is_active: bool
    is_verified: bool
    department: Optional[str]
    officer_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    """Complete login response"""
    user: UserResponse
    tokens: TokenResponse
    message: str = "Login successful"

class RegisterRequest(BaseModel):
    """Registration request schema"""
    email: EmailStr
    full_name: str
    password: str
    role: UserRole = UserRole.FARMER
    phone: Optional[str] = None
    address: Optional[str] = None
    department: Optional[str] = None  # For officers
    officer_id: Optional[str] = None  # For officers

class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str

class ChangePasswordRequest(BaseModel):
    """Change password request"""
    old_password: str
    new_password: str
    confirm_password: str
