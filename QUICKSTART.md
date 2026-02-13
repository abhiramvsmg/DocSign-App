# 🚀 DocSign App - Quick Start Guide

## Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

## 🏃 Running the Application

### 1. Start Backend Server

```powershell
cd "c:\Users\abhir\Desktop\DocSign App"
uvicorn backend.main:app --reload
```

**Backend will run on**: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### 2. Start Frontend Server

Open a **new terminal**:

```powershell
cd "c:\Users\abhir\Desktop\DocSign App\frontend"
npm run dev
```

**Frontend will run on**: `http://localhost:5173`

## 📝 Testing the App

### Step 1: Register a User
1. Go to `http://localhost:5173`
2. Click "Sign Up"
3. Create an account with email and password

### Step 2: Upload a Document
1. Login with your credentials
2. Click "New Document" on Dashboard
3. Upload a PDF file
4. Give it a title

### Step 3: Prepare for Signing
1. Click "Prepare" on your uploaded document
2. You'll enter the **Signature Studio**
3. Click the "Signature Box" tool (or drag it)
4. Click on the PDF where you want the signature
5. (Optional) Add signer email in the field
6. Click "Send for Signature"

### Step 4: Sign the Document

**Option A: Sign as Owner**
1. Go back to Dashboard
2. Click "Sign" on the pending document
3. Click on the yellow signature field
4. Draw your signature in the modal
5. Click "Apply Signature"

**Option B: Sign as Guest (Public Link)**
1. On Dashboard, click the Share icon (📤) on a pending document
2. Copy the signing link
3. Open in incognito/new browser (no login required)
4. Click signature fields and sign
5. Complete the document

### Step 5: Download Signed PDF
1. Once all fields are signed, document status becomes "Completed"
2. Click "Download" button
3. The signed PDF will open in a new tab

## 🔧 Configuration

### Email Notifications (Optional)
1. Copy `.env.example` to `.env`
2. Add your SMTP credentials:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```
3. Restart backend server

## 🎯 Key Features to Test

- ✅ **Authentication**: Register, Login, JWT tokens
- ✅ **Upload**: PDF validation, metadata storage
- ✅ **Signature Studio**: Drag-and-drop field placement
- ✅ **Signing**: Signature pad, multi-field support
- ✅ **Public Links**: Guest signing without login
- ✅ **Recall**: Revert to draft, clear signatures
- ✅ **Decline**: Reject documents with reason
- ✅ **Audit Trail**: View document history
- ✅ **Search & Filter**: Dashboard functionality
- ✅ **Download**: Signed PDF with embedded signatures

## 📊 Database

The app uses SQLite (`docsign.db`) for development. All data is stored locally.

## 🐛 Troubleshooting

**Backend won't start?**
- Ensure all Python dependencies are installed
- Check if port 8000 is available

**Frontend won't start?**
- Run `npm install` in the frontend directory
- Check if port 5173 is available

**PDF not loading?**
- Ensure backend is running
- Check browser console for CORS errors
- Verify PDF file path in uploads folder

**Signature not saving?**
- Check browser console for errors
- Verify backend logs for API errors
- Ensure you're logged in (or using valid token for public links)

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ You can register and login
2. ✅ You can upload a PDF
3. ✅ You can place signature fields on the PDF
4. ✅ You can draw and apply signatures
5. ✅ You can download the signed PDF with embedded signatures
6. ✅ Audit logs show all actions

---

**Need help?** Check the comprehensive review in `walkthrough.md` for detailed feature documentation.
