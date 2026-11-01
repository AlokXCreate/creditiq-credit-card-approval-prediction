# CREDITIQ Production Deployment Guide

CREDITIQ is architected for seamless multi-cloud production deployment.

## 1. Production Architecture Overview

- **Frontend**: React + TypeScript + Vite, statically hosted on **Vercel** or **Netlify**.
- **Backend API**: Python FastAPI + Uvicorn ASGI server, hosted on **Render**, **Railway**, or **AWS/GCP Cloud Run**.
- **Database**: SQLite (persisted on persistent disk) or remote PostgreSQL/Supabase.
- **ML Artifacts**: Pre-trained Scikit-learn Pipeline bundled within `backend/ml/artifacts/`.

---

## 2. Deploying Backend on Render

1. Create a free account at [render.com](https://render.com).
2. Connect your GitHub repository: `https://github.com/AlokXCreate/creditiq-credit-card-approval-prediction`.
3. Choose **New Web Service**.
4. Configure service parameters:
   - **Name**: `creditiq-api`
   - **Environment**: `Python 3`
   - **Region**: `Oregon (US West)` or closest to your users.
   - **Branch**: `main`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Configure Environment Variables:
   - `CORS_ORIGINS`: `*` (or your Vercel URL, e.g., `https://creditiq.vercel.app`)
   - `DATABASE_URL`: `sqlite:///./creditiq.db`
6. Click **Create Web Service**. Once deployed, copy your backend URL (e.g. `https://creditiq-api.onrender.com`).
7. Verify health: `https://creditiq-api.onrender.com/api/health`.

---

## 3. Deploying Frontend on Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New... > Project** and import `creditiq-credit-card-approval-prediction`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variables:
   - `VITE_API_URL`: `https://creditiq-api.onrender.com` (Your Render backend URL)
5. Click **Deploy**. Vercel will build and assign a production HTTPS URL (e.g. `https://creditiq-credit-card.vercel.app`).

---

## 4. Local Development Setup

To run both services simultaneously on your local workstation:

### Backend
```powershell
# In project root:
.\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```
Backend will be available at `http://localhost:8000` (API docs at `http://localhost:8000/docs`).

### Frontend
```powershell
cd frontend
npm run dev
```
Frontend will be available at `http://localhost:5173`.
