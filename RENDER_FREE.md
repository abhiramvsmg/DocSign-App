# 🚀 Simple Render Deployment (FREE - No Docker, No Payment!)

## ✅ This Will Work Because:
- Uses Render's FREE tier (no payment needed)
- No Docker required
- Simple Python web service
- PyMuPDF will compile automatically

---

## 📋 Deploy in 5 Minutes:

### Step 1: Go to Render
Visit: **https://render.com**

### Step 2: Sign Up/Login
- Click "Get Started for Free"
- Sign up with GitHub

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Select `DocSign-App` repository
4. Click "Connect"

### Step 4: Configure Service

Fill in these settings:

- **Name**: `docsign-backend`
- **Region**: Choose closest to you
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `./build.sh`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 5: Add Environment Variables

Click "Advanced" → Add these:

```
SECRET_KEY = fkn_vZfQCUa1zTFVOk2klSRhYT2HddEKY_QhbtQEx1Bw
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### Step 6: Select Free Plan

- Scroll down to "Instance Type"
- Select **"Free"** (not Starter!)
- Click "Create Web Service"

---

## ⏱️ Wait for Build (5-7 minutes)

Render will:
1. Install Python 3.10
2. Run build.sh (install dependencies)
3. Start uvicorn server
4. Give you a URL like: `https://docsign-backend.onrender.com`

---

## ✅ Once Deployed:

Your backend will be at: `https://docsign-backend.onrender.com`

Test it: `https://docsign-backend.onrender.com/docs`

---

## 🎯 Then Update Frontend:

Update `frontend/src/config/api.ts` with your Render URL and push to GitHub!

---

**This is the FREE tier - no payment required!** 🎉
