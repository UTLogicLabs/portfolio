import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPostEditor } from './pages/AdminPostEditor';
import { AdminAuthProvider } from './components/AdminAuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/post" 
          element={
            <ProtectedRoute>
              <AdminPostEditor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/post/:id" 
          element={
            <ProtectedRoute>
              <AdminPostEditor />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
