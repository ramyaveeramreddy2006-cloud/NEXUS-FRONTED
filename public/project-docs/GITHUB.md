# Push NEXUS to GitHub

## Before pushing

1. Create an empty GitHub repository. Do not add a README or license there because this project already has a README.
2. Open PowerShell in the NEXUS project root.
3. Review ignored files and confirm the local database and environment files are excluded:

```powershell
git status --short
git check-ignore backend/data/nexus_db.mv.db
```

If Git has not been initialized in this folder yet:

```powershell
git init
git branch -M main
```

Commit the project:

```powershell
git add .
git status
git commit -m "Prepare NEXUS for deployment"
```

Connect the empty GitHub repository. Replace `YOUR_USERNAME` with your GitHub account name:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/NEXUS-FullStack-24EG107D60.git
git push -u origin main
```

For future updates:

```powershell
git add .
git commit -m "Describe the update"
git push
```

GitHub will use its browser or credential-manager sign-in flow when needed. Never place a personal access token in a command, project file, or remote URL. Never commit `.env` files, API keys, database passwords, production JWT secrets, or `backend/data/`.

After pushing, follow [`DEPLOYMENT.md`](DEPLOYMENT.md) to deploy the frontend and backend separately.
