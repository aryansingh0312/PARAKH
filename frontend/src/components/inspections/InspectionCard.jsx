import { ArrowRight, CalendarClock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import InspectionStatusBadge from './InspectionStatusBadge';

function formatDeadline(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function InspectionCard({ inspection }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-blue-800">{inspection.assignmentType === 'random' ? 'Random Inspection' : 'Manual Inspection'}</p><h3 className="mt-2 break-words font-heading text-lg font-semibold text-slate-900">{inspection.project?.name || 'Project unavailable'}</h3></div>
        <InspectionStatusBadge status={inspection.status} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /><span>{[inspection.project?.city, inspection.project?.state].filter(Boolean).join(', ') || 'Location unavailable'}</span></p>
        <p className="flex items-start gap-2"><CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><span><span className="text-slate-500">Deadline: </span>{formatDeadline(inspection.deadline)}</span></p>
      </div>
      <Link to={`/inspector/inspections/${inspection.id}`} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900">View Inspection <ArrowRight className="h-4 w-4" /></Link>
    </article>
  );
}

export default InspectionCard;