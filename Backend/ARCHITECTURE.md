# FastAPI Backend Architecture

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React + TypeScript)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Login.tsx │  │OfficerReview│  │ AdminPanel  │  │ Dashboard   │        │
│  │   (Login)   │  │   (Review)  │  │  (Manage)   │  │  (Farmer)   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                 │               │               │                 │
│         └─────────────────┼───────────────┼───────────────┘                │
│                           │               │                                 │
│              HTTP Requests (JSON)         │ Authorization Header            │
│              POST /api/auth/login         │ Bearer <access_token>           │
└───────────────────────────┬───────────────┼─────────────────────────────────┘
                            │               │
                            ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FASTAPI BACKEND SERVER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                     MIDDLEWARE LAYER                               │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │ • CORS Middleware (Allow Frontend Domain)                          │   │
│  │ • Trusted Host Middleware                                          │   │
│  │ • Exception Handlers (Global Error Handling)                       │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                      ROUTES LAYER (/api)                           │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  ┌──────────── AUTHENTICATION ROUTES ────────────┐               │   │
│  │  │                                               │               │   │
│  │  │ POST /auth/login                              │               │   │
│  │  │   ├─ Validate input (Pydantic)               │               │   │
│  │  │   ├─ Query user by email                      │               │   │
│  │  │   ├─ Verify password (bcrypt)                │               │   │
│  │  │   ├─ Generate JWT tokens                      │               │   │
│  │  │   └─ Return user + tokens                     │               │   │
│  │  │                                               │               │   │
│  │  │ POST /auth/register                           │               │   │
│  │  │   ├─ Validate input                           │               │   │
│  │  │   ├─ Check email not exists                   │               │   │
│  │  │   ├─ Hash password                            │               │   │
│  │  │   ├─ Create user in database                  │               │   │
│  │  │   └─ Return user + tokens                     │               │   │
│  │  │                                               │               │   │
│  │  │ POST /auth/refresh                            │               │   │
│  │  │   ├─ Verify refresh token                     │               │   │
│  │  │   └─ Return new access token                  │               │   │
│  │  │                                               │               │   │
│  │  │ POST /auth/change-password                    │               │   │
│  │  │   ├─ Authenticate user (JWT)                 │               │   │
│  │  │   ├─ Verify old password                      │               │   │
│  │  │   └─ Update password hash                     │               │   │
│  │  │                                               │               │   │
│  │  └───────────────────────────────────────────────┘               │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    SCHEMA LAYER (Validation)                       │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  LoginRequest          TokenResponse      UserResponse            │   │
│  │  ├─ email: str        ├─ access_token    ├─ id: int             │   │
│  │  └─ password: str     ├─ refresh_token   ├─ email: str          │   │
│  │                       ├─ token_type      ├─ role: str           │   │
│  │  RegisterRequest       └─ expires_in     ├─ is_active: bool     │   │
│  │  ├─ email             LoginResponse       └─ created_at: datetime│   │
│  │  ├─ full_name         ├─ user            ChangePasswordRequest  │   │
│  │  ├─ password          ├─ tokens          ├─ old_password        │   │
│  │  ├─ role              └─ message         ├─ new_password        │   │
│  │  ├─ department                           └─ confirm_password    │   │
│  │  └─ officer_id                                                   │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    SERVICE LAYER (Business Logic)                  │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  AuthService                                                       │   │
│  │  ├─ login()                                                        │   │
│  │  ├─ register()                                                     │   │
│  │  ├─ refresh_access_token()                                         │   │
│  │  ├─ verify_access_token()                                          │   │
│  │  └─ change_password()                                              │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                       CRUD LAYER (DB Operations)                   │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  UserCRUD                                                           │   │
│  │  ├─ get_user_by_email()                                            │   │
│  │  ├─ get_user_by_id()                                               │   │
│  │  ├─ create_user()                                                  │   │
│  │  ├─ update_user()                                                  │   │
│  │  └─ change_password()                                              │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                   UTILITIES LAYER (Helpers)                        │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  security.py                              errors.py               │   │
│  │  ├─ hash_password()                      ├─ InvalidCredentials   │   │
│  │  ├─ verify_password()                    ├─ UserNotFound         │   │
│  │  ├─ create_access_token()                ├─ UserAlreadyExists    │   │
│  │  ├─ create_refresh_token()               ├─ AccessDenied         │   │
│  │  └─ verify_token()                       └─ InvalidToken         │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                   MODELS LAYER (SQLAlchemy ORM)                    │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  User Model (Table: users)                                         │   │
│  │  ├─ id: Integer (PRIMARY KEY)                                      │   │
│  │  ├─ email: String (UNIQUE)                                         │   │
│  │  ├─ full_name: String                                              │   │
│  │  ├─ password_hash: String                                          │   │
│  │  ├─ role: Enum (farmer/officer/admin)                              │   │
│  │  ├─ phone: String                                                  │   │
│  │  ├─ address: String                                                │   │
│  │  ├─ department: String (for officers)                              │   │
│  │  ├─ officer_id: String (UNIQUE, for officers)                      │   │
│  │  ├─ is_active: Boolean                                             │   │
│  │  ├─ is_verified: Boolean                                           │   │
│  │  ├─ created_at: DateTime                                           │   │
│  │  ├─ updated_at: DateTime                                           │   │
│  │  └─ last_login: DateTime                                           │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└───────────────────────────┬──────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                DATABASE LAYER (PostgreSQL + PostGIS)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PostgreSQL Database: greenfield_shield                                     │
│                                                                             │
│  ┌─────────────────────────────────────────┐                               │
│  │         TABLE: users                    │                               │
│  ├─────────────────────────────────────────┤                               │
│  │ id           | SERIAL (PK)              │                               │
│  │ email        | VARCHAR (UNIQUE)         │                               │
│  │ full_name    | VARCHAR                  │                               │
│  │ password_hash| VARCHAR                  │                               │
│  │ role         | ENUM('farmer',           │                               │
│  │              | 'officer', 'admin')      │                               │
│  │ phone        | VARCHAR                  │                               │
│  │ address      | VARCHAR                  │                               │
│  │ department   | VARCHAR                  │                               │
│  │ officer_id   | VARCHAR (UNIQUE)         │                               │
│  │ is_active    | BOOLEAN (DEFAULT: true)  │                               │
│  │ is_verified  | BOOLEAN (DEFAULT: false) │                               │
│  │ created_at   | TIMESTAMP WITH TZ        │                               │
│  │ updated_at   | TIMESTAMP WITH TZ        │                               │
│  │ last_login   | TIMESTAMP WITH TZ        │                               │
│  │                                         │                               │
│  │ INDEXES:                                │                               │
│  │ - idx_users_email                       │                               │
│  │ - idx_users_officer_id                  │                               │
│  │ - idx_users_role                        │                               │
│  └─────────────────────────────────────────┘                               │
│                                                                             │
│  Extensions:                                                               │
│  - postgis (for geospatial features in future)                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow Example: Officer Login

