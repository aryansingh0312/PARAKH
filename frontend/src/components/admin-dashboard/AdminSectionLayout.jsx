import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';

function AdminSectionLayout({ title, subtitle, activeId = 'projects', children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardSidebar
        user={user}
        activeId={activeId}
        isOpen={sidebarOpen}
        onNavigate={() => navigate('/admin/dashboard')}
        onLogout={handleLogout}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-h-screen md:ml-64">
        <DashboardTopbar
          user={user}
          title={title}
          subtitle={subtitle}
          onMenuOpen={() => setSidebarOpen(true)}
          onAlerts={() => navigate('/admin/dashboard')}
        />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminSectionLayout;