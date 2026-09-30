const statusStyles = {
  assigned: 'bg-blue-50 text-blue-800',
  accepted: 'bg-violet-50 text-violet-800',
  in_progress: 'bg-amber-50 text-amber-800',
  completed: 'bg-emerald-50 text-emerald-800',
  overdue: 'bg-rose-50 text-rose-800',
  cancelled: 'bg-slate-100 text-slate-600',
};

function InspectionStatusBadge({ status }) {
  const label = status === 'in_progress' ? 'In Progress' : status ? status[0].toUpperCase() + status.slice(1) : 'Assigned';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status] || statusStyles.assigned}`}>{label}</span>;
}

export default InspectionStatusBadge;