```
1. FRONTEND REQUEST
   ┌────────────────────────────────┐
   │ POST /api/auth/login           │
   │ Headers:                        │
   │ - Content-Type: application/json
   │                                 │
   │ Body:                           │
   │ {                               │
   │   "email": "john@example.com",  │
   │   "password": "secure123"       │
   │ }                               │
   └────────────────────────────────┘

2. FASTAPI PROCESSING
   ┌─────────────────────────────────────────┐
   │ 1. Validate input with Pydantic         │
   │    ✓ Email format valid                 │
   │    ✓ Password not empty                 │
   │                                         │
   │ 2. Query database                       │
   │    SELECT * FROM users                  │
   │    WHERE email = 'john@example.com'     │
   │                                         │
   │ 3. Verify password                      │
   │    bcrypt.verify(input_pwd,             │
   │    user.password_hash)                  │
   │                                         │
   │ 4. Check user status                    │
   │    - is_active = true ✓                 │
   │    - role = officer ✓                   │
   │                                         │
   │ 5. Update last login                    │
   │    UPDATE users                         │
   │    SET last_login = NOW()               │
   │                                         │
   │ 6. Generate JWT tokens                  │
   │    Access Token (30 min expiry)         │
   │    Refresh Token (7 day expiry)         │
   │                                         │
   │ 7. Return response                      │
   └─────────────────────────────────────────┘

3. BACKEND RESPONSE (200 OK)
   ┌────────────────────────────────────────────────────┐
   │ {                                                  │
   │   "user": {                                        │
   │     "id": 1,                                       │
   │     "email": "john@example.com",                   │
   │     "full_name": "John Officer",                   │
   │     "role": "officer",                             │
   │     "department": "Claims Assessment",             │
   │     "officer_id": "OFF-001",                       │
   │     "is_active": true,                             │
   │     "created_at": "2026-01-16T10:00:00Z"          │
   │   },                                               │
   │   "tokens": {                                      │
   │     "access_token":                                │
   │       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  │
   │     "refresh_token":                               │
   │       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  │
   │     "token_type": "bearer",                        │
   │     "expires_in": 1800                             │
   │   },                                               │
   │   "message": "Login successful"                    │
   │ }                                                  │
   └────────────────────────────────────────────────────┘

4. FRONTEND PROCESSING
   ┌──────────────────────────────────────────┐
   │ 1. Store tokens in localStorage          │
   │    localStorage.access_token = "..."     │
   │    localStorage.refresh_token = "..."    │
   │                                          │
   │ 2. Decode JWT to get user info           │
   │    payload = decode(access_token)        │
   │    role = payload.role ("officer")       │
   │                                          │
   │ 3. Redirect to appropriate page          │
   │    if role == "officer"                  │
   │      → Navigate to /officer/review       │
   │                                          │
   │ 4. Set auth header for future requests   │
   │    Authorization: Bearer <access_token>  │
   └──────────────────────────────────────────┘
```

