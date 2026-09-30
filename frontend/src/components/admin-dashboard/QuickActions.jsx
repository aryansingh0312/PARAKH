import { Activity, Building2, ClipboardCheck, FileBarChart } from 'lucide-react';

const actions = [
  { label: 'Assign Inspection', icon: ClipboardCheck, key: 'assign' },
  { label: 'Add Project', icon: Building2, key: 'project' },
  { label: 'View Reports', icon: FileBarChart, key: 'reports' },
  { label: 'Risk Analysis', icon: Activity, key: 'risk' },
];

function QuickActions({ onAction }) {
  return (
    <section aria-labelledby="quick-actions-heading" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 id="quick-actions-heading" className="font-heading text-base font-semibold text-slate-900">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {actions.map(({ label, icon: Icon, key }) => (
          <button
            type="button"
            key={key}
            onClick={() => onAction(key)}
            className="flex min-h-[72px] flex-col items-start justify-between rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
          >
            <Icon className="h-4 w-4 text-blue-700" />
            <span className="text-xs font-medium leading-4 text-slate-700">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;