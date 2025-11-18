## World Tour Management System (Backend)

This is the backend API for the **World Tour Management System**. It is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. The backend handles user authentication, tours, bookings, payments, and more.

-----

## Features

  * **User registration and authentication** (with JWT)
  * **Google OAuth** login
  * **Role-based access control** (**User** / **Admin** / **Super Admin**)
  * **Division management**
  * **Tour and Tour Type management**
  * **Booking and Payment processing** (SSLCommerz)
  * **OTP-based verification**
  * **Dashboard stats**
  * **File upload** (images) using Cloudinary
  * **Redis** for caching and OTP storage
  * **PDF invoice generation**

-----

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB (Atlas) |
| **Authentication** | JWT, Passport.js (Local & Google OAuth) |
| **Payments** | SSLCommerz Sandbox API |
| **File Upload** | Cloudinary + Multer |
| **Caching** | Redis |
| **Email Service** | Nodemailer (Gmail SMTP) |
| **Validation** | Zod |
| **PDF Generation** | PDFKit |
| **Deployment** | Vercel |

-----

## Project Structure

*(Details on project structure would typically be placed here, describing folders like `src/controllers`, `src/services`, `src/models`, etc. Since it wasn't provided, this section is a placeholder.)*

-----

## Environment Variables

Create a **`.env`** file in the root directory and add the following:

```env
PORT=5000
DB_URI=your_mongodb_uri
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=your_redis_user
REDIS_PASSWORD=your_redis_password

# Nodemailer
SMTP_USER=your_email
SMTP_PASS=your_email_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

# SSLCommerz
SSL_STORE_ID=your_store_id
SSL_STORE_PASSWORD=your_store_password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v3/api.php
```

> **Note:** Update all credentials according to your accounts and development/production environments.

-----

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/world-tour-management-system.git
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Setup environment variables:**
    Create a **`.env`** file in the root and configure it as shown in the **Environment Variables** section.

4.  **Run in development:**

    ```bash
    npm run dev
    ```

5.  **Build for production:**

    ```bash
    npm run build
    npm start
    ```

6.  **Deploy:**
    The backend is configured to deploy on **Vercel**. Make sure to set the environment variables in the Vercel dashboard.

-----

## Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Run the project in development mode (with auto-restart). |
| `npm run build` | Compile TypeScript to JavaScript. |
| `npm start` | Start the compiled production server. |
| `npm run lint` | Run ESLint for code quality. |

-----

## API Endpoints

**Base URL:** `https://worldtourmanagementsystem.vercel.app/api/v1`

### User Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/register` | Public | Register a new user. |
| `GET` | `/user/all-users` | Admin / Super Admin | Get all users. |
| `GET` | `/user/me` | User / Admin / Super Admin | Get the authenticated user's profile. |
| `GET` | `/user/single-user/:id` | Admin / Super Admin | Get a single user by ID. |
| `PUT` | `/user/update-user/:id` | User / Admin / Super Admin | Update a user's information. |
| `DELETE` | `/user/delete-user/:id` | Admin / Super Admin | Delete a user. |

### Auth Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Log in a user. |
| `POST` | `/auth/refresh-token` | Public | Get a new access token using the refresh token. |
| `POST` | `/auth/logout` | User / Admin / Super Admin | Log out a user. |
| `POST` | `/auth/change-password` | User / Admin / Super Admin | Change the authenticated user's password. |
| `POST` | `/auth/set-password` | User / Admin / Super Admin | Set a new password (e.g., after social login). |
| `POST` | `/auth/forget-password` | Public | Initiate a password reset process. |
| `POST` | `/auth/reset-password` | User / Admin / Super Admin | Reset password using a token. |
| `GET` | `/auth/google` | Public | Initiate Google OAuth login. |
| `GET` | `/auth/google/callback` | Public | Google OAuth callback handler. |

### Division Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/division/create` | Admin / Super Admin | Create a new division. |
| `PATCH` | `/division/update-division/:id` | Admin / Super Admin | Update an existing division. |
| `DELETE` | `/division/delete/:id` | Admin / Super Admin | Delete a division. |
| `GET` | `/division/all-divisions` | Public | Get all divisions. |
| `GET` | `/division/single-division/:slug` | Public | Get a single division by slug. |

### Tour Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/tour/create-tour` | Admin / Super Admin | Create a new tour. |
| `PATCH` | `/tour/update-tour/:id` | Admin / Super Admin | Update an existing tour. |
| `DELETE` | `/tour/delete-tour/:id` | Admin / Super Admin | Delete a tour. |
| `GET` | `/tour/all-tours` | Public | Get all tours (with filtering/pagination). |
| `GET` | `/tour/single-tour/:slug` | Public | Get a single tour by slug. |

### Tour Type Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/tour-type/create-tour-type` | Admin / Super Admin | Create a new tour type. |
| `PATCH` | `/tour-type/update-tour-type/:id` | Admin / Super Admin | Update an existing tour type. |
| `DELETE` | `/tour-type/delete-tour-type/:id` | Admin / Super Admin | Delete a tour type. |
| `GET` | `/tour-type/all-tour-types` | Public | Get all tour types. |

### Booking Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/booking/create` | User / Admin / Super Admin | Create a new booking. |
| `GET` | `/booking/all-bookings` | Admin / Super Admin | Get all bookings. |
| `GET` | `/booking/my-bookings` | User / Admin / Super Admin | Get the authenticated user's bookings. |
| `GET` | `/booking/single-booking/:bookingId` | User / Admin / Super Admin | Get a single booking by ID. |
| `PATCH` | `/booking/update-status/:bookingId` | User / Admin / Super Admin | Update the status of a booking. |
| `DELETE` | `/booking/delete/:bookingId` | Admin / Super Admin | Delete a booking. |

### Payment Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/payment/init-payment/:bookingId` | User / Admin / Super Admin | Initiate payment for a booking. |
| `POST` | `/payment/success` | Public | SSLCommerz success callback. |
| `POST` | `/payment/fail` | Public | SSLCommerz failure callback. |
| `POST` | `/payment/cancel` | Public | SSLCommerz cancellation callback. |
| `POST` | `/payment/validate-payment` | Public | Validate a payment. |
| `GET` | `/payment/invoice/:paymentId` | User / Admin / Super Admin | Generate and retrieve a PDF invoice. |

### Stats Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats/dashboard` | Admin / Super Admin | Get dashboard statistics. |

### OTP Routes

| Method | Endpoint | Access Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/otp/send` | Public | Send an OTP (e.g., for verification). |
| `POST` | `/otp/verify` | Public | Verify an OTP. |

-----

## License

*(License information would typically be placed here, e.g., MIT License.)*
