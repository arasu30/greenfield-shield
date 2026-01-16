# Quick Start Guide

## 1. Setup PostgreSQL Database

### Option A: Using Docker (Recommended)

```bash
cd Backend
docker-compose up -d
```

This starts:
- **PostgreSQL**: localhost:5432
- **pgAdmin**: localhost:5050 (admin@greenfield.com / admin)
- **API**: localhost:8000

### Option B: Manual Installation

1. Install PostgreSQL with PostGIS
2. Create database:

```bash
psql -U postgres

CREATE DATABASE greenfield_shield;
\c greenfield_shield
CREATE EXTENSION postgis;
\q
```

## 2. Install Backend Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

## 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/greenfield_shield
SECRET_KEY=your_super_secret_key_change_in_production
```

## 4. Run Backend

```bash
python main.py
```

API runs on: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

## 5. Test Login Endpoints

### Create Test User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "officer@test.com",
    "full_name": "Test Officer",
    "password": "test123",
    "role": "officer",
    "department": "Assessment",
    "officer_id": "OFF-001"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "officer@test.com",
    "password": "test123"
  }'
```

## 6. Connect Frontend

Update `src/services/authService.ts`:

```typescript
const API_BASE = 'http://localhost:8000/api';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

## File Structure Created

```
Backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   └── auth.py              ✓ Login/Register endpoints
│   │   └── schemas/
│   │       └── auth.py              ✓ Request/Response models
│   ├── models/
│   │   └── user.py                  ✓ User database model
│   ├── crud/
│   │   └── user.py                  ✓ Database operations
│   ├── services/
│   │   └── auth_service.py          ✓ Auth business logic
│   ├── utils/
│   │   ├── security.py              ✓ JWT & password hashing
│   │   └── errors.py                ✓ Custom exceptions
│   ├── database/
│   │   ├── session.py               ✓ DB connection
│   │   └── base.py                  ✓ SQLAlchemy setup
│   ├── config.py                    ✓ Environment config
│   └── main.py                      ✓ FastAPI app
├── requirements.txt                 ✓ Dependencies
├── .env                             ✓ Environment variables
├── docker-compose.yml               ✓ Docker setup
├── Dockerfile                       ✓ Container config
└── README.md                        ✓ Documentation
```

## Next Steps

1. **Admin Panel Backend**: Create admin-specific endpoints
2. **Officer Review**: Create claim review endpoints  
3. **Policies**: Add policy CRUD endpoints
4. **Claims**: Add claim filing and processing
5. **PostGIS**: Add geospatial queries for farm verification

## Useful Commands

```bash
# View API docs
open http://localhost:8000/docs

# View database with pgAdmin
open http://localhost:5050

# Logs
docker-compose logs -f backend

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Stop services
docker-compose down
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check PostgreSQL is running on port 5432 |
| Invalid token | Make sure SECRET_KEY matches in .env |
| CORS error | Check FRONTEND_URL in .env matches your frontend |
| Port 8000 in use | Kill process: `lsof -i :8000 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/change-password` | Change password |

More endpoints coming for policies, claims, crops, and geospatial queries!
