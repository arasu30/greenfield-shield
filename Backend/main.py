"""
Entry point for the FastAPI application
Run with: python main.py
Or with: uvicorn app.main:app --reload
"""

import uvicorn
from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
