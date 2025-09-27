# World Tour Management System (Backend)

This is the backend API for the **World Tour Management System**. It is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. The backend handles user authentication, tours, bookings, payments, and more.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

- User registration and authentication (with JWT)
- Google OAuth login
- Role-based access control (User / Admin / Super Admin)
- Division management
- Tour and Tour Type management
- Booking and Payment processing (SSLCommerz)
- OTP-based verification
- Dashboard stats
- File upload (images) using Cloudinary
- Redis for caching and OTP storage
- PDF invoice generation

---

## Tech Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** MongoDB (Atlas)  
- **Authentication:** JWT, Passport.js (Local & Google OAuth)  
- **Payments:** SSLCommerz Sandbox API  
- **File Upload:** Cloudinary + Multer  
- **Caching:** Redis  
- **Email Service:** Nodemailer (Gmail SMTP)  
- **Validation:** Zod  
- **PDF Generation:** PDFKit  
- **Deployment:** Vercel  

---


---

## Environment Variables

Create a `.env` file in the root directory and add the following:

PORT=5000
DB_URI=your_mongodb_uri
NODE_ENV=development

JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Redis
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=your_redis_user
REDIS_PASSWORD=your_redis_password

Nodemailer
SMTP_USER=your_email
SMTP_PASS=your_email_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

SSLCommerz
SSL_STORE_ID=your_store_id
SSL_STORE_PASSWORD=your_store_password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v3/api.php

yaml
Copy code

> Note: Update all credentials according to your accounts and development/production environments.

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/your-username/world-tour-management-system.git
cd backend
Install dependencies

bash
Copy code
npm install
Setup environment variables
Create .env in the root and configure as shown above.

Run in development

bash
Copy code
npm run dev
Build for production

bash
Copy code
npm run build
npm start
Deploy

The backend is configured to deploy on Vercel. Make sure to set environment variables in Vercel dashboard.

Available Scripts
npm run dev – Run the project in development mode (with auto-restart)

npm run build – Compile TypeScript to JavaScript

npm start – Start the compiled production server

npm run lint – Run ESLint for code quality

API Endpoints
Base URL: https://worldtourmanagementsystem.vercel.app/api/v1

User Routes
POST /user/register – Public

GET /user/all-users – Admin / Super Admin

GET /user/me – User / Admin / Super Admin

GET /user/single-user/:id – Admin / Super Admin

PUT /user/update-user/:id – User / Admin / Super Admin

DELETE /user/delete-user/:id – Admin / Super Admin

Auth Routes
POST /auth/login – Public

POST /auth/refresh-token – Public

POST /auth/logout – User / Admin / Super Admin

POST /auth/change-password – User / Admin / Super Admin

POST /auth/set-password – User / Admin / Super Admin

POST /auth/forget-password – Public

POST /auth/reset-password – User / Admin / Super Admin

GET /auth/google – Public

GET /auth/google/callback – Public

Division Routes
POST /division/create – Admin / Super Admin

PATCH /division/update-division/:id – Admin / Super Admin

DELETE /division/delete/:id – Admin / Super Admin

GET /division/all-divisions – Public

GET /division/single-division/:slug – Public

Tour Routes
POST /tour/create-tour – Admin / Super Admin

PATCH /tour/update-tour/:id – Admin / Super Admin

DELETE /tour/delete-tour/:id – Admin / Super Admin

GET /tour/all-tours – Public

GET /tour/single-tour/:slug – Public

Tour Type Routes
POST /tour-type/create-tour-type – Admin / Super Admin

PATCH /tour-type/update-tour-type/:id – Admin / Super Admin

DELETE /tour-type/delete-tour-type/:id – Admin / Super Admin

GET /tour-type/all-tour-types – Public

Booking Routes
POST /booking/create – User / Admin / Super Admin

GET /booking/all-bookings – Admin / Super Admin

GET /booking/my-bookings – User / Admin / Super Admin

GET /booking/single-booking/:bookingId – User / Admin / Super Admin

PATCH /booking/update-status/:bookingId – User / Admin / Super Admin

DELETE /booking/delete/:bookingId – Admin / Super Admin

Payment Routes
POST /payment/init-payment/:bookingId – User / Admin / Super Admin

POST /payment/success – Public

POST /payment/fail – Public

POST /payment/cancel – Public

POST /payment/validate-payment – Public

GET /payment/invoice/:paymentId – User / Admin / Super Admin

Stats Routes
GET /stats/dashboard – Admin / Super Admin

OTP Routes
POST /otp/send – Public

POST /otp/verify – Public
