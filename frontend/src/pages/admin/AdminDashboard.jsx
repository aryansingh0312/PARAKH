import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Building2, CheckCircle2, ClipboardCheck, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/admin-dashboard/DashboardSidebar';
import DashboardTopbar from '../../components/admin-dashboard/DashboardTopbar';
import DashboardSkeleton from '../../components/admin-dashboard/DashboardSkeleton';
import StatCard from '../../components/admin-dashboard/StatCard';
import ProjectLocations from '../../components/admin-dashboard/ProjectLocations';
import RecentInspections from '../../components/admin-dashboard/RecentInspections';
import RecentAlerts from '../../components/admin-dashboard/RecentAlerts';
import QuickActions from '../../components/admin-dashboard/QuickActions';
import { getAdminDashboard } from '../../services/adminDashboardService';
import { useAuth } from '../../hooks/useAuth';

const InspectionActivityChart = lazy(() => import('../../components/admin-dashboard/InspectionActivityChart'));
const RiskDistributionChart = lazy(() => import('../../components/admin-dashboard/RiskDistributionChart'));

const statCards = [
  { key: 'totalProjects', label: 'Total Projects', icon: Building2, tone: 'blue' },
  { key: 'pendingInspections', label: 'Pending Inspections', icon: ClipboardCheck, tone: 'amber' },
  { key: 'completedInspections', label: 'Completed Inspections', icon: CheckCircle2, tone: 'green' },
  { key: 'highRiskProjects', label: 'High Risk Projects', icon: AlertTriangle, tone: 'red' },
];

class DashboardChartErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="flex h-80 flex-col items-center justify-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-900">
          <p>Dashboard charts could not be loaded.</p>
          <button type="button" onClick={() => window.location.reload()} className="rounded-lg border border-amber-300 bg-white px-3 py-2 font-semibold hover:bg-amber-100">
            Reload dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function AdminDashboard({ initialSection = 'overview' }) {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(initialSection);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getAdminDashboard(token, controller.signal)
      .then((data) => setDashboard(data))
      .catch(() => {
        if (!controller.signal.aborted) setHasError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [token, retryCount]);

  useEffect(() => {
    if (initialSection !== 'overview' && !loading && dashboard) {
      document.getElementById(initialSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [dashboard, initialSection, loading]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navigateSection = useCallback((id) => {
    setSidebarOpen(false);
    setActiveId(id);
    if (id === 'settings') {
      setNotice('Settings are not included in this dashboard MVP.');
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleAction = (action) => {
    if (action === 'reports') {
      navigateSection('recent-inspections');
      return;
    }
    if (action === 'risk') {
      navigateSection('risk-analysis');
      return;
    }
    if (action === 'assign') {
      navigate('/admin/inspections/new');
      return;
    }
    setNotice(action === 'assign'
      ? 'Inspection assignment is outside this dashboard MVP.'
      : 'Project management is outside this dashboard MVP.');
  };

  const handleNewInspection = () => navigate('/admin/inspections/new');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardSidebar
        user={user}
        activeId={activeId}
        isOpen={sidebarOpen}
        onNavigate={navigateSection}
        onLogout={handleLogout}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-h-screen md:ml-64">
        <DashboardTopbar
          user={user}
          onMenuOpen={() => setSidebarOpen(true)}
          onAlerts={() => navigateSection('recent-alerts')}
        />
        <main id="overview" className="mx-auto max-w-[1600px] scroll-mt-24 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {notice && (
            <div role="status" className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <span>{notice}</span>
              <button type="button" aria-label="Dismiss message" onClick={() => setNotice('')} className="rounded p-0.5 text-blue-700 hover:bg-blue-100"><X className="h-4 w-4" /></button>
            </div>
          )}

          {loading ? (
            <DashboardSkeleton />
          ) : hasError || !dashboard ? (
            <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-700"><AlertTriangle className="h-6 w-6" /></span>
              <h2 className="mt-4 font-heading text-lg font-semibold text-slate-900">Unable to load dashboard data</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500">Please try again. Dashboard information is temporarily unavailable.</p>
              <button type="button" onClick={() => { setLoading(true); setHasError(false); setRetryCount((count) => count + 1); }} className="mt-5 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900">Retry</button>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">Portfolio overview</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">Good evening, {user?.name || 'Administrator'}</h2>
                  <p className="mt-2 text-sm text-slate-600">Here&apos;s what&apos;s happening across the monitored projects today.</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">{dashboard.stats.totalNgos} implementing organizations in the portfolio</p>
                </div>
                <button type="button" onClick={handleNewInspection} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 sm:self-auto">
                  <Plus className="h-4 w-4" /> New Inspection
                </button>
              </section>

              <section aria-label="Portfolio statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                  <StatCard
                    key={card.key}
                    label={card.label}
                    value={dashboard.stats[card.key]}
                    change={dashboard.statChanges[card.key]}
                    icon={card.icon}
                    tone={card.tone}
                  />
                ))}
              </section>

              <section id="risk-analysis" aria-label="Inspection and risk analytics" className="scroll-mt-24 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
                <DashboardChartErrorBoundary>
                  <Suspense fallback={<div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white" />}>
                    <InspectionActivityChart data={dashboard.inspectionActivity} />
                  </Suspense>
                </DashboardChartErrorBoundary>
                <DashboardChartErrorBoundary>
                  <Suspense fallback={<div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white" />}>
                    <RiskDistributionChart distribution={dashboard.riskDistribution} />
                  </Suspense>
                </DashboardChartErrorBoundary>
              </section>

              <ProjectLocations locations={dashboard.projectLocations} onViewMap={() => setNotice('Full map view is not included in this dashboard MVP.')} />

              <section aria-label="Recent activity" className="grid items-start gap-4 2xl:grid-cols-[1.6fr_1fr]">
                <RecentInspections inspections={dashboard.recentInspections} onViewAll={() => navigateSection('recent-inspections')} />
                <div className="space-y-4">
                  <RecentAlerts alerts={dashboard.recentAlerts} onViewAll={() => navigateSection('recent-alerts')} />
                  <QuickActions onAction={handleAction} />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
