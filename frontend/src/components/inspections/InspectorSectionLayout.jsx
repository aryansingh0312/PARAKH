import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function InspectorSectionLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white"><ShieldCheck className="h-5 w-5" /></span><div className="min-w-0"><h1 className="truncate font-heading text-lg font-semibold text-slate-900">{title}</h1><p className="hidden truncate text-xs text-slate-500 sm:block">{subtitle}</p></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4"><span className="hidden max-w-40 truncate text-sm font-medium text-slate-600 sm:inline">{user?.name}</span><button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Logout</span></button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}

export function InspectorBackLink({ to = '/inspector/inspections', label = 'My Inspections' }) {
  return <button type="button" onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign(to)} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-800"><ArrowLeft className="h-4 w-4" />{label}</button>;
}

export default InspectorSectionLayout;