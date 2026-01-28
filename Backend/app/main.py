from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config import settings
from app.database.session import engine
from app.database.base import Base
from app.api.routes import auth

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Greenfield Shield API",
    description="Crop Insurance Management System with Geospatial Support",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:8000", "http://localhost:5173","http://localhost:8080","http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[settings.HOST, "localhost", "127.0.0.1"],
)

# Include routes
app.include_router(auth.router)

@app.get("/", tags=["Health"])
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Greenfield Shield API",
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
