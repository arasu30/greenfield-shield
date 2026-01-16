## Authentication Flow for Admin & Officer Login

### User Roles

1. **Admin**: Full system access, user management
2. **Officer**: Review claims, approve/reject, field assessments
3. **Farmer**: Buy policies, file claims, view crop health

---

## Login Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  Login Form: Email + Password                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ POST /api/auth/login
                      │ { email, password }
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Validate input (email format, password required)       │
│  2. Query database for user by email                       │
│     - If not found → Return 401 "Invalid credentials"      │
│                                                             │
│  3. Verify password using bcrypt                           │
│     - If mismatch → Return 401 "Invalid credentials"       │
│                                                             │
│  4. Check if user is active                                │
│     - If inactive → Return 403 "Account disabled"          │
│                                                             │
│  5. Check user role (admin/officer/farmer)                 │
│     - Role determines available endpoints                  │
│                                                             │
│  6. Update last_login timestamp                            │
│                                                             │
│  7. Generate JWT tokens:                                   │
│     - Access Token (expires in 30 mins)                    │
│     - Refresh Token (expires in 7 days)                    │
│                                                             │
│  8. Return user data + tokens + expiration                 │
│                                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Response with tokens
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  1. Store access_token in localStorage/sessionStorage      │
│  2. Store refresh_token securely                           │
│  3. Decode token to get user role                          │
│  4. Redirect to role-specific dashboard                    │
│     - Officer → OfficerReview page                        │
│     - Admin → AdminPanel page                             │
│     - Farmer → Dashboard page                             │
└─────────────────────────────────────────────────────────────┘
```

---

## API Requests & Responses

### 1. LOGIN REQUEST

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "officer@example.com",
  "password": "secure_password_123"
}
```

**Success Response (200)**:
```json
{
  "user": {
    "id": 1,
    "email": "officer@example.com",
    "full_name": "John Officer",
    "role": "officer",
    "phone": "+1234567890",
    "address": "123 Main St",
    "is_active": true,
    "is_verified": true,
    "department": "Insurance Assessment",
    "officer_id": "OFF-001",
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-16T10:00:00Z",
    "last_login": "2026-01-16T14:30:00Z"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  },
  "message": "Login successful"
}
```

**Error Response (401)**:
```json
{
  "detail": "Invalid email or password"
}
```

**Error Response (403 - Inactive Account)**:
```json
{
  "detail": "User account is inactive"
}
```

---

### 2. REGISTER REQUEST (For Officers/Admins)

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "newadmin@example.com",
  "full_name": "Jane Admin",
  "password": "secure_password_123",
  "role": "admin",
  "phone": "+1987654321",
  "address": "456 Admin St",
  "department": "Management",
  "officer_id": "ADM-001"
}
```

**Success Response (201)**:
```json
{
  "user": {
    "id": 2,
    "email": "newadmin@example.com",
    "full_name": "Jane Admin",
    "role": "admin",
    "department": "Management",
    "officer_id": "ADM-001",
    "is_active": true,
    "is_verified": false,
    "created_at": "2026-01-16T15:00:00Z"
  },
  "tokens": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "token_type": "bearer",
    "expires_in": 1800
  }
}
```

---

### 3. REFRESH TOKEN REQUEST

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200)**:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

## JWT Token Structure

**Access Token Payload**:
```json
{
  "sub": "1",
  "email": "officer@example.com",
  "role": "officer",
  "type": "access",
  "exp": 1705425600
}
```

**Refresh Token Payload**:
```json
{
  "sub": "1",
  "email": "officer@example.com",
  "type": "refresh",
  "exp": 1706290800
}
```

---

## Frontend Implementation

### Using React + TypeScript

```typescript
// services/authService.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

interface LoginResponse {
  user: {
    id: number;
    email: string;
    full_name: string;
    role: 'admin' | 'officer' | 'farmer';
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const storeTokens = (tokens: any) => {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  localStorage.setItem('user_role', tokens.user.role);
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
```

### Login Component

```typescript
// components/Login.tsx
import { useState } from 'react';
import { login, storeTokens } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      // Store tokens
      storeTokens(response);

      // Redirect based on role
      switch (response.user.role) {
        case 'officer':
          navigate('/officer/review');
          break;
        case 'admin':
          navigate('/admin/panel');
          break;
        case 'farmer':
          navigate('/dashboard');
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## Protected Routes

### With Role Check

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const role = localStorage.getItem('user_role');
  const token = localStorage.getItem('access_token');
  
  return {
    isAuthenticated: !!token,
    role,
    logout: () => {
      localStorage.clear();
      window.location.href = '/login';
    },
  };
};

// components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !requiredRole.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

// Usage in Router
<Route
  path="/officer/review"
  element={
    <ProtectedRoute requiredRole={['officer', 'admin']}>
      <OfficerReview />
    </ProtectedRoute>
  }
/>
```

---

## Backend Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'officer', 'admin')),
  phone VARCHAR(20),
  address TEXT,
  department VARCHAR(255),
  officer_id VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_officer_id ON users(officer_id);
CREATE INDEX idx_users_role ON users(role);
```

---

## Security Best Practices

1. **Password Hashing**: Using bcrypt with salt rounds
2. **JWT Expiration**: Access tokens expire in 30 minutes
3. **Refresh Tokens**: Secure rotation with 7-day expiration
4. **CORS**: Configured for frontend domain only
5. **HTTPS**: Required in production
6. **Environment Variables**: Sensitive data never hardcoded

---

## Testing Login Endpoints

### Using cURL

**Login**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"officer@example.com","password":"password123"}'
```

**Refresh Token**:
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<your_refresh_token>"}'
```

### Using Postman

1. Create collection: "Greenfield Shield API"
2. Add request: `POST /api/auth/login`
3. Body (JSON):
   ```json
   {
     "email": "officer@example.com",
     "password": "password123"
   }
   ```
4. Send and get tokens
5. Use token in subsequent requests with Authorization header

---

## Troubleshooting

### "Invalid credentials" error

- Check email spelling
- Verify password is correct
- Ensure user exists in database
- Check if user is active

### "Token expired" error

- Use refresh token endpoint to get new access token
- Frontend should automatically refresh when 401 received

### CORS errors

- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check if browser is sending preflight requests

---

## Demo Credentials

After running `docker-compose up`, you can create users or use:

**Officer Account**:
- Email: `officer@example.com`
- Password: `password123`
- Role: `officer`

**Admin Account**:
- Email: `admin@example.com`
- Password: `password123`
- Role: `admin`

*(These need to be created in database or via registration endpoint)*
