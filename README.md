<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# DineSpace - Restaurant Management System

A progressive [Node.js](http://nodejs.org) backend for building efficient and scalable restaurant management applications using [NestJS](https://github.com/nestjs/nest) framework with TypeScript.

## Description

DineSpace is a modern restaurant management system that provides authentication, user management, restaurant operations, and email verification services.

## Project setup

```bash
$ npm install
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
DBusername=postgres
DBpassword=mubindb
database=DineSpaceDB
emailhost=smtp.gmail.com
emailport=587
emailpass=your_app_password
emailuser=your_email@gmail.com
secretjwtkey=testkey
PORT=3000
FRONTEND_URL=http://localhost:3000
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Authentication Endpoints

#### 1. Verify Email
Send verification email to user before registration.

```
GET /auth/Verifyemail?email=user@example.com
```

**Response (Success):**
```json
{
  "Success": true,
  "Message": "Email sent successfully",
  "Data": {
    "email": "user@example.com"
  }
}
```

#### 2. Register User
Complete user registration with email verification link.

```
PUT /auth/register/:uid
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "restaurantName": "Taste of Italy",
  "restaurantLocation": "123 Main St",
  "restaurantCuisine": "Italian"
}
```

**Response (Success):**
```json
{
  "Success": true,
  "Message": "User and restaurant Registered",
  "Data": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### 3. Login
Authenticate user and get JWT token.

```
POST /auth
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (Success):**
```json
{
  "Success": true,
  "Message": "Success",
  "tocken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Check Authentication (Protected)
Verify JWT token validity.

```
GET /auth/check
Authorization: Bearer <your_jwt_token>
```

**Response (Success):**
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "user"
}
```

---

## Testing with Sample Data

### Step 1: Verify Email
```
GET http://localhost:3000/auth/Verifyemail?email=testuser@example.com
```

### Step 2: Copy UID from Database
After email verification, the system generates a UID. Retrieve it from the `varification` table in your database.

### Step 3: Register User
```
PUT http://localhost:3000/auth/register/YOUR_UID_HERE
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "firstName": "Test",
  "lastName": "User",
  "restaurantName": "Test Restaurant",
  "restaurantLocation": "456 Oak Avenue",
  "restaurantCuisine": "Asian"
}
```

### Step 4: Login
```
POST http://localhost:3000/auth
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

Save the `tocken` from the response.

### Step 5: Test Protected Endpoint
```
GET http://localhost:3000/auth/check
Authorization: Bearer <paste_your_token_here>
```

---

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
src/
├── auth/                 # Authentication module (JWT, login, registration)
├── user/                 # User management module
├── resturant/            # Restaurant management module
├── mail/                 # Email service module
├── SharedServices/       # Shared utilities (Result, Notification)
├── app.module.ts         # Root module
├── main.ts               # Application entry point
```

## Key Features

- ✅ User Authentication with JWT
- ✅ Email Verification
- ✅ Restaurant Management
- ✅ User Profile Management
- ✅ Role-based Access Control
- ✅ Protected Routes with Guards

## Database

This project uses PostgreSQL. Make sure PostgreSQL is installed and running, and configure the connection details in your `.env` file.

## License

MIT Licensed

## Support

For more information about NestJS, visit the [official documentation](https://docs.nestjs.com).
