# 🚀 Railway Deployment Guide (RECOMMENDED - Works Better!)

## Why Railway Instead of Render?

- ✅ **Better Python support** - handles PyMuPDF compilation
- ✅ **$5 free credit/month** - enough for hobby projects
- ✅ **Faster deployments**
- ✅ **Better error handling**
- ✅ **Full PDF functionality** works!

---

## 📋 Deploy Backend on Railway (5 minutes)

### Step 1: Sign Up
1. Go to **https://railway.app**
2. Click "Start a New Project"
3. Sign up with GitHub
4. Authorize Railway

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `DocSign-App` repository
4. Click "Deploy Now"

### Step 3: Configure Service
Railway will auto-detect your Python app. Add these environment variables:

Click "Variables" tab and add:

```
SECRET_KEY=fkn_vZfQCUa1zTFVOk2klSRhYT2HddEKY_QhbtQEx1Bw
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Step 4: Set Root Directory
1. Click "Settings"
2. Find "Root Directory"
3. Set to: `backend`
4. Save

### Step 5: Deploy!
1. Railway will automatically deploy
2. Wait 3-5 minutes
3. Click "Deployments" to watch progress
4. Once done, click "Generate Domain" to get your URL

**Your backend URL**: `https://docsign-backend-production.up.railway.app`

---

## 📋 Deploy Frontend on Vercel (3 minutes)

### Step 1: Sign Up
1. Go to **https://vercel.com**
2. Sign up with GitHub

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import `DocSign-App`
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variable
```
VITE_API_URL=https://your-railway-url.up.railway.app
```
(Replace with your actual Railway URL)

### Step 4: Deploy
Click "Deploy" and wait 2 minutes!

**Your frontend URL**: `https://docsign-app.vercel.app`

---

## 🔧 Update Backend CORS

After deployment, update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://docsign-app.vercel.app",  # Your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push - Railway auto-deploys!

---

## 💰 Railway Free Tier

- **$5 credit/month**
- **500 hours** of usage
- **100GB bandwidth**
- Perfect for portfolio projects!

---

## ✅ Advantages Over Render

| Feature | Railway | Render |
|---------|---------|--------|
| PyMuPDF Support | ✅ Yes | ❌ No |
| Build Speed | ⚡ Fast | 🐌 Slow |
| Free Tier | $5 credit | 750 hours |
| Auto-deploy | ✅ Yes | ✅ Yes |
| PDF Merging | ✅ Works | ❌ Fails |

---

## 🎯 Quick Start

1. **Sign up**: https://railway.app
2. **Deploy from GitHub**: Select `DocSign-App`
3. **Set root directory**: `backend`
4. **Add environment variables**: SECRET_KEY, ALGORITHM
5. **Generate domain**: Get your URL
6. **Done!** 🎉

---

**This WILL work!** Railway handles Python packages much better than Render.
