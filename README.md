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

Deploy this repository as a Netlify Vite site with build command `npm run build` and publish directory `dist`. The production build reads `VITE_API_URL` from `.env.production`; update it if the Render service URL changes. Configure the backend's `CORS_ALLOWED_ORIGINS` to the exact deployed frontend origin (`https://nexus-24eg107d60.netlify.app`).
