# 🚀 Quick Deployment Steps for DocSign App

## ✅ Files Ready for Deployment

Your project is now configured for deployment with:
- ✅ `backend/requirements.txt` - All Python dependencies
- ✅ `frontend/.env.production` - Production environment config
- ✅ `frontend/src/config/api.ts` - API configuration
- ✅ All changes pushed to GitHub

---

## 📋 Deploy Backend on Render (5 minutes)

### Step 1: Sign Up & Connect
1. Go to **https://render.com**
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Find and select `DocSign-App` repository
3. Click "Connect"

### Step 3: Configure Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `docsign-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### Step 4: Add Environment Variables
Click "Advanced" → Add these environment variables:

```
SECRET_KEY = your-super-secret-random-string-here
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. **Copy your backend URL**: `https://docsign-backend-xxxx.onrender.com`

---

## 📋 Deploy Frontend on Vercel (3 minutes)

### Step 1: Sign Up & Connect
1. Go to **https://vercel.com**
2. Click "Sign Up"
3. Sign up with GitHub
4. Authorize Vercel

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find and import `DocSign-App`
3. Click "Import"

### Step 3: Configure Project
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 4: Add Environment Variable
Click "Environment Variables" → Add:

```
VITE_API_URL = https://docsign-backend-xxxx.onrender.com
```
*(Replace with your actual Render backend URL from Step 5 above)*

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. **Your app is live!** 🎉

---

## 🔧 Update Backend CORS

After deployment, you need to update CORS to allow your frontend:

1. Open `backend/main.py`
2. Update the CORS middleware:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://docsign-app.vercel.app",  # Add your Vercel URL
        "https://your-custom-domain.com"   # If you have one
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. Commit and push:
```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-redeploy!

---

## 🌐 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://docsign-app.vercel.app`
- **Backend API**: `https://docsign-backend-xxxx.onrender.com`
- **API Docs**: `https://docsign-backend-xxxx.onrender.com/docs`

---

## 📝 Add Website URL to GitHub

1. Go to https://github.com/abhiramvsmg/DocSign-App
2. Click ⚙️ gear icon next to "About"
3. Paste your Vercel URL in "Website"
4. Add description: "Enterprise digital signature platform"
5. Add topics: `digital-signature`, `fastapi`, `react`, `typescript`
6. Click "Save changes"

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Render**: Backend sleeps after 15 min of inactivity (first request takes ~30 seconds to wake up)
- **Vercel**: No sleep, instant response

### Database
- Currently using SQLite (file-based)
- For production, add PostgreSQL on Render:
  - Go to Render Dashboard → "New +" → "PostgreSQL"
  - Connect to your web service
  - Update `DATABASE_URL` environment variable

### File Uploads
- Uploaded PDFs are stored on Render's disk
- **Warning**: Files are deleted when service restarts
- For production: Use AWS S3 or Cloudinary for file storage

---

## 🎉 You're Done!

Your DocSign app is now live and accessible worldwide!

**Next Steps:**
1. Test the live app thoroughly
2. Share the URL with friends/recruiters
3. Add to your portfolio/resume
4. Consider custom domain (optional)

---

**Need help?** Check the full `DEPLOYMENT_GUIDE.md` or let me know!
