# NEXUS frontend

React single-page application built with Vite. It uses the separately deployed NEXUS Spring Boot API.

## Local development

Requirements: Node.js 20+ and npm.

```powershell
npm ci
npm run dev
```

Create a local `.env` file from `.env.example` if the API is not running at `http://localhost:8081/api`. Open `http://localhost:5173`.

## Production deployment

Deploy this repository as a Vercel Vite project with `npm run build` and output directory `dist`. Set `VITE_API_URL` in the Vercel project environment to the backend API URL ending in `/api`, for example `https://YOUR-BACKEND-DOMAIN/api`. Configure the backend's `CORS_ALLOWED_ORIGINS` to the exact deployed frontend origin.
