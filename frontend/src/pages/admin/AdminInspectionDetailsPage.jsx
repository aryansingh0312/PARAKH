import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, CircleAlert, MapPin, UserRound } from 'lucide-react';
import AdminSectionLayout from '../../components/admin-dashboard/AdminSectionLayout';
import InspectionStatusBadge from '../../components/inspections/InspectionStatusBadge';
import { inspectionService } from '../../services/inspectionService';
import { useAuth } from '../../hooks/useAuth';

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function AdminInspectionDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    inspectionService.get(token, id, controller.signal)
      .then((data) => setInspection(data.inspection))
      .catch((requestError) => { if (!controller.signal.aborted) setError(requestError.message || 'Unable to load inspection.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, id]);

  return (
    <AdminSectionLayout title="Inspection Details" subtitle="Assignment and field visit details" activeId="inspections">
      <Link to="/admin/inspections" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-800"><ArrowLeft className="h-4 w-4" />Inspections</Link>
      {loading ? <div className="mt-5 h-80 animate-pulse rounded-xl bg-white" aria-label="Loading inspection" aria-busy="true" /> : error || !inspection ? <div className="mt-5 rounded-xl border border-rose-200 bg-white p-6 text-center"><CircleAlert className="mx-auto h-8 w-8 text-rose-700" /><h2 className="mt-3 font-heading font-semibold text-slate-900">{error || 'Inspection not found.'}</h2></div> : (
        <div className="mt-5 space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">{inspection.inspectionCode} · {inspection.assignmentType} assignment</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><h2 className="font-heading text-2xl font-semibold text-slate-900">{inspection.project?.name || 'Project unavailable'}</h2><InspectionStatusBadge status={inspection.status} /></div><p className="mt-2 text-sm text-slate-600">{inspection.project?.projectCode}</p></section>
          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-heading font-semibold text-slate-900">Assignment</h3><dl className="mt-4 space-y-4"><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Inspector</dt><dd className="mt-1 flex items-center gap-2 text-sm text-slate-800"><UserRound className="h-4 w-4 text-blue-800" />{inspection.inspector?.name || 'Unavailable'}</dd><dd className="ml-6 text-xs text-slate-500">{inspection.inspector?.email}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Assigned By</dt><dd className="mt-1 text-sm text-slate-800">{inspection.assignedBy?.name || '—'}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Project Location</dt><dd className="mt-1 flex gap-2 text-sm text-slate-800"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" />{[inspection.project?.address, inspection.project?.city, inspection.project?.state].filter(Boolean).join(', ')}</dd></div></dl></article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-heading font-semibold text-slate-900">Schedule</h3><dl className="mt-4 space-y-4"><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Assignment Type</dt><dd className="mt-1 text-sm capitalize text-slate-800">{inspection.assignmentType}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Assigned At</dt><dd className="mt-1 flex items-center gap-2 text-sm text-slate-800"><CalendarClock className="h-4 w-4 text-blue-800" />{formatDate(inspection.assignedAt)}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Deadline</dt><dd className="mt-1 text-sm text-slate-800">{formatDate(inspection.deadline)}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Beneficiaries</dt><dd className="mt-1 text-sm text-slate-800">{inspection.project?.beneficiaryCount?.toLocaleString() ?? '—'}</dd></div></dl></article>
          </section>
        </div>
      )}
    </AdminSectionLayout>
  );
}

export default AdminInspectionDetailsPage;