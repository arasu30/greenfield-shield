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

        # Validate user exists
        if not user:
            raise InvalidCredentialsException("Invalid email or password")
        
        # Validate credentials
        if not verify_password(password, user.password_hash):
            raise InvalidCredentialsException("Invalid email or password")
        
        if not user.is_active:
            raise AccessDenied("User account is inactive")
        
        # Update last login
        UserCRUD.update_last_login(db, user.id)
        
        # Create tokens
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value,
                "phone": user.phone,
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
    def login_by_phone(db: Session, phone: str, otp: str) -> dict:
        """Authenticate user by phone number and OTP.
        For development, any 6-digit OTP is accepted if user exists.
        """
        # Get user by phone
        user = UserCRUD.get_user_by_phone(db, phone)

        if not user:
            raise InvalidCredentialsException("User with this phone number not found")

        if not user.is_active:
            raise AccessDenied("User account is inactive")
        
        # In real life, verify OTP here. For simulation:
        if len(otp) != 6:
            raise InvalidCredentialsException("Invalid OTP format")
        
        # Update last login
        UserCRUD.update_last_login(db, user.id)
        
        # Create tokens
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value,
                "phone": user.phone,
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
        # Farm mapping data
        farm_name: str = None,
        crop_type: str = None,
        boundary: list[dict[str, float]] = None,
    ) -> dict:
        """Register a new user"""
        print(f"DEBUG: AuthService.register called for {email}")
        from app.crud.farm import FarmCRUD

        # Check if user already exists
        if UserCRUD.get_user_by_email(db, email):
            print(f"DEBUG: User {email} already exists")
            raise UserAlreadyExists()
        
        # Check if officer_id already exists (for officers)
        if officer_id and UserCRUD.get_user_by_officer_id(db, officer_id):
            raise UserAlreadyExists()
        
        # Create user
        try:
            print("DEBUG: Creating user record in UserCRUD...")
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
                commit=False # DO NOT COMMIT YET
            )
            print(f"DEBUG: User record created. ID: {user.id}")

            # If user is a farmer and provided a boundary, create the farm record
            if role == UserRole.FARMER and boundary:
                print("DEBUG: User is a farmer. Starting FarmCRUD.create_farm...")
                FarmCRUD.create_farm(
                    db=db,
                    farmer_id=user.id,
                    boundary_points=boundary,
                    farm_name=farm_name or f"{full_name}'s Farm",
                    crop_type=crop_type,
                    commit=False # DO NOT COMMIT YET
                )
                print("DEBUG: FarmCRUD.create_farm finished successfully")
            
            db.commit() # Atomic commit for both user and farm
            db.refresh(user)
        except Exception as e:
            db.rollback()
            print(f"DEBUG: Registration failed, rolling back. Error: {e}")
            raise e
        
        # Create tokens
        print("DEBUG: Creating tokens for login...")
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value,
                "phone": user.phone,
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
    def refresh_access_token(db: Session, refresh_token: str) -> dict:
        """Generate new access token from refresh token"""
        payload = verify_token(refresh_token)
        
        if not payload or payload.get("type") != "refresh":
            raise InvalidCredentialsException()
        
        user_id = int(payload.get("sub"))
        user = UserCRUD.get_user_by_id(db, user_id)
        
        if not user or not user.is_active:
             raise InvalidCredentialsException()

        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role.value,
                "phone": user.phone,
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
