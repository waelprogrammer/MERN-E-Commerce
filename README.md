# MERN E-Commerce Store

A fullstack e-commerce web application built with React, Vite, Express, and MongoDB.

## Live demo

- API: `https://mern-e-commerce-qzr7.onrender.com`
- Frontend: *Add the deployed frontend URL here once available*

## Features

- User registration and login
- JWT-based authentication for protected routes
- Product listing and featured product sections
- Admin panel for managing products and users
- MongoDB backend for persistent data
- Separate frontend and backend services for deployment

## Tech stack

- Frontend: React, Vite, Redux Toolkit, Axios, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Deployment: Render

## Repository structure

- `Backend/` — Express API and MongoDB models
- `frontend/` — React app built with Vite

## Local setup

### Backend

```bash
cd Backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

Use `.env` files locally and Render environment variables in production.

- `MONGO_URI` — MongoDB connection string
- `SECRET_KEY` — JWT secret key
- `VITE_API_URL` — backend API URL for the frontend

## Render deployment

### Backend service

- Root directory: `Backend`
- Build command: `npm install`
- Start command: `npm start`
- Env vars: `MONGO_URI`, `SECRET_KEY`

### Frontend service

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Env var: `VITE_API_URL=https://mern-e-commerce-qzr7.onrender.com`

## Admin account

The backend automatically creates a default admin user at startup if none exists:

- Username: `admin`
- Password: `admin123`

## Notes for recruiters

- The project uses a clean frontend/backend split.
- The frontend consumes the backend via `VITE_API_URL`.
- The app is deployment-ready for Render.
