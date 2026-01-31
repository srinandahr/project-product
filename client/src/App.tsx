import { useEffect, type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AppLayout from './layout/AppLayout';
import Jobs from './pages/jobs/Jobs';
import Projects from './pages/projects/Projects';
import Resumes from './pages/resumes/Resumes';
import LeetCode from './pages/leetcode/LeetCode';
import Checkin from './pages/checkin/Checkin';
import Dashboard from './pages/dashboard/DashboardHome';
import { useAuthStore } from './store/auth.store';
import { useThemeStore } from './store/theme.store';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthStore();
  if (token) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
};

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Placeholder Routes */}
        <Route path="jobs" element={<Jobs />} />
        <Route path="projects" element={<Projects />} />
        <Route path="resumes" element={<Resumes />} />
        <Route path="leetcode" element={<LeetCode />} />
        <Route path="checkin" element={<Checkin />} />
      </Route>
    </Routes>
  );
}

export default App;
