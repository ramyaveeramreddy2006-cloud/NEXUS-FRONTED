# NEXUS Deployment Guide

This guide uses a separate React frontend and Spring Boot API. A managed MySQL database is required for production; the local H2 database is for development only.

## 1. Run locally

Install Java 17+, Maven, Node.js 20+, and npm. From the project root, run `run-nexus.cmd`, or use two terminals:

```powershell
cd backend
mvn spring-boot:run
```

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API health endpoint is `http://localhost:8081/api/health`.

## 2. Push the project to GitHub

Follow [`GITHUB.md`](GITHUB.md). The root `.gitignore` excludes the H2 database, build output, dependencies, IDE settings, and environment files. Review `git status` before committing.

## 3. Deploy the backend

Create a Java web service from the GitHub repository with the service root directory set to `backend`. Use:

Build command:

```text
mvn -B clean package -DskipTests
```

Start command:

```text
java -jar target/nexus-platform-1.0.0.jar
```

Set these variables in the hosting provider (do not commit them):

- `SPRING_PROFILES_ACTIVE=prod`
- `PORT` (usually provided by the host)
- `DB_URL` — JDBC URL for a managed MySQL database
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET` — a long, randomly generated secret
- `CORS_ALLOWED_ORIGINS` — the exact HTTPS origin of the deployed frontend
- Optional: `AI_ENABLED`, `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL`

The production profile disables predictable demo user accounts. The starter catalogue is still added if the database is empty. Confirm the API is live at `https://YOUR-BACKEND-DOMAIN/api/health`.

## 4. Deploy the frontend

Create a static site from the same repository with the project root set to `frontend`.

Build command:

```text
npm run build
```

Output directory: `dist`

Set this build environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

The frontend includes SPA fallback configuration for Vercel and Netlify. Set the backend `CORS_ALLOWED_ORIGINS` to the exact frontend URL after the hosting provider assigns it, then redeploy the backend.

## 5. Before sharing the live link

- Register a fresh account and verify login, field selection, and the main content pages.
- Check the API health endpoint and confirm frontend API calls reach the deployed backend.
- Confirm the database is managed and persistent; do not use the local H2 file in production.
- Use HTTPS and keep API keys, database credentials, and JWT secrets in host secret settings.
- Verify the language selector and project document links on the deployed site.
