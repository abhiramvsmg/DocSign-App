import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { Settings } from './pages/Settings';
import { SignatureStudio } from './pages/SignatureStudio';
import { SigningPage } from './pages/SigningPage';
import { PublicSigningPage } from './pages/PublicSigningPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { RequireAuth } from './components/RequireAuth';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <AuthProvider>
          <Routes>
            {/* ... routes ... */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sign/:token" element={<PublicSigningPage />} />

            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Document routes */}
                <Route path="/documents" element={<Documents />} />
                <Route path="/documents/:id/edit" element={<SignatureStudio />} />
                <Route path="/documents/:id/sign" element={<SigningPage />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </DndProvider>
    </BrowserRouter>
  );
}

export default App;
