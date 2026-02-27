# Emotion Tracking Web Application

A full-stack web application for tracking, storing, and managing user emotions securely over time.

Built using **Svelte**, **Node.js (Express)**, and **PostgreSQL, deployed on Azure** with **Nginx** as a reverse proxy and **PM2** for process management.

---

## Features

- User authentication
- Session-based authentication
- Emotion logging with color tagging
- Retrieve emotion history per user
- Manage active sessions (view, revoke single session, revoke all)
- Cross-origin support with secure CORS configuration
- Scalable backend with database abstraction

---

## Architecture Overview

![Architecture](design/architecture.png)
![Architecture](design/architecture2.png)

---
## Software Design

- **Polymorphic Abstraction**: A class-based database layer allows the app to switch between PostgreSQL and MongoDB via `.env` configuration without changing the API logic.
- **Layered N-Tier Architecture**: Clean separation between the Presentation (Svelte), Logic (Express Middleware), and Data Abstraction layers.
- **Low Coupling**: The frontend and backend communicate strictly via a JSON API contract.
- **Stateful Security**: Unlike stateless JWTs, database-backed sessions allow for Remote Session Revocation.

---

## Tech Stack

- **Frontend**: Svelte + JavaScript
- **Backend**: NodeJS + ExpressJS
- **Database**: PostgreSQL
- **Deployment & Infrastructure**: Azure VM - Nginx & PM2

---

## Project Structure

```
├── backend/
│   ├── app.js
│   ├── classes/ 
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── design/
│   ├── architecture2.png
│   └── architecture.png
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── jsconfig.json
│   ├── nginx/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/                 
│   ├── src/
│   ├── svelte.config.js
│   └── vite.config.js
├── package.json
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

Create a `.env` file in the backend root:

```env
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@host:port/dbname
MONGO_URL=mongodb://localhost:27017/dbname
```

---

## Running Locally

### Backend

```bash
npm install
node index.js
```

Backend runs on:

```
http://localhost:3000
```

---

### Frontend

```bash
npm install
npm run dev
```

---

## Authentication Flow

1. User signs up → password hashed using bcrypt
2. User logs in → credentials verified
3. Server creates session token
4. Token stored as HTTP-only cookie
5. Protected routes validate session

---

## API Endpoints

| Endpoint     | Method | Description            |
| ------------ | ------ | ---------------------- |
| `/signin`    | POST   | Create user            |
| `/login`     | POST   | Login user             |
| `/save`      | POST   | Save emotion           |
| `/data`      | POST   | Fetch emotions         |
| `/logout`    | POST   | Logout current session |
| `/sessions`  | POST   | View active sessions   |
| `/revoke`    | POST   | Revoke one session     |
| `/revokeAll` | POST   | Revoke all sessions    |

---

## Security

- Password hashing with bcrypt
- HTTP-only cookies for sessions
- CORS configured with credentials
- Designed to support HTTPS with SSL/TLS via Nginx

---

## Future Improvements

- Emotion analytics & visualization
- Neo4j for social emotion sharing graph
