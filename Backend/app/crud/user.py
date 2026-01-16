from sqlalchemy.orm import Session
from sqlalchemy import update
from datetime import datetime, timezone
from app.models.user import User, UserRole
from app.utils.security import hash_password

class UserCRUD:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_officer_id(db: Session, officer_id: str) -> User:
        """Get user by officer ID"""
        return db.query(User).filter(User.officer_id == officer_id).first()
    
    @staticmethod
    def create_user(
        db: Session,
        email: str,
        full_name: str,
        password: str,
        role: UserRole = UserRole.FARMER,
        phone: str = None,
        address: str = None,
        department: str = None,
        officer_id: str = None,
    ) -> User:
        """Create a new user"""
        db_user = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            role=role,
            phone=phone,
            address=address,
            department=department,
            officer_id=officer_id,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update_last_login(db: Session, user_id: int):
        """Update user's last login timestamp"""
        db.execute(
            update(User)
            .where(User.id == user_id)
            .values(last_login=datetime.now(timezone.utc))
        )
        db.commit()
    
    @staticmethod
    def update_user(db: Session, user_id: int, **kwargs) -> User:
        """Update user fields"""
        db.execute(
            update(User)
            .where(User.id == user_id)
            .values(**kwargs)
        )
        db.commit()
        return UserCRUD.get_user_by_id(db, user_id)
    
    @staticmethod
    def change_password(db: Session, user_id: int, new_password: str):
        """Change user password"""
        db.execute(
            update(User)
            .where(User.id == user_id)
            .values(password_hash=hash_password(new_password))
        )
        db.commit()
    
    @staticmethod
    def get_officers(db: Session) -> list[User]:
        """Get all officers"""
        return db.query(User).filter(User.role == UserRole.OFFICER).all()
    
    @staticmethod
    def get_active_users(db: Session) -> list[User]:
        """Get all active users"""
        return db.query(User).filter(User.is_active == True).all()
