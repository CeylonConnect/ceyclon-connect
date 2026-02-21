# CeylonConnect

A full-stack tour booking platform for Sri Lanka that connects tourists with local guides. Tourists can discover and book tours, local guides can manage their listings and get verified, and admins oversee the entire platform through a dedicated dashboard.

---

## Features

### Tourists

- Browse and search tours by location, category, and price
- View detailed tour pages with itinerary, guide info, gallery, and FAQs
- Book tours with group size and date selection
- Leave reviews and ratings
- Real-time chat with guides via Pusher
- Raise disputes on bookings
- Browse and RSVP to cultural events
- AI travel assistant

### Local Guides

- Create, edit, and delete tour listings
- Manage bookings (confirm / cancel)
- Submit verification documents for badge approval
- Real-time messaging with tourists
- Guide profile page visible to tourists

### Admin

- User management (view, block/unblock)
- Tour moderation
- Badge verification request review (with document links)
- Dispute resolution
- Event management
- Platform-wide notifications

---

## Tech Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Frontend      | React 19, Vite, Tailwind CSS, React Router v7 |
| Backend       | Node.js, Express 5                            |
| Database      | MySQL (via `mysql2`)                          |
| Auth          | JWT (`jsonwebtoken`) + bcrypt                 |
| Real-time     | Pusher                                        |
| File Uploads  | Cloudinary                                    |
| AI            | Google Gemini API                             |
| Notifications | Custom in-app notification system             |

---

## Project Structure

```
check/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── api/             # Admin & notification API calls
│       ├── api1/            # Core API calls (tours, bookings, users…)
│       ├── components/      # Shared UI, admin panels, dashboard widgets
│       ├── data/            # Static mock data
│       ├── lib/             # Axios HTTP client
│       ├── pages/           # Route-level page components
│       ├── services/        # Auth & storage helpers
│       └── state/           # React context (AuthContext, BookingContext)
│
└── server/                  # Express backend
    ├── middleware/           # JWT auth middleware
    ├── database/             # SQL schema files
    └── src/
        ├── config/           # DB & Pusher config
        ├── controllers/      # Route handlers
        ├── models/           # DB query layer
        └── routes/           # Express routers
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MySQL ≥ 8
- A [Cloudinary](https://cloudinary.com) account (for uploads)
- A [Pusher](https://pusher.com) app (for real-time chat)
- A [Google Gemini](https://aistudio.google.com) API key (for AI assistant)

---

### 1. Database Setup

Create the database and run the schema:

```sql
CREATE DATABASE ceylonconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ceylonconnect;
```

Then run the schema file:

```bash
mysql -u root -p ceylonconnect < server/database/setup.mysql.sql
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret

# MySQL
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ceylonconnect

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Pusher
PUSHER_APP_ID=your_app_id
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Frontend origin (for CORS)
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API runs on `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

---

## User Roles

| Role      | Access                                                                              |
| --------- | ----------------------------------------------------------------------------------- |
| `tourist` | Browse tours, book, review, chat, raise disputes                                    |
| `local`   | All tourist access + manage own tours & bookings, request verification badge        |
| `admin`   | Full platform access including user management, badge approvals, dispute resolution |

To create an admin account, manually set `role = 'admin'` and `is_verified = 1` in the `users` table.

---

## API Overview

| Prefix                | Description                         |
| --------------------- | ----------------------------------- |
| `/api/users`          | Register, login, profile management |
| `/api/tours`          | CRUD for tour listings              |
| `/api/bookings`       | Create and manage bookings          |
| `/api/reviews`        | Tour and guide reviews              |
| `/api/messages`       | Direct messaging between users      |
| `/api/pusher`         | Pusher auth endpoint for real-time  |
| `/api/badge-requests` | Guide verification requests         |
| `/api/uploads`        | Cloudinary file upload              |
| `/api/disputes`       | Booking dispute management          |
| `/api/events`         | Cultural events                     |
| `/api/notifications`  | In-app notification system          |
| `/api/admin`          | Admin-only stats and controls       |
| `/api/ai`             | Gemini AI travel assistant          |

All protected routes require a `Bearer <token>` header obtained from `POST /api/users/login`.

---

## Client Routes

| Path           | Page              | Access        |
| -------------- | ----------------- | ------------- |
| `/`            | Home              | Public        |
| `/tours`       | Discover Tours    | Public        |
| `/tours/:slug` | Tour Details      | Public        |
| `/guides/:id`  | Guide Profile     | Public        |
| `/events`      | Events            | Public        |
| `/about`       | About             | Public        |
| `/login`       | Login             | Public        |
| `/signup`      | Sign Up           | Public        |
| `/dashboard`   | Tourist Dashboard | Tourist       |
| `/local`       | Guide Dashboard   | Local Guide   |
| `/admin`       | Admin Dashboard   | Admin         |
| `/account`     | Account Settings  | Authenticated |
| `/help`        | Help Center       | Public        |

---

## Environment Variables Reference

| Variable                     | Required | Description                 |
| ---------------------------- | -------- | --------------------------- |
| `PORT`                       | No       | Server port (default: 5000) |
| `JWT_SECRET`                 | Yes      | Secret for signing JWTs     |
| `MYSQL_HOST`                 | Yes      | MySQL host                  |
| `MYSQL_PORT`                 | No       | MySQL port (default: 3306)  |
| `MYSQL_USER`                 | Yes      | MySQL username              |
| `MYSQL_PASSWORD`             | Yes      | MySQL password              |
| `MYSQL_DATABASE`             | Yes      | MySQL database name         |
| `CLOUDINARY_CLOUD_NAME`      | Yes      | Cloudinary cloud name       |
| `CLOUDINARY_API_KEY`         | Yes      | Cloudinary API key          |
| `CLOUDINARY_API_SECRET`      | Yes      | Cloudinary API secret       |
| `PUSHER_APP_ID`              | Yes      | Pusher app ID               |
| `NEXT_PUBLIC_PUSHER_KEY`     | Yes      | Pusher key                  |
| `PUSHER_SECRET`              | Yes      | Pusher secret               |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Yes      | Pusher cluster (e.g. `ap2`) |
| `GEMINI_API_KEY`             | Yes      | Google Gemini API key       |
| `CLIENT_URL`                 | No       | Frontend origin for CORS    |

---

## License

ISC

