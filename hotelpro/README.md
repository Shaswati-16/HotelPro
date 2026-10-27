# HotelPro

Hotel booking and management app built with the MERN stack (MongoDB, Express, React, Node.js).

## Project structure

```
hotelpro/
├── client/   React + Vite frontend
└── server/   Express + Mongoose backend
```

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env      # then edit .env and set JWT_SECRET
npm install
npm run dev               # starts the API on http://localhost:8000
```

### 2. Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev               # starts the app on http://localhost:5173
```

Vite forwards every `/api` request to the backend, so no extra CORS setup is needed in development.

## Creating an admin user

Users who register are always normal users. To make someone an admin, open the `users` collection in MongoDB Compass and change their `userType` from `"user"` to `"admin"`.

## API overview

| Method | Endpoint             | Auth       | Description                          |
|--------|----------------------|------------|--------------------------------------|
| POST   | /api/auth/register   | Public     | Create a user account                |
| POST   | /api/auth/login      | Public     | Log in and receive a JWT             |
| GET    | /api/rooms           | User       | List all rooms                       |
| POST   | /api/rooms           | Admin      | Add a room                           |
| POST   | /api/bookings        | User       | Book a room for a date range         |
| GET    | /api/bookings/mine   | User       | List the current user's bookings     |
| GET    | /api/bookings        | Admin      | List all bookings                    |

## Notes

- Card details are never stored in full. Only the cardholder name and last 4 digits are saved. For real payments, integrate a provider such as Stripe on the server.
- Never commit `server/.env`. It is listed in `.gitignore`.
