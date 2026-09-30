import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import PmuDashboard from './pages/pmu/PmuDashboard';
import NgoDashboard from './pages/ngo/NgoDashboard';
import ProjectsPage from './pages/admin/ProjectsPage';
import ProjectFormPage from './pages/admin/ProjectFormPage';
import ProjectDetailsPage from './pages/admin/ProjectDetailsPage';
import InspectionsPage from './pages/admin/InspectionsPage';
import RandomInspectionPage from './pages/admin/RandomInspectionPage';
import AdminInspectionDetailsPage from './pages/admin/AdminInspectionDetailsPage';
import InspectorInspectionsPage from './pages/inspector/InspectorInspectionsPage';
import InspectorInspectionDetailsPage from './pages/inspector/InspectorInspectionDetailsPage';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/inspector/dashboard'} replace />;
  }

  return children;
}

function LoginRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === 'inspector') {
      return <Navigate to="/inspector/dashboard" replace />;
    }

    if (user?.role === 'pmu') {
      return <Navigate to="/pmu/dashboard" replace />;
    }

    return <Navigate to="/ngo/dashboard" replace />;
  }

  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRoute />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProjectFormPage mode="create" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProjectFormPage mode="edit" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/inspections" element={<ProtectedRoute allowedRoles={['admin', 'pmu']}><InspectionsPage /></ProtectedRoute>} />
        <Route path="/admin/inspections/new" element={<ProtectedRoute allowedRoles={['admin', 'pmu']}><RandomInspectionPage /></ProtectedRoute>} />
        <Route path="/admin/inspections/:id" element={<ProtectedRoute allowedRoles={['admin', 'pmu']}><AdminInspectionDetailsPage /></ProtectedRoute>} />

        <Route
          path="/inspector/dashboard"
          element={
            <ProtectedRoute allowedRoles={['inspector']}>
              <InspectorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/inspector/inspections" element={<ProtectedRoute allowedRoles={['inspector']}><InspectorInspectionsPage /></ProtectedRoute>} />
        <Route path="/inspector/inspections/:id" element={<ProtectedRoute allowedRoles={['inspector']}><InspectorInspectionDetailsPage /></ProtectedRoute>} />

        <Route
          path="/pmu/dashboard"
          element={
            <ProtectedRoute allowedRoles={['pmu']}>
              <PmuDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