---

## Data Security Flow

```
PASSWORD SECURITY
─────────────────

User Input: "MySecurePassword123"
     │
     ▼
bcrypt.hash()  ← Uses salt rounds
     │
     ▼
Hash: $2b$12$Xxxx.xxxx.xxxx.xxxx.xxx...  ← Stored in database

On Login:
bcrypt.verify(input, stored_hash) → True/False


JWT TOKEN SECURITY
──────────────────

Payload: { sub: "1", email: "...", role: "officer", exp: 1234567890 }
     │
     ▼
HMAC-SHA256 with SECRET_KEY
     │
     ▼
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIi...

On Use:
Verify signature with SECRET_KEY
Check expiration time
Allow access if valid
```

---

## Deployment Architecture (Future)

```
┌──────────────────┐
│  GitHub Actions  │  ← CI/CD Pipeline
│  (Auto Deploy)   │
└────────┬─────────┘
         │
         ▼
    ┌─────────────┐
    │   Docker    │  ← Build image
    │  Registry   │
    └────┬────────┘
         │
         ▼
    ┌──────────────────┐
    │  AWS/GCP/Azure   │  ← Cloud Provider
    │  (Production)    │
    │                  │
    │ ┌──────────────┐ │
    │ │  PostgreSQL  │ │
    │ │   + PostGIS  │ │
    │ └──────────────┘ │
    │                  │
    │ ┌──────────────┐ │
    │ │   FastAPI    │ │
    │ │    Backend   │ │
    │ └──────────────┘ │
    │                  │
    │ ┌──────────────┐ │
    │ │   CDN/Cache  │ │  ← Cloudflare/Redis
    │ └──────────────┘ │
    └──────────────────┘
```

---

## Performance Considerations

```
Database Optimization
─────────────────────
✓ Indexes on frequently queried columns (email, officer_id, role)
✓ Connection pooling (SQLAlchemy pool_pre_ping)
✓ Query optimization with parameterized statements

Authentication Performance
──────────────────────────
✓ JWT tokens reduce database queries on each request
✓ Token validation is faster than password verification
✓ Refresh token mechanism prevents excessive new token generation

Scalability
──────────
✓ Stateless JWT authentication (no session store)
✓ Can run multiple backend instances behind load balancer
✓ Database connection pooling handles concurrency
```

---

## Security Layers

```
Layer 1: Network
→ HTTPS/TLS encryption in production
→ CORS configured for specific origins

Layer 2: Authentication
→ JWT tokens with expiration
→ Password hashing with bcrypt

Layer 3: Authorization
→ Role-based access control (RBAC)
→ Token validation on protected routes

Layer 4: Database
→ Parameterized queries (prevent SQL injection)
→ Column constraints (unique, not null)
→ Connection timeout protection

Layer 5: Error Handling
→ Don't expose sensitive error details
→ Proper HTTP status codes
→ Logging for security audit trails
```

This architecture is production-ready and follows FastAPI best practices!
