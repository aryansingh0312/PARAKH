import { Bell, Menu, Search } from 'lucide-react';

function DashboardTopbar({ user, onMenuOpen, onAlerts, title = 'Monitoring Dashboard', subtitle = 'Overview of projects, inspections and compliance activity' }) {
  const initials = (user?.name || 'PA').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onMenuOpen} aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-semibold text-slate-900 sm:text-xl">{title}</h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <label className="hidden h-10 w-56 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 lg:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input aria-label="Search dashboard" placeholder="Search" className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
            <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">/</span>
          </label>
          <button type="button" onClick={onAlerts} aria-label="Go to alerts" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">{initials}</span>
            <div className="hidden sm:block">
              <p className="max-w-36 truncate text-sm font-semibold text-slate-800">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardTopbar;