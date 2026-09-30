import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarClock, ClipboardCheck, MapPin, UserRound } from 'lucide-react';

function formatDeadline(value) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function AssignmentSuccessModal({ inspection, onDone }) {
  const navigate = useNavigate();
  if (!inspection) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="assignment-success-title" className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-slate-950 px-5 py-7 text-white sm:px-8">
          <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border-[28px] border-white/5" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-200/30"><BadgeCheck className="h-7 w-7" /></span>
          <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">Assignment confirmed</p>
          <h2 id="assignment-success-title" className="relative mt-1 font-heading text-2xl font-semibold text-white">Inspection Assigned Successfully</h2>
          <p className="relative mt-2 text-sm text-slate-300">A field inspector has been assigned and notified in their inspection inbox.</p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
          <div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">Inspection</p><p className="mt-1 font-heading text-lg font-semibold text-slate-900">{inspection.inspectionCode}</p><div className="mt-2"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800">Random Inspection</span></div></div>
          <div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">Project</p><p className="mt-1 font-semibold text-slate-900">{inspection.project?.name}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{[inspection.project?.city, inspection.project?.state].filter(Boolean).join(', ')}</p></div>
          <div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">Inspector</p><p className="mt-1 flex items-center gap-2 font-semibold text-slate-900"><UserRound className="h-4 w-4 text-blue-800" />{inspection.inspector?.name}</p><p className="mt-1 truncate text-xs text-slate-500">{inspection.inspector?.email}</p></div>
          <div className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">Deadline</p><p className="mt-1 flex items-center gap-2 font-semibold text-slate-900"><CalendarClock className="h-4 w-4 text-blue-800" />{formatDeadline(inspection.deadline)}</p><p className="mt-1 text-xs text-slate-500">Status: Assigned</p></div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:justify-end sm:px-6">
          <button type="button" onClick={onDone} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Done</button>
          <button type="button" onClick={() => navigate(`/admin/inspections/${inspection.id}`)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"><ClipboardCheck className="h-4 w-4" />View Inspection <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
}

export default AssignmentSuccessModal;