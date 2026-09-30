import { AlertTriangle, Clock3, MapPin, ShieldAlert } from 'lucide-react';

const alertIcons = {
  risk: { icon: ShieldAlert, style: 'bg-rose-50 text-rose-700' },
  overdue: { icon: Clock3, style: 'bg-amber-50 text-amber-800' },
  location: { icon: MapPin, style: 'bg-emerald-50 text-emerald-700' },
};

function RecentAlerts({ alerts, onViewAll }) {
  return (
    <section id="recent-alerts" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="alerts-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 id="alerts-heading" className="font-heading text-base font-semibold text-slate-900">Recent Alerts</h2>
          <p className="mt-1 text-xs text-slate-500">Updates requiring attention</p>
        </div>
        <button type="button" onClick={onViewAll} className="shrink-0 text-xs font-semibold text-blue-700 hover:text-blue-900">View All Alerts <span aria-hidden="true">→</span></button>
      </div>
      {alerts.length ? (
        <div className="space-y-1">
          {alerts.map((alert) => {
            const { icon: Icon, style } = alertIcons[alert.type] || { icon: AlertTriangle, style: 'bg-slate-100 text-slate-600' };
            return (
              <article key={alert.id} className="flex gap-3 rounded-lg p-3 transition hover:bg-slate-50">
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style}`}><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                    <h3 className="text-sm font-semibold text-slate-800">{alert.title}</h3>
                    <time className="text-[11px] text-slate-400">{alert.time}</time>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{alert.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No recent alerts.</div>
      )}
    </section>
  );
}

export default RecentAlerts;