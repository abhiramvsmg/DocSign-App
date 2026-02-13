# 🚀 DocSign App Deployment Guide

## Deployment Options

Your DocSign app has two parts that need to be deployed separately:
1. **Backend** (FastAPI/Python) 
2. **Frontend** (React/Vite)

---

## 🎯 Recommended Deployment Stack

### Option 1: Render + Vercel (FREE & EASY)

#### **Backend on Render** (Free tier available)
- ✅ Free tier with 750 hours/month
- ✅ Automatic deployments from GitHub
- ✅ Built-in PostgreSQL database
- ✅ Easy environment variable management

#### **Frontend on Vercel** (Free tier)
- ✅ Unlimited bandwidth
- ✅ Automatic deployments from GitHub
- ✅ Custom domains
- ✅ Lightning-fast CDN

---

## 📋 Step-by-Step Deployment

### Part 1: Deploy Backend to Render

#### 1. Create `requirements.txt` (if not exists)
```bash
cd backend
pip freeze > requirements.txt
```

#### 2. Create `render.yaml` in project root
```yaml
services:
  - type: web
    name: docsign-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: docsign-db
          property: connectionString

databases:
  - name: docsign-db
    databaseName: docsign
    user: docsign
```

#### 3. Deploy on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `DocSign-App` repository
5. Configure:
   - **Name**: `docsign-backend`
   - **Environment**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `SECRET_KEY`: (generate a random string)
   - `DATABASE_URL`: (Render will provide this)
7. Click "Create Web Service"

**Your backend URL will be**: `https://docsign-backend.onrender.com`

---

### Part 2: Deploy Frontend to Vercel

#### 1. Update Frontend API URL
Create `frontend/.env.production`:
```env
VITE_API_URL=https://docsign-backend.onrender.com
```

Update `frontend/src/api/config.ts` (or wherever you define API base URL):
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

#### 2. Deploy on Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your `DocSign-App` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: `https://docsign-backend.onrender.com`
7. Click "Deploy"

**Your frontend URL will be**: `https://docsign-app.vercel.app`

---

## 🔧 Alternative Deployment Options

### Option 2: Railway (Full-Stack)
- Deploy both frontend and backend on Railway
- Free tier: $5 credit/month
- URL: https://railway.app

### Option 3: Fly.io (Backend) + Netlify (Frontend)
- Fly.io: Free tier for backend
- Netlify: Free tier for frontend
- Good for global distribution

### Option 4: AWS/Azure/GCP
- More complex but production-ready
- Requires more configuration
- Best for enterprise deployment

---

## 📝 Pre-Deployment Checklist

### Backend Preparation
- [ ] Create `requirements.txt`
- [ ] Update CORS to allow frontend domain
- [ ] Set up environment variables
- [ ] Test database migrations
- [ ] Configure SMTP for emails (optional)

### Frontend Preparation
- [ ] Update API base URL for production
- [ ] Build and test locally (`npm run build`)
- [ ] Verify all environment variables
- [ ] Test production build

---

## 🔐 Important Configuration Changes

### 1. Update CORS in `backend/main.py`
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://docsign-app.vercel.app",  # Add your Vercel URL
        "https://your-custom-domain.com"   # Add custom domain if any
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Environment Variables to Set

**Backend (Render):**
```
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://... (Render provides this)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
APP_URL=https://docsign-app.vercel.app
```

**Frontend (Vercel):**
```
VITE_API_URL=https://docsign-backend.onrender.com
```

---

## 🎯 Quick Start: Deploy in 10 Minutes

### Using Render + Vercel (Recommended)

**1. Backend (5 minutes)**
```bash
# In your project root
cd backend
pip freeze > requirements.txt
git add .
git commit -m "Add requirements.txt for deployment"
git push
```
Then deploy on Render.com using your GitHub repo.

**2. Frontend (5 minutes)**
```bash
# Update API URL in frontend
cd frontend
echo "VITE_API_URL=https://your-backend-url.onrender.com" > .env.production
git add .
git commit -m "Add production environment config"
git push
```
Then deploy on Vercel.com using your GitHub repo.

---

## 🌐 Adding URL to GitHub

Once deployed, add your live URL to GitHub:

1. Go to your repository: https://github.com/abhiramvsmg/DocSign-App
2. Click the ⚙️ gear icon next to "About"
3. Add your website URL: `https://docsign-app.vercel.app`
4. Add description and topics
5. Click "Save changes"

---

## 📊 Free Tier Limits

| Platform | Free Tier Limits |
|----------|------------------|
| **Render** | 750 hours/month, 512MB RAM, sleeps after inactivity |
| **Vercel** | Unlimited bandwidth, 100GB bandwidth/month |
| **Railway** | $5 credit/month |
| **Netlify** | 100GB bandwidth/month |

---

## 🐛 Common Deployment Issues

### Backend won't start
- Check `requirements.txt` includes all dependencies
- Verify `PORT` environment variable is used
- Check logs on Render dashboard

### Frontend can't connect to backend
- Verify CORS settings include frontend URL
- Check `VITE_API_URL` environment variable
- Ensure backend is running (not sleeping)

### Database connection fails
- Use Render's PostgreSQL addon
- Update `DATABASE_URL` in environment variables
- Run migrations after deployment

---

## 🎉 After Deployment

Your live URLs will be:
- **Frontend**: `https://docsign-app.vercel.app`
- **Backend API**: `https://docsign-backend.onrender.com`
- **API Docs**: `https://docsign-backend.onrender.com/docs`

Add the frontend URL to your GitHub repository settings!

---

**Need help with deployment?** Let me know which platform you choose and I'll guide you through it step-by-step!
