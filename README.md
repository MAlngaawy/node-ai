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

## 🌍 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/askme-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app-name.netlify.app

# Environment
NODE_ENV=development
```

## 🚀 Deployment

### For Netlify Frontend Deployment:
1. Set `FRONTEND_URL` to your Netlify app URL
2. Update CORS origins in `src/app.ts` if needed
3. Deploy your backend to a service like Heroku, Railway, or Render

### CORS Configuration:
The app is configured to allow requests from:
- Local development servers (`localhost:5173`, `localhost:3000`)
- Netlify domains (`*.netlify.app`)
- Custom frontend URL via `FRONTEND_URL` environment variable

## 🛠️ Built With
- Node.js + Express + TypeScript
- MongoDB Atlas
- JWT Authentication
- Swagger Documentation
- bcrypt Password Hashing
- CORS Support for Production
