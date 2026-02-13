# 🚀 Local Demo Guide

## Running the Full Application Locally

This guide helps you run the complete DocSign application with both frontend and backend for demonstrations, interviews, or development.

---

## 📋 Prerequisites

- Python 3.10+
- Node.js 16+
- Git

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Clone the Repository (if not already done)
```powershell
git clone https://github.com/abhiramvsmg/DocSign-App.git
cd DocSign-App
```

### Step 2: Start the Backend
```powershell
# Navigate to backend
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

✅ Backend will be running at: `http://127.0.0.1:8000`

### Step 3: Start the Frontend (New Terminal)
```powershell
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Run the development server
npm run dev
```

✅ Frontend will be running at: `http://localhost:5173`

### Step 4: Access the Application
Open your browser and go to: **http://localhost:5173**

---

## 🎯 Demo Workflow

### 1. Create an Account
- Click "Sign Up"
- Enter your details
- Login with your credentials

### 2. Upload a Document
- Click "Upload Document"
- Select a PDF file
- Give it a title

### 3. Add Signature Fields
- Click "Prepare" on your document
- Drag signature fields onto the PDF
- Assign signer emails
- Click "Send for Signing"

### 4. Sign the Document
- Access the signing link (shown in the UI)
- Draw your signature
- Click "Apply Signature"
- Complete the document

### 5. View Completed Document
- Check the dashboard
- Status shows "Completed"
- Download the signed PDF

---

## 🔧 Configuration

### Backend Configuration
The backend uses SQLite by default (no setup needed). For production, you can configure PostgreSQL in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost/docsign
SECRET_KEY=your-secret-key-here
```

### Frontend Configuration
The frontend is pre-configured to use `http://127.0.0.1:8000` for local development.

---

## 📊 API Documentation

Once the backend is running, visit:
**http://127.0.0.1:8000/docs**

This provides interactive API documentation powered by FastAPI's Swagger UI.

---

## 🎥 Demo Tips for Interviews

### Preparation
1. Have a sample PDF ready (any PDF will work)
2. Create a test account beforehand
3. Keep both terminals visible to show full-stack nature

### Talking Points
- **Architecture**: Explain FastAPI backend + React frontend
- **Security**: Highlight JWT authentication, bcrypt hashing
- **PDF Processing**: Demonstrate PyMuPDF for signature merging
- **State Management**: Show real-time status updates
- **Database**: Explain SQLAlchemy ORM and relationships

### Features to Highlight
1. **Drag-and-drop** signature field placement
2. **Real-time** signature pad with canvas
3. **Email-based** access control
4. **Audit trail** for all document actions
5. **Status tracking** (Draft → Pending → Completed)

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```powershell
# Clear node modules and reinstall
rm -rf node_modules
npm install
```

### Port already in use
```powershell
# Backend: Change port
uvicorn main:app --reload --port 8001

# Frontend: Change port in vite.config.ts or use:
npm run dev -- --port 5174
```

---

## 🌐 Live vs Local

| Feature | Live (Vercel) | Local Demo |
|---------|---------------|------------|
| Frontend UI | ✅ Available | ✅ Available |
| Backend API | ❌ Not deployed | ✅ Full functionality |
| PDF Processing | ❌ | ✅ Complete |
| Database | ❌ | ✅ SQLite |
| Authentication | ❌ | ✅ JWT |

---

## 📝 Notes

- The live frontend at https://doc-sign-app.vercel.app shows the UI/UX
- For full functionality demos, use this local setup
- Database is SQLite (file-based) - perfect for demos
- All uploaded files are stored in `backend/uploads/`

---

**Ready to impress!** 🚀

For any issues, check the main [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md).
