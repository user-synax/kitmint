# KitMint — Deployment Guide

## Vercel Environment Variables
Set these in Vercel Project Settings → Environment Variables:

| Key | Value / Instructions |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in terminal |
| `NEXTAUTH_URL` | `https://kitmint.vercel.app` (Your production URL) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GROQ_API_KEY` | From [console.groq.com](https://console.groq.com) |

## MongoDB Atlas Setup
1. Create a free M0 cluster.
2. Go to **Network Access** → **Add IP Address** → Add `0.0.0.0/0` (required for Vercel).
3. Create a **Database User** with read/write permissions.
4. Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/kitmint`

## Google OAuth Setup
1. **Google Cloud Console** → Create New Project.
2. **APIs & Services** → **OAuth consent screen** → External.
3. **Credentials** → **Create Credentials** → **OAuth client ID** → Web Application.
4. **Authorized redirect URIs**:
   - `https://kitmint.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local development)

## Deployment Steps
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Connect the repository to Vercel.
3. Add the environment variables listed above.
4. Vercel will automatically build and deploy.

### Build Check
Run this locally before pushing to ensure no errors:
```bash
pnpm build
```
