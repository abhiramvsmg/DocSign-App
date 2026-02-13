# 🚀 GitHub Upload Guide for DocSign App

## Step-by-Step Instructions

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `docsign-app` (or your preferred name)
   - **Description**: "Enterprise-grade digital signature platform with PDF manipulation and audit trails"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### 2. Configure Git (Update with Your Details)

Run these commands in PowerShell (replace with your actual name and email):

```powershell
cd "c:\Users\abhir\Desktop\DocSign App"
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 3. Stage All Files

```powershell
git add .
```

This will add all files except those in .gitignore (like node_modules, database, uploads, etc.)

### 4. Create First Commit

```powershell
git commit -m "Initial commit: DocSign enterprise digital signature platform"
```

### 5. Connect to GitHub Repository

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub username and repository name:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

**Example:**
```powershell
git remote add origin https://github.com/johndoe/docsign-app.git
```

### 6. Rename Branch to Main (if needed)

```powershell
git branch -M main
```

### 7. Push to GitHub

```powershell
git push -u origin main
```

You may be prompted to authenticate. Use your GitHub username and **Personal Access Token** (not password).

---

## 🔑 Creating a GitHub Personal Access Token

If you don't have a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "DocSign Upload"
4. Select scopes: Check **"repo"** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

---

## 📋 Quick Command Summary

Once you have your GitHub repo created, run these commands:

```powershell
# Navigate to project
cd "c:\Users\abhir\Desktop\DocSign App"

# Configure git (replace with your details)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Stage all files
git add .

# Create first commit
git commit -m "Initial commit: DocSign enterprise digital signature platform"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## ✅ What Gets Uploaded

**Included:**
- ✅ All source code (backend & frontend)
- ✅ README.md with screenshots
- ✅ Configuration files
- ✅ Screenshots folder
- ✅ Documentation files

**Excluded (via .gitignore):**
- ❌ node_modules/
- ❌ __pycache__/
- ❌ Database files (docsign.db)
- ❌ Uploaded PDFs
- ❌ Environment variables (.env)
- ❌ Build artifacts

---

## 🔧 Troubleshooting

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Error: "failed to push some refs"
```powershell
git pull origin main --rebase
git push -u origin main
```

### Authentication Failed
- Make sure you're using a **Personal Access Token**, not your password
- Token must have **"repo"** scope enabled

---

## 📝 After Uploading

Once uploaded, your repository will be live at:
```
https://github.com/YOUR_USERNAME/REPO_NAME
```

The README.md with screenshots will automatically display on the repository homepage!

---

## 🎯 Next Steps After Upload

1. **Add Topics/Tags**: On GitHub, add topics like `digital-signature`, `fastapi`, `react`, `typescript`, `pdf`
2. **Update Repository Description**: Add a short description
3. **Enable GitHub Pages** (optional): For hosting documentation
4. **Add to Portfolio**: Link to this repo from your portfolio/resume

---

**Need help?** Just let me know which step you're on!
