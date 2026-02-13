# 🚀 SIMPLEST DEPLOYMENT - Vercel for Everything

## Why This is Easier:
- ✅ **One platform** for both frontend and backend
- ✅ **Completely free** for hobby projects
- ✅ **Automatic deployments** from GitHub
- ✅ **No configuration needed**

---

## 📋 Deploy in 5 Minutes

### Step 1: Go to Vercel
1. Visit **https://vercel.com**
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Your Project
1. Click "Add New..." → "Project"
2. Find and select `DocSign-App`
3. Click "Import"

### Step 3: Deploy Frontend First
1. **Framework Preset**: Vite
2. **Root Directory**: Click "Edit" → Enter `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Click "Deploy"

Wait 2 minutes - your frontend will be live!

### Step 4: Deploy Backend Separately
1. Go back to Vercel dashboard
2. Click "Add New..." → "Project"
3. Select `DocSign-App` again
4. **Root Directory**: Click "Edit" → Enter `backend`
5. **Framework Preset**: Other
6. Add environment variables:
   ```
   SECRET_KEY=fkn_vZfQCUa1zTFVOk2klSRhYT2HddEKY_QhbtQEx1Bw
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
7. Click "Deploy"

---

## ⚠️ Important Note:
Vercel's free tier might have issues with PyMuPDF. If backend deployment fails, use:
- **Frontend on Vercel** (works perfectly)
- **Backend on Railway** (handles PyMuPDF)

This gives you the best of both worlds!

---

## 🎯 What to Try First:
1. Deploy frontend on Vercel (will definitely work)
2. Try backend on Vercel (might work)
3. If backend fails, use Railway for backend only

Let me know which approach you want to take!
