import {
  Activity,
  Bell,
  Building2,
  ClipboardCheck,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const groups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, id: 'overview', to: '/admin/dashboard' }],
  },
  {
    label: 'Monitoring',
    items: [
      { label: 'Projects', icon: Building2, id: 'projects', to: '/admin/projects' },
      { label: 'Inspections', icon: ClipboardCheck, id: 'inspections', to: '/admin/inspections' },
      { label: 'Risk Analysis', icon: Activity, id: 'risk-analysis' },
    ],
  },
  {
    label: 'Reports',
    items: [{ label: 'Inspection Reports', icon: FileBarChart, id: 'recent-inspections' }],
  },
  {
    label: 'System',
    items: [
      { label: 'Alerts', icon: Bell, id: 'recent-alerts' },
      { label: 'Settings', icon: Settings, id: 'settings' },
    ],
  },
];

function DashboardSidebar({ user, activeId, isOpen, onNavigate, onLogout, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/35 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,280px)] flex-col border-r border-slate-200 bg-white transition-transform duration-200 md:w-64 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-heading text-lg font-semibold tracking-[0.12em] text-slate-900">PARAKH</p>
              <p className="text-[11px] text-slate-500">Monitoring Platform</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(({ label, icon: Icon, id, to }) => {
                  const className = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    activeId === id
                      ? 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`;

                  return to ? (
                    <Link
                      key={label}
                      to={to}
                      onClick={onClose}
                      aria-current={activeId === id ? 'page' : undefined}
                      className={className}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      key={label}
                      onClick={() => onNavigate(id, label)}
                      aria-current={activeId === id ? 'page' : undefined}
                      className={className}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 px-1">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              {(user?.name || 'PA').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name || 'PARAKH Administrator'}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;