# Emotion Tracking Web Application

A full-stack web application for log & share emotions, track patterns over time, and analyze how activities influence mood securely over time.

Built using **Svelte**, **Node.js (Express)**, and **MongoDB & Neo4j**, deployed using **Docker** and **Nginx**.

---

## Why

The system tracks:

> **What you do → How you feel**

Over time, it identifies patterns like:

- “Music improves mood”
- “Studying is associated with stress”
- “Gym correlates with positive emotions”

This enables **data-driven self-awareness and behavioral insights**.

---

## Features

- User authentication
- Session-based authentication
- Emotion logging with color tagging
- Activity-based emotion tracking
- Social sharing with friends
- Analytics - activity vs emotion patterns
- Retrieve emotion history per user
- Manage active sessions (view, revoke single session, revoke all)
- Cross-origin support with secure CORS configuration
- Scalable backend with database abstraction

---

## Architecture Overview

## ![Architecture](arch/EmotionsTrackingApplication.png)

## Tech Stack

- **Frontend**: Svelte + JavaScript
- **Backend**: NodeJS + ExpressJS
- **Database**: MongoDB + Neo4j
- **Deployment & Infrastructure**: Docker + Nginx (reverse proxy)

---

## Why Neo4j

In order to perform activity vs emotion frequency analysis, we need to perform multiple many to many relation queries. These queries are computationally expensive in MongoDB due to individual document retrieval. Neo4j models these relationships natively as a graph, enabling efficient traversal and faster relationship-based queries

- Activity vs emotion frequency analysis
- Mood pattern detection
- Behavioral insights
- Relationship traversal

For example:

- Gym → 80% positive emotions
- Music → 90% positive emotions
- Studying → mostly negative

---

## Environment Variables

Create a `.env` file in the backend root:

```env
FRONTEND_URL=http://localhost:5173
MONGO_URL=mongodb://localhost:27017/dbname
NEO4J_URL=neo4j://username:password@localhost:7687
```

---

## Using Docker

```
docker compose up -d --build
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
