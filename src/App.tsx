import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import ToastContainer from './components/Toast';
import AuthModal from './components/AuthModal';

// Pages
import Dashboard from './pages/Dashboard';
import MyLearning from './pages/MyLearning';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import LessonReader from './pages/LessonReader';
import LearningPaths from './pages/LearningPaths';
import PracticeLabs from './pages/PracticeLabs';
import ProjectStudio from './pages/ProjectStudio';
import Portfolio from './pages/Portfolio';
import Achievements from './pages/Achievements';
import HelpCenter from './pages/HelpCenter';
import Settings from './pages/Settings';
import AdminCMS from './pages/AdminCMS';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import CourseSuccess from './pages/CourseSuccess';

// Route Guards
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomeRoute() {
  const { state } = useApp();
  return state.user ? <Dashboard /> : <LandingPage />;
}

function MainLayout() {
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <ScrollToTop />
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar onOpenAuth={() => setAuthOpen(true)} />

        <div key={location.pathname} className="page-transition-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/help" element={<HelpCenter />} />

          {/* Protected Student / Member Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />

          {/* Learning Library & Lesson Reader */}
          <Route path="/courses" element={<ProtectedRoute><CourseCatalog /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<ProtectedRoute><LessonReader /></ProtectedRoute>} />
          <Route path="/courses/:courseId/success" element={<ProtectedRoute><CourseSuccess /></ProtectedRoute>} />

          {/* Learning Paths */}
          <Route path="/learning-paths" element={<ProtectedRoute><LearningPaths /></ProtectedRoute>} />

          {/* Practical Labs */}
          <Route path="/practice" element={<ProtectedRoute><PracticeLabs /></ProtectedRoute>} />
          <Route path="/practice/:labType" element={<ProtectedRoute><PracticeLabs /></ProtectedRoute>} />
          <Route path="/typing-lab" element={<Navigate to="/practice?lab=typing" replace />} />
          <Route path="/web-lab" element={<Navigate to="/practice?lab=web" replace />} />
          <Route path="/cpp-lab" element={<Navigate to="/practice?lab=programming" replace />} />
          <Route path="/sql-lab" element={<Navigate to="/practice?lab=sql" replace />} />
          <Route path="/esp32-lab" element={<Navigate to="/practice?lab=esp32" replace />} />
          <Route path="/office-lab" element={<Navigate to="/practice?lab=office" replace />} />

          {/* Project Studio */}
          <Route path="/projects" element={<ProtectedRoute><ProjectStudio /></ProtectedRoute>} />
          <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectStudio /></ProtectedRoute>} />

          {/* Learning Paths & Redirections */}
          <Route path="/knowledge-map" element={<Navigate to="/learning-paths" replace />} />
          <Route path="/map" element={<Navigate to="/learning-paths" replace />} />

          {/* Portfolio & Achievements */}
          <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/portfolio/:username" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />

          {/* User Settings */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Admin & Teacher CMS (Role Protected) */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin', 'teacher']}>
                <AdminCMS />
              </RoleRoute>
            }
          />

          {/* Community (Redirect to Home) */}
          <Route path="/community" element={<Navigate to="/" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}


export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
