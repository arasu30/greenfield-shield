# Greenfield Shield - Backend API

FastAPI-based backend for crop insurance management system with PostgreSQL and PostGIS integration.

## Features

- **User Authentication**: JWT-based login for Farmers, Officers, and Admins
- **Role-Based Access Control**: Different endpoints for different user roles
- **Geospatial Support**: PostGIS integration for location-based queries
- **Database**: PostgreSQL with PostGIS extension
- **API Documentation**: Auto-generated Swagger UI

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/greenfield_shield
SECRET_KEY=your_super_secret_key_here
```

### 3. Set Up PostgreSQL Database

**Option A: Using Docker Compose (Recommended)**

```bash
docker-compose up -d
```

This will start:
- PostgreSQL with PostGIS (port 5432)
- pgAdmin (port 5050)
- FastAPI backend (port 8000)

**Option B: Manual Setup**

1. Install PostgreSQL with PostGIS
2. Create database:

```sql
CREATE DATABASE greenfield_shield;
CREATE EXTENSION postgis;
```

### 4. Run the Server

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Authentication Endpoints

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "officer@greenfield.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "officer@greenfield.com",
    "full_name": "John Officer",
    "role": "officer",
    "department": "Insurance",
    "officer_id": "OFF-001",
    "is_active": true,
    "is_verified": true,
    "created_at": "2026-01-16T10:00:00Z",
    "updated_at": "2026-01-16T10:00:00Z"
  },
  "tokens": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 1800
  },
  "message": "Login successful"
}
```

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@greenfield.com",
  "full_name": "Admin User",
  "password": "password123",
  "role": "admin",
  "department": "Management",
  "officer_id": "ADM-001"
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
```

### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "old_password": "password123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

## User Roles

1. **Farmer**: Can buy policies, file claims, view crop health
2. **Officer**: Can review claims, approve/reject, manage assessments
3. **Admin**: Full system access, user management, settings

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  phone VARCHAR,
  address VARCHAR,
  department VARCHAR,
  officer_id VARCHAR UNIQUE,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

## Testing

Run tests:

```bash
pytest
```

With coverage:

```bash
pytest --cov=app
```

## Development

### Add New Endpoint

1. Create schema in `app/api/schemas/`
2. Create route in `app/api/routes/`
3. Add CRUD operations in `app/crud/`
4. Add business logic in `app/services/`

### Example: New Policy Endpoint

```python
# app/api/routes/policy.py
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/policies", tags=["Policies"])

@router.post("/")
def create_policy(policy_data: PolicyCreate, current_user = Depends(get_current_user)):
    # Create policy logic
    pass
```

## Database Migrations (with Alembic)

Init Alembic:

```bash
alembic init migrations
```

Create migration:

```bash
alembic revision --autogenerate -m "Add users table"
```

Apply migrations:

```bash
alembic upgrade head
```

## Troubleshooting

### Connection Error

```
psycopg2.OperationalError: could not translate host name "localhost" to address
```

**Solution**: Update `.env` with correct database credentials and ensure PostgreSQL is running.

### Port Already in Use

```
Address already in use
```

**Solution**: Change port in `.env` or kill process:

```bash
lsof -i :8000
kill -9 <PID>
```

## Security Notes

- Change `SECRET_KEY` in production
- Use HTTPS in production
- Set `DEBUG=False` in production
- Store sensitive data in environment variables
- Use strong passwords

## Frontend Integration

Connect from React frontend:

```typescript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { tokens, user } = await response.json();
localStorage.setItem('access_token', tokens.access_token);
```

## Production Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

### Using Docker

```bash
docker build -t greenfield-shield-api .
docker run -p 8000:8000 greenfield-shield-api
```

## License

MIT

## Support

For issues or questions, contact the development team.
