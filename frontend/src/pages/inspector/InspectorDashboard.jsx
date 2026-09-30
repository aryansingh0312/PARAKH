import { CalendarRange, CheckCircle2, ClipboardList, LogOut, MapPin, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const stats = [
  { label: 'Assigned Inspections', value: '5' },
  { label: 'Pending', value: '3' },
  { label: 'Completed', value: '2' },
];

const inspections = [
  { name: 'ABC Skill Development Centre', status: 'Pending', distance: '4.2 km away', type: 'Surprise inspection' },
  { name: 'Rural Health Unit', status: 'In Progress', distance: '2.1 km away', type: 'Follow-up review' },
  { name: 'MGNREGA Cluster', status: 'Completed', distance: '6.8 km away', type: 'Compliance check' },
];

function InspectorDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Inspector dashboard</p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-[-0.05em] text-slate-900">Inspector Dashboard</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Field mode active
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.05em] text-slate-900">My Inspections</h2>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
                <CalendarRange className="h-4 w-4" />
                This week
              </div>
              <Link to="/inspector/inspections" className="text-sm font-semibold text-blue-800 hover:text-blue-950">View all</Link>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {inspections.map(({ name, status, distance, type }) => (
              <div key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                    {type}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-sky-50 text-sky-700'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-900">{name}</h3>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    {distance}
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-slate-500" />
                    Inspection checklist pending
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {status === 'Completed' ? 'Report submitted' : 'Awaiting submission'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default InspectorDashboard;
