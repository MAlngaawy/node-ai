# User API with JWT Authentication

A RESTful API built with Node.js, Express, TypeScript, MongoDB Atlas, and JWT authentication.

## 🚀 Quick Start

```bash
npm install
npm run build
npm start
```

Server runs on: `http://localhost:4000`  
Swagger docs: `http://localhost:4000/api/swagger`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
  ```json
  { "username": "string", "email": "string", "password": "string" }
  ```
- `POST /api/auth/signin` - User login
  ```json
  { "username": "string", "password": "string" }
  ```
- `POST /api/auth/refresh` - Refresh access token
  ```json
  { "refreshToken": "string" }
  ```
- `POST /api/auth/logout` - Logout (invalidate refresh token)
  ```json
  { "refreshToken": "string" }
  ```
- `POST /api/auth/logout-all` - Logout from all devices

### User Management
- `GET /api/profile` - Get current user profile *(Protected)*
- `GET /api/users` - Get all users *(Protected)*
- `GET /api/users/:id` - Get user by ID *(Protected)*
- `DELETE /api/users/:id` - Delete user *(Protected)*

### Public
- `GET /` - Welcome message

## 🔐 Authentication

Use Bearer token in Authorization header:
```
Authorization: Bearer <your-access-token>
```

## ⏰ Token Expiration
- **Access Token**: 10 hours
- **Refresh Token**: 30 days

## 🛠️ Built With
- Node.js + Express + TypeScript
- MongoDB Atlas
- JWT Authentication
- Swagger Documentation
- bcrypt Password Hashing
