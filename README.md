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

## User Module Endpoints

#### 1. Add New User
Create a new user in the system.

```
POST /user/adduser
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- Maximum 50 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character (@$!%*?&)

**Response (Success):**
```json
{
  "Success": true,
  "Message": "User added successfully",
  "Data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newuser@example.com",
    "password": "******",
    "role": "owner"
  }
}
```

**Response (Error - Invalid Email):**
```json
{
  "Success": false,
  "Message": "Email must be valid",
  "Data": null
}
```

#### 2. Find User by Email
Retrieve user information by email address.

```
GET /user/getbyemail/:email
```

**Example:**
```
GET /user/getbyemail:user@example.com
```

**Response (Success):**
```json
{
  "Success": true,
  "Message": "User found",
  "Data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "password": "******",
    "role": "owner"
  }
}
```

**Response (Not Found):**
```json
{
  "Success": false,
  "Message": "User not found",
  "Data": null
}
```

#### 3. Update Email (Protected)
Update the authenticated user's email address.

```
POST /user/UpdateEmail
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newemail@example.com"
}
```

**Response (Success):**
```json
{
  "Success": true,
  "Message": "Email updated successfully",
  "Data": {
    "email": "newemail@example.com",
    "password": "******"
  }
}
```

**Response (Error - Unauthorized):**
```json
{
  "Success": false,
  "Message": "Unauthorized",
  "Data": null
}
```

#### 4. Update Password (Protected)
Update the authenticated user's password.

```
POST /user/UpdatePassword
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "NewSecurePassword123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- Maximum 50 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character (@$!%*?&)

**Response (Success):**
```json
{
  "Success": true,
  "Message": "Password updated successfully",
  "Data": {
    "email": "user@example.com",
    "password": "******"
  }
}
```

**Response (Error - Invalid Password):**
```json
{
  "Success": false,
  "Message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
  "Data": null
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

### Step 6: Add New User
```
POST http://localhost:3000/user/adduser
Content-Type: application/json

{
  "email": "anotheruser@example.com",
  "password": "AnotherPass123!"
}
```

**Response:**
```json
{
  "Success": true,
  "Message": "User added successfully",
  "Data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "anotheruser@example.com",
    "password": "******",
    "role": "owner"
  }
}
```

### Step 7: Find User by Email
```
GET http://localhost:3000/user/getbyemail:testuser@example.com
```

**Response:**
```json
{
  "Success": true,
  "Message": "User found",
  "Data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com",
    "password": "******",
    "role": "owner"
  }
}
```

### Step 8: Update Email (Protected)
```
POST http://localhost:3000/user/UpdateEmail
Authorization: Bearer <paste_your_token_here>
Content-Type: application/json

{
  "email": "updatedemail@example.com"
}
```

**Response:**
```json
{
  "Success": true,
  "Message": "Email updated successfully",
  "Data": {
    "email": "updatedemail@example.com",
    "password": "******"
  }
}
```

### Step 9: Update Password (Protected)
```
POST http://localhost:3000/user/UpdatePassword
Authorization: Bearer <paste_your_token_here>
Content-Type: application/json

{
  "password": "NewSecurePassword456!"
}
```

**Response:**
```json
{
  "Success": true,
  "Message": "Password updated successfully",
  "Data": {
    "email": "testuser@example.com",
    "password": "******"
  }
}
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
