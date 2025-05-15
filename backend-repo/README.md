# Backend API with JWT Authentication

This Express.js API provides user management with JWT authentication.

## Authentication Endpoints

### Register a New User
```
POST /api/auth/register
```
Request body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "securepassword",
  "totalAverageWeightRatings": 0,
  "numberOfRents": 0,
  "recentlyActive": 0
}
```
Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "totalAverageWeightRatings": 0,
    "numberOfRents": 0,
    "recentlyActive": 0
  }
}
```

### Login
```
POST /api/auth/login
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "totalAverageWeightRatings": 0,
    "numberOfRents": 0,
    "recentlyActive": 0
  }
}
```

## Protected Endpoints

For all protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer your-jwt-token
```

### Get User Data
```
GET /api/user/:id
```

### Update User Data
```
PUT /api/user/:id
```

### Create User Data
```
POST /api/user
```

### Get Top Users
```
GET /api/users
``` 