import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { AdminLogin } from './pages/AdminLogin';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
