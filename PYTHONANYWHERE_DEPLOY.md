# 🚀 PythonAnywhere Backend Deployment Guide

## Why PythonAnywhere?

- ✅ **100% FREE** forever
- ✅ **Python 3.10** support
- ✅ **PyMuPDF works** perfectly
- ✅ **Easy setup** - no credit card needed
- ✅ **Persistent storage** for uploaded files
- ✅ **SQLite database** included

---

## 📋 Step-by-Step Deployment (15 minutes)

### Step 1: Create Account

1. Go to **https://www.pythonanywhere.com**
2. Click "Start running Python online in less than a minute!"
3. Click "Create a Beginner account" (FREE)
4. Fill in your details
5. Verify your email

### Step 2: Open Bash Console

1. Once logged in, click "Consoles" tab
2. Click "Bash" to open a new console
3. You'll see a terminal

### Step 3: Clone Your Repository

In the Bash console, run:

```bash
git clone https://github.com/abhiramvsmg/DocSign-App.git
cd DocSign-App/backend
```

### Step 4: Create Virtual Environment

```bash
mkvirtualenv --python=/usr/bin/python3.10 docsign-env
```

### Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install all packages including PyMuPDF!

### Step 6: Create WSGI Configuration

1. Go to "Web" tab
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Select "Python 3.10"
5. Click "Next"

### Step 7: Configure WSGI File

1. On the Web tab, find "Code" section
2. Click on the WSGI configuration file link (e.g., `/var/www/yourusername_pythonanywhere_com_wsgi.py`)
3. Delete all content and replace with:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/DocSign-App/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['SECRET_KEY'] = 'fkn_vZfQCUa1zTFVOk2klSRhYT2HddEKY_QhbtQEx1Bw'
os.environ['ALGORITHM'] = 'HS256'
os.environ['ACCESS_TOKEN_EXPIRE_MINUTES'] = '30'

# Import the FastAPI app
from main import app as application
```

**Important:** Replace `yourusername` with your actual PythonAnywhere username!

### Step 8: Set Virtual Environment

1. Still on the Web tab, find "Virtualenv" section
2. Enter: `/home/yourusername/.virtualenvs/docsign-env`
3. Replace `yourusername` with your username

### Step 9: Set Working Directory

1. In "Code" section, find "Working directory"
2. Set to: `/home/yourusername/DocSign-App/backend`

### Step 10: Create Uploads Directory

In the Bash console:

```bash
cd ~/DocSign-App/backend
mkdir -p uploads
chmod 755 uploads
```

### Step 11: Reload Web App

1. Scroll to top of Web tab
2. Click the big green "Reload" button
3. Wait for it to finish

### Step 12: Test Your Backend

Your backend URL will be:
```
https://yourusername.pythonanywhere.com
```

Test it by visiting:
```
https://yourusername.pythonanywhere.com/docs
```

You should see the FastAPI documentation!

---

## 🔧 Update Frontend to Use Backend

### Step 1: Update API Configuration

Edit `frontend/src/config/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://yourusername.pythonanywhere.com'  // Your PythonAnywhere URL
    : 'http://127.0.0.1:8000');
```

### Step 2: Update CORS in Backend

Edit `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://doc-sign-app.vercel.app",  # Your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Push Changes to GitHub

```powershell
git add -A
git commit -m "Update API URL and CORS for production"
git push
```

### Step 4: Update Backend on PythonAnywhere

In PythonAnywhere Bash console:

```bash
cd ~/DocSign-App
git pull
```

Then reload the web app from the Web tab.

### Step 5: Redeploy Frontend on Vercel

Vercel will automatically redeploy when you push to GitHub!

---

## ✅ Verification

1. **Backend API**: Visit `https://yourusername.pythonanywhere.com/docs`
2. **Frontend**: Visit `https://doc-sign-app.vercel.app`
3. **Test Login**: Try creating an account and logging in
4. **Test Upload**: Upload a PDF document
5. **Test Signing**: Complete the full workflow

---

## 🐛 Troubleshooting

### "Internal Server Error"
- Check error logs in PythonAnywhere Web tab → "Log files" → "Error log"
- Make sure WSGI file has correct username
- Verify virtual environment path

### "CORS Error"
- Make sure you updated `main.py` with Vercel URL
- Reload web app after changes
- Clear browser cache

### "Module not found"
- Make sure you're in the virtual environment
- Run `pip install -r requirements.txt` again
- Check that virtual environment path is correct in Web tab

---

## 💰 Free Tier Limits

PythonAnywhere free tier includes:
- ✅ One web app
- ✅ 512 MB storage
- ✅ 100 seconds CPU time per day
- ✅ HTTPS included
- ✅ No credit card required

Perfect for portfolio projects!

---

## 🎯 Next Steps

After deployment:
1. Test all features
2. Update README with both URLs
3. Add URLs to GitHub repository
4. Share your project!

---

**Your full-stack app will be 100% live!** 🚀
