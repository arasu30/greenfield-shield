from sqlalchemy.orm import Session
from datetime import timedelta
from app.models.user import User, UserRole
from app.crud.user import UserCRUD
from app.utils.security import (
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.utils.errors import (
    InvalidCredentialsException,
    UserAlreadyExists,
    AccessDenied,
)
from app.config import settings

class AuthService:
    @staticmethod
    def login(db: Session, email: str, password: str, role: UserRole = UserRole.FARMER) -> dict:
        """Authenticate user and return tokens. If an officer/admin logs in for the first time
        and the user record does not exist, create the user in the database so credentials
        are stored in PostgreSQL.
        """
        # Get user by email
        user = UserCRUD.get_user_by_email(db, email)

        # If user doesn't exist and role is officer/admin, create the user automatically
        if not user and role in (UserRole.OFFICER, UserRole.ADMIN):
            # derive a display name from email if full_name is not provided
            derived_name = email.split("@")[0].replace('.', ' ').title()
            user = UserCRUD.create_user(
                db=db,
                email=email,
                full_name=derived_name,
                password=password,
                role=role,
            )

        # Validate credentials
        if not user or not verify_password(password, user.password_hash):
            raise InvalidCredentialsException()
        
        if not user.is_active:
            raise AccessDenied("User account is inactive")
        
        # Update last login
        UserCRUD.update_last_login(db, user.id)
        
        # Create tokens
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role.value,
                "type": "access",
            }
        )
        
        refresh_token = create_refresh_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "type": "refresh",
            }
        )
        
        return {
            "user": user,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }
    
    @staticmethod
    def register(
        db: Session,
        email: str,
        full_name: str,
        password: str,
        role: UserRole = UserRole.FARMER,
        phone: str = None,
        address: str = None,
        department: str = None,
        officer_id: str = None,
    ) -> dict:
        """Register a new user"""
        # Check if user already exists
        if UserCRUD.get_user_by_email(db, email):
            raise UserAlreadyExists()
        
        # Check if officer_id already exists (for officers)
        if officer_id and UserCRUD.get_user_by_officer_id(db, officer_id):
            raise UserAlreadyExists()
        
        # Create user
        user = UserCRUD.create_user(
            db=db,
            email=email,
            full_name=full_name,
            password=password,
            role=role,
            phone=phone,
            address=address,
            department=department,
            officer_id=officer_id,
        )
        
        # Create tokens
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role.value,
                "type": "access",
            }
        )
        
        refresh_token = create_refresh_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "type": "refresh",
            }
        )
        
        return {
            "user": user,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }
    
    @staticmethod
    def refresh_access_token(refresh_token: str) -> dict:
        """Generate new access token from refresh token"""
        payload = verify_token(refresh_token)
        
        if not payload or payload.get("type") != "refresh":
            raise InvalidCredentialsException()
        
        user_id = int(payload.get("sub"))
        email = payload.get("email")
        
        access_token = create_access_token(
            data={
                "sub": str(user_id),
                "email": email,
                "type": "access",
            }
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }
    
    @staticmethod
    def verify_access_token(token: str) -> dict:
        """Verify access token and return payload"""
        payload = verify_token(token)
        
        if not payload or payload.get("type") != "access":
            raise InvalidCredentialsException()
        
        return payload
    
    @staticmethod
    def change_password(db: Session, user_id: int, old_password: str, new_password: str):
        """Change user password"""
        user = UserCRUD.get_user_by_id(db, user_id)
        
        if not user or not verify_password(old_password, user.password_hash):
            raise InvalidCredentialsException()
        
        UserCRUD.change_password(db, user_id, new_password)
        return {"message": "Password changed successfully"}
