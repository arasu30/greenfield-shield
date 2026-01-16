# API Testing Guide

## Testing with Postman

### 1. Import API Collection

Save this as `greenfield-shield-api.json` and import into Postman:

```json
{
  "info": {
    "name": "Greenfield Shield API",
    "description": "Crop Insurance Management API"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"officer@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:8000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Register Officer",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"officer@example.com\",\n  \"full_name\": \"John Officer\",\n  \"password\": \"password123\",\n  \"role\": \"officer\",\n  \"phone\": \"+1234567890\",\n  \"address\": \"123 Insurance St\",\n  \"department\": \"Claims Assessment\",\n  \"officer_id\": \"OFF-001\"\n}"
            },
            "url": {
              "raw": "http://localhost:8000/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Register Admin",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@example.com\",\n  \"full_name\": \"Admin User\",\n  \"password\": \"admin123\",\n  \"role\": \"admin\",\n  \"phone\": \"+1987654321\",\n  \"address\": \"456 Admin Avenue\",\n  \"department\": \"Management\",\n  \"officer_id\": \"ADM-001\"\n}"
            },
            "url": {
              "raw": "http://localhost:8000/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Refresh Token",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"refresh_token\": \"{{refresh_token}}\"\n}"
            },
            "url": {
              "raw": "http://localhost:8000/api/auth/refresh",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8000",
              "path": ["api", "auth", "refresh"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "access_token",
      "value": ""
    },
    {
      "key": "refresh_token",
      "value": ""
    }
  ]
}
```

### 2. Setup Environment Variables

In Postman:
1. Click **Environments** → **Create New**
2. Add variables:

| Variable | Value |
|----------|-------|
| `base_url` | http://localhost:8000 |
| `access_token` | (auto-populated after login) |
| `refresh_token` | (auto-populated after login) |

### 3. Run Requests

**Step 1: Register Officer**
- Use `Register Officer` request
- Save response

**Step 2: Login**
- Use `Login` request
- Copy `access_token` from response
- Paste into `access_token` environment variable
- Copy `refresh_token` from response
- Paste into `refresh_token` environment variable

**Step 3: Use Token**
- Add header: `Authorization: Bearer {{access_token}}`

---

## Testing with cURL

### Register Officer

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "officer@example.com",
    "full_name": "John Officer",
    "password": "password123",
    "role": "officer",
    "department": "Claims Assessment",
    "officer_id": "OFF-001"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "officer@example.com",
    "full_name": "John Officer",
    "role": "officer",
    "department": "Claims Assessment",
    "officer_id": "OFF-001",
    "is_active": true,
    "is_verified": false
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 1800
  }
}
```

### Register Admin

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "full_name": "Admin User",
    "password": "admin123",
    "role": "admin",
    "department": "Management",
    "officer_id": "ADM-001"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "officer@example.com",
    "password": "password123"
  }'
```

### Login with Admin

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Refresh Token

```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### Change Password

```bash
curl -X POST http://localhost:8000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "password123",
    "new_password": "newpassword123",
    "confirm_password": "newpassword123"
  }'
```

---

## Testing with Python

```python
import requests
import json

BASE_URL = "http://localhost:8000/api"

# Register Officer
response = requests.post(
    f"{BASE_URL}/auth/register",
    json={
        "email": "officer@example.com",
        "full_name": "John Officer",
        "password": "password123",
        "role": "officer",
        "department": "Claims Assessment",
        "officer_id": "OFF-001"
    }
)
print("Register Response:")
print(json.dumps(response.json(), indent=2))

# Extract tokens
tokens = response.json()["tokens"]
access_token = tokens["access_token"]
refresh_token = tokens["refresh_token"]

# Login
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={
        "email": "officer@example.com",
        "password": "password123"
    }
)
print("\nLogin Response:")
print(json.dumps(login_response.json(), indent=2))

# Refresh Token
refresh_response = requests.post(
    f"{BASE_URL}/auth/refresh",
    json={"refresh_token": refresh_token}
)
print("\nRefresh Response:")
print(json.dumps(refresh_response.json(), indent=2))

# Change Password
change_pwd_response = requests.post(
    f"{BASE_URL}/auth/change-password",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "old_password": "password123",
        "new_password": "newpassword123",
        "confirm_password": "newpassword123"
    }
)
print("\nChange Password Response:")
print(json.dumps(change_pwd_response.json(), indent=2))
```

---

## Testing in React/TypeScript

```typescript
// __tests__/auth.test.ts
import { login, register } from '../services/authService';

describe('Authentication', () => {
  it('should register officer', async () => {
    const response = await register({
      email: 'officer@test.com',
      full_name: 'Test Officer',
      password: 'test123',
      role: 'officer',
      department: 'Assessment',
      officer_id: 'OFF-TEST-001'
    });

    expect(response.user).toBeDefined();
    expect(response.tokens.access_token).toBeDefined();
  });

  it('should login officer', async () => {
    const response = await login('officer@test.com', 'test123');
    
    expect(response.user.role).toBe('officer');
    expect(response.tokens.access_token).toBeDefined();
  });

  it('should fail with invalid credentials', async () => {
    try {
      await login('officer@test.com', 'wrongpassword');
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
```

---

## Test Scenarios

### Scenario 1: Officer Login Flow

```
1. Register Officer
   - Email: officer@test.com
   - Role: officer
   - Department: Claims Assessment

2. Login with credentials
   - Get access_token & refresh_token

3. Use access_token for subsequent requests
   - Header: Authorization: Bearer <token>

4. When token expires, use refresh_token
   - Get new access_token
```

### Scenario 2: Admin Login Flow

```
1. Register Admin
   - Email: admin@test.com
   - Role: admin

2. Login with credentials
   - Get tokens

3. Admin should have access to admin endpoints
   - Should see different data than officers
```

### Scenario 3: Role-Based Access

```
Officer can access:
- /api/claims/* (review, approve)
- /api/users/{officer_id}

Admin can access:
- /api/admin/* (manage users, settings)
- /api/reports/* (system reports)

Farmer can access:
- /api/policies/* (own policies)
- /api/claims/file (own claims)
- /api/crops/* (own crops)
```

---

## Expected Status Codes

| Code | Scenario |
|------|----------|
| 200 | Successful request |
| 201 | Resource created (register) |
| 400 | Invalid input |
| 401 | Invalid credentials or expired token |
| 403 | Access denied (inactive user) |
| 404 | Resource not found |
| 500 | Server error |

---

## Debugging Tips

1. **Check token validity**
   ```bash
   # Decode JWT (without verification)
   echo "TOKEN" | jq -R 'split(".") | .[1] | @base64d | fromjson'
   ```

2. **View API logs**
   ```bash
   # If using Docker
   docker-compose logs -f backend
   
   # If running locally
   # Terminal will show request logs
   ```

3. **Test database connection**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres -d greenfield_shield -c "SELECT COUNT(*) FROM users;"
   ```

4. **Enable debug mode**
   ```
   # In .env
   DEBUG=True
   ```

---

## Performance Testing

Use Apache Bench or wrk:

```bash
# Apache Bench - 100 requests, 10 concurrent
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8000/api/auth/login

# wrk - 30 seconds test
wrk -t4 -c100 -d30s http://localhost:8000/api/auth/login
```

---

## Success Checklist

- [ ] Backend running on localhost:8000
- [ ] PostgreSQL database connected
- [ ] Can register officer
- [ ] Can register admin
- [ ] Can login with officer credentials
- [ ] Can login with admin credentials
- [ ] Can refresh token
- [ ] Can change password
- [ ] Invalid credentials return 401
- [ ] Tokens expire correctly
