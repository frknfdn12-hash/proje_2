# StudyHub — Full-Stack School Assignment

A modern full-stack web app with **user registration/login**, **JWT authentication**, and **CRUD operations** backed by a **SQLite database**.

## Tech stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 18, Vite, React Router        |
| Backend  | Node.js, Express                    |
| Database | SQLite (via `better-sqlite3`)       |
| Auth     | bcrypt + JSON Web Tokens (JWT)      |

## Features

- Register and sign in with email/password
- Protected dashboard (login required)
- Add, view, edit, and delete personal entries
- Search and filter by category
- Sleek dark UI with responsive layout

## Project structure

```
testt/
├── backend/          # REST API + database
│   ├── src/
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── middleware/
│   │   └── routes/
│   └── data/         # SQLite file (created on first run)
└── frontend/         # React SPA
    └── src/
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node.js)

## Setup & run

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

API runs at **http://localhost:3001**

### 2. Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** (proxies `/api` to the backend).

### 3. Use the app

1. Open http://localhost:5173
2. Click **Create one** to register
3. Sign in and add entries on the dashboard

## API endpoints

| Method | Endpoint              | Auth | Description        |
| ------ | --------------------- | ---- | ------------------ |
| POST   | `/api/auth/register`  | No   | Create account     |
| POST   | `/api/auth/login`     | No   | Sign in            |
| GET    | `/api/auth/me`        | Yes  | Current user       |
| GET    | `/api/items`          | Yes  | List entries       |
| POST   | `/api/items`          | Yes  | Create entry       |
| PUT    | `/api/items/:id`      | Yes  | Update entry       |
| DELETE | `/api/items/:id`      | Yes  | Delete entry       |

Send the JWT as: `Authorization: Bearer <token>`

## Environment variables

Copy `backend/.env.example` to `backend/.env` and set:

- `PORT` — API port (default `3001`)
- `JWT_SECRET` — secret for signing tokens
- `JWT_EXPIRES_IN` — token lifetime (e.g. `7d`)

## Production build

```bash
cd frontend && npm run build
cd ../backend && npm start
```

Serve the `frontend/dist` folder with any static host and point API requests to your backend URL (update Vite proxy or use a reverse proxy).

## License

Free to use for educational purposes.
