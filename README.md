## CropSure – Crop Damage Estimation & Insurance Support System

CropSure is a smart crop insurance management platform designed to help farmers report crop damage, estimate losses, and receive timely insurance support. The system uses geospatial data, automated assessments, and secure workflows to connect farmers, field officers, and administrators in a transparent and efficient manner.

## Features

- **User Authentication**: JWT-based login for Farmers, Officers, and Admins
- **Role-Based Access Control**: Different endpoints for different user roles
- **Geospatial Support**: PostGIS integration for location-based queries
- **Database**: PostgreSQL with PostGIS extension
- **API Documentation**: Auto-generated Swagger UI

## ⚙️ Setup

1️⃣ Install Dependencies
- pip install -r requirements.txt

2️⃣ Configure Environment
- cp .env.example .env
- Edit .env:
- DATABASE_URL=postgresql://postgres:password@localhost:5432/cropsure
- SECRET_KEY=your_secret_key

▶️ Run Backend Server (First)
- Start the FastAPI backend:
- cd Backend
- uvicorn app.main:app --reload

Backend will run at:
- http://localhost:8000

API Docs:
- http://localhost:8000/docs

▶️ Run Frontend (After Backend)
- After the backend is running, start the frontend project:
- cd Frontend
- npm install
- npm run dev

Frontend will run at:
- http://localhost:3000


**Make sure backend is running before starting frontend.**

👥 User Roles
**Role --> Access**
- Farmer --> Submit damage reports, claim insurance
- Officer --> Verify damage, approve claims
- Admin --> Manage system and users

## 🔒 Security Notes

- Use strong SECRET_KEY
- Keep .env private
- Enable HTTPS in production

## 📜 License
MIT
