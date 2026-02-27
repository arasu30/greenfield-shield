from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .config import settings
from .database.session import engine
from .database.base import Base
from .api.routes import auth
from .api.routes import model
from .api.routes import damage
from .api.routes import crop_assessment

from contextlib import asynccontextmanager

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup tasks"""
    # Create initial admin user if not exists
    from app.database.session import SessionLocal
    from app.crud.user import UserCRUD
    from app.models.user import UserRole
    
    db = SessionLocal()
    try:
        admin_email = settings.ADMIN_EMAIL
        admin_password = settings.ADMIN_PASSWORD
        
        user = UserCRUD.get_user_by_email(db, admin_email)
        if not user:
            print(f"Creating initial admin user: {admin_email}")
            UserCRUD.create_user(
                db=db,
                email=admin_email,
                full_name="System Administrator",
                password=admin_password,
                role=UserRole.ADMIN
            )
        else:
            print(f"Admin user {admin_email} already exists")
    except Exception as e:
        print(f"Error seeding admin user: {e}")
    finally:
        db.close()
    
    yield

# Initialize FastAPI app
app = FastAPI(
    title="Cropsure",
    description="Crop Insurance Management System with Geospatial Support",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="http://localhost:.*",  # Allow any port on localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Relax trusted host middleware for development
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(model.router)
app.include_router(damage.router)
app.include_router(crop_assessment.router)

@app.get("/", tags=["Health"])
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Cropsure",
        "version": "1.0.0",
        "status": "running",
    }

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
