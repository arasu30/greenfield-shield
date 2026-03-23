from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str
    role: UserRole = UserRole.FARMER

class OTPLoginRequest(BaseModel):
    """OTP Login request schema"""
    phone: str = Field(..., min_length=10, max_length=10, pattern=r"^\d{10}$")
    otp: str = Field(..., min_length=6, max_length=6)

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
    phone: Optional[str] = Field(None, min_length=10, max_length=10, pattern=r"^\d{10}$")
    address: Optional[str] = None
    department: Optional[str] = None  # For officers
    officer_id: Optional[str] = None  # For officers
    
    # For farmers (mapping)
    farm_name: Optional[str] = None
    crop_type: Optional[str] = None
    # Boundary is a list of points: [{"lat": 1.2, "lng": 3.4}, ...]
    boundary: Optional[list[dict[str, float]]] = None

class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str

class ChangePasswordRequest(BaseModel):
    """Change password request"""
    old_password: str
    new_password: str
    confirm_password: str

class ProfileUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    phone: Optional[str] = Field(None, min_length=10, max_length=10, pattern=r"^\d{10}$")
    address: Optional[str] = None
    department: Optional[str] = None
    officer_id: Optional[str] = None
