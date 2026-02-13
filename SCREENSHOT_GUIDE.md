# 📸 Screenshot Guide for DocSign App

## How to Capture Screenshots

Since you want to add screenshots to showcase your app, here's a guide on which pages to capture and how to do it manually.

### 🎯 Key Pages to Screenshot

#### 1. **Login Page** (`/login`)
- **URL**: `http://localhost:5173/login`
- **What to show**: Clean login form with email/password fields
- **Filename**: `01-login-page.png`

#### 2. **Register Page** (`/register`)
- **URL**: `http://localhost:5173/register`
- **What to show**: Registration form with full name, email, password
- **Filename**: `02-register-page.png`

#### 3. **Dashboard** (`/dashboard`)
- **URL**: `http://localhost:5173/dashboard`
- **What to show**: 
  - Document list with different statuses (draft, pending, completed)
  - Statistics cards (Pending Signatures, Completed)
  - Search bar and filter tabs
- **Filename**: `03-dashboard.png`

#### 4. **Documents Page** (`/documents`)
- **URL**: `http://localhost:5173/documents`
- **What to show**: 
  - Full document list
  - Search and filter dropdown
  - Document cards with status indicators
- **Filename**: `04-documents-page.png`

#### 5. **Signature Studio** (`/documents/{id}/edit`)
- **URL**: `http://localhost:5173/documents/3/edit` (use any document ID)
- **What to show**:
  - PDF viewer with document
  - Signature field placement tools on left sidebar
  - Placed signature fields on the PDF
- **Filename**: `05-signature-studio.png`

#### 6. **Signing Page** (`/documents/{id}/sign`)
- **URL**: `http://localhost:5173/documents/3/sign`
- **What to show**:
  - PDF with signature fields
  - Signature pad modal (if possible, capture while signing)
- **Filename**: `06-signing-page.png`

#### 7. **Signature Pad Modal**
- **What to show**: The signature drawing canvas with a drawn signature
- **Filename**: `07-signature-pad.png`

#### 8. **Public Signing Page** (`/sign/{token}`)
- **URL**: Use a signing link from your dashboard (Share button)
- **What to show**: Guest signing interface
- **Filename**: `08-public-signing.png`

#### 9. **Settings Page** (`/settings`)
- **URL**: `http://localhost:5173/settings`
- **What to show**:
  - Profile information section
  - Security settings
  - Notification preferences
- **Filename**: `09-settings-page.png`

#### 10. **Completed Document**
- **What to show**: Dashboard with a completed document showing green checkmark
- **Filename**: `10-completed-document.png`

---

## 📝 How to Take Screenshots (Windows)

### Method 1: Windows Snipping Tool (Recommended)
1. Press `Windows + Shift + S`
2. Select the area you want to capture
3. Screenshot is copied to clipboard
4. Open Paint or any image editor
5. Paste (`Ctrl + V`)
6. Save to `c:\Users\abhir\Desktop\DocSign App\screenshots\`

### Method 2: Full Screen
1. Press `PrtScn` (Print Screen) key
2. Open Paint
3. Paste (`Ctrl + V`)
4. Crop if needed
5. Save to screenshots folder

### Method 3: Browser Developer Tools
1. Press `F12` in your browser
2. Press `Ctrl + Shift + P`
3. Type "screenshot"
4. Select "Capture full size screenshot"
5. Save to screenshots folder

---

## 🎨 Screenshot Tips for Best Results

### Before Taking Screenshots:
1. ✅ Use a clean browser window (no bookmarks bar if possible)
2. ✅ Zoom to 100% (`Ctrl + 0`)
3. ✅ Use a consistent window size (1920x1080 recommended)
4. ✅ Make sure your app has sample data (documents in different states)
5. ✅ Close browser dev tools
6. ✅ Use light/dark mode consistently

### What Makes a Good Screenshot:
- 📌 Shows the full interface clearly
- 📌 Includes relevant data (not empty states)
- 📌 Demonstrates key features
- 📌 Has good contrast and readability
- 📌 Shows realistic use cases

---

## 📁 Organizing Screenshots

Save all screenshots to:
```
c:\Users\abhir\Desktop\DocSign App\screenshots\
```

### Recommended Naming Convention:
```
01-login-page.png
02-register-page.png
03-dashboard.png
04-documents-page.png
05-signature-studio.png
06-signing-page.png
07-signature-pad.png
08-public-signing.png
09-settings-page.png
10-completed-document.png
```

---

## 🚀 Where to Use Screenshots

### 1. **README.md**
Add a "Screenshots" section:
```markdown
## 📸 Screenshots

### Login Page
![Login Page](./screenshots/01-login-page.png)

### Dashboard
![Dashboard](./screenshots/03-dashboard.png)

### Signature Studio
![Signature Studio](./screenshots/05-signature-studio.png)
```

### 2. **Portfolio/GitHub**
- Use screenshots in your project description
- Create a visual walkthrough
- Show before/after states

### 3. **Documentation**
- User guides
- Feature demonstrations
- Tutorial steps

---

## ✨ Quick Workflow

1. **Start your servers** (both backend and frontend should be running)
2. **Login to your app** with test credentials
3. **Navigate to each page** listed above
4. **Take screenshot** using `Windows + Shift + S`
5. **Save** to screenshots folder with proper naming
6. **Repeat** for all key pages

---

## 🎯 Sample Data Checklist

Before taking screenshots, make sure you have:
- [ ] At least one document in "Draft" status
- [ ] At least one document in "Pending" status
- [ ] At least one document in "Completed" status
- [ ] Signature fields placed on a document
- [ ] A signed signature field (with actual signature drawing)
- [ ] User profile information filled in Settings

---

**Need help?** Just ask me to update the README with a screenshots section once you've captured them!
