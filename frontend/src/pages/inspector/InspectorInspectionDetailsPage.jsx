import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Building2, CalendarClock, CircleAlert, MapPin, Play, Users } from 'lucide-react';
import InspectorSectionLayout, { InspectorBackLink } from '../../components/inspections/InspectorSectionLayout';
import InspectionStatusBadge from '../../components/inspections/InspectionStatusBadge';
import Toast from '../../components/projects/Toast';
import { inspectionService } from '../../services/inspectionService';
import { useAuth } from '../../hooks/useAuth';

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function InspectorInspectionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    inspectionService.get(token, id, controller.signal)
      .then((data) => setInspection(data.inspection))
      .catch((requestError) => { if (!controller.signal.aborted) setError(requestError.status === 404 ? 'Inspection not found.' : 'Unable to load inspection.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [token, id]);

  const changeStatus = async (status) => {
    setBusy(true);
    setToast('');
    try {
      const result = await inspectionService.updateStatus(token, id, status);
      setInspection(result.inspection);
      if (status === 'in_progress') setToast('GPS verification will begin here.');
      else setToast('Inspection accepted.');
    } catch (requestError) {
      setToast(requestError.message || 'Unable to update inspection.');
    } finally {
      setBusy(false);
    }
  };

  const project = inspection?.project;

  return (
    <InspectorSectionLayout title="Inspection Details" subtitle="Project assignment and field visit details">
      <Toast message={toast} type={toast === 'Inspection accepted.' || toast === 'GPS verification will begin here.' ? 'success' : 'error'} onClose={() => setToast('')} />
      {loading ? <div className="space-y-4 animate-pulse" aria-label="Loading inspection" aria-busy="true"><div className="h-32 rounded-xl bg-white" /><div className="h-72 rounded-xl bg-white" /></div> : error || !inspection ? <div className="rounded-xl border border-slate-200 bg-white p-7 text-center"><AlertTriangle className="mx-auto h-8 w-8 text-rose-700" /><h2 className="mt-3 font-heading font-semibold text-slate-900">{error || 'Inspection unavailable'}</h2><button type="button" onClick={() => navigate('/inspector/inspections')} className="mt-4 text-sm font-semibold text-blue-800">Return to My Inspections</button></div> : (
        <div className="space-y-5">
          <InspectorBackLink />
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">{inspection.inspectionCode} · {inspection.assignmentType} assignment</p><h2 className="mt-2 font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">{project?.name || 'Project unavailable'}</h2><div className="mt-3"><InspectionStatusBadge status={inspection.status} /></div></div>{inspection.status === 'assigned' ? <button type="button" disabled={busy} onClick={() => changeStatus('accepted')} className="rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60">{busy ? 'Accepting…' : 'Accept Inspection'}</button> : inspection.status === 'accepted' ? <button type="button" disabled={busy} onClick={() => changeStatus('in_progress')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"><Play className="h-4 w-4" />{busy ? 'Starting…' : 'Start Inspection'}</button> : null}</div>
            {inspection.status === 'in_progress' && <div role="status" className="mt-5 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"><MapPin className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-semibold">GPS verification will begin here.</p><p className="mt-1 text-blue-800">GPS and evidence collection are not part of this assignment MVP.</p></div></div>}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="flex items-center gap-2 border-b border-slate-100 pb-4"><Building2 className="h-5 w-5 text-blue-800" /><div><h3 className="font-heading font-semibold text-slate-900">Project Information</h3><p className="text-xs text-slate-500">Details for this assigned visit</p></div></div><dl className="mt-3 grid gap-4 sm:grid-cols-2"><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Project Code</dt><dd className="mt-1 text-sm text-slate-800">{project?.projectCode || '—'}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">NGO</dt><dd className="mt-1 text-sm text-slate-800">{project?.ngoName || '—'}</dd></div><div className="sm:col-span-2"><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Location</dt><dd className="mt-1 flex items-start gap-2 text-sm text-slate-800"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />{[project?.address, project?.city, project?.state, project?.pincode].filter(Boolean).join(', ') || '—'}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Beneficiaries</dt><dd className="mt-1 flex items-center gap-2 text-sm text-slate-800"><Users className="h-4 w-4 text-slate-500" />{project?.beneficiaryCount?.toLocaleString() ?? '—'}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Inspection Type</dt><dd className="mt-1 text-sm capitalize text-slate-800">{inspection.assignmentType}</dd></div></dl></article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="flex items-center gap-2 border-b border-slate-100 pb-4"><CalendarClock className="h-5 w-5 text-blue-800" /><div><h3 className="font-heading font-semibold text-slate-900">Assignment Schedule</h3><p className="text-xs text-slate-500">Assigned visit deadlines</p></div></div><dl className="mt-3 space-y-4"><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Assigned Date</dt><dd className="mt-1 text-sm text-slate-800">{formatDate(inspection.assignedAt)}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Deadline</dt><dd className="mt-1 text-sm font-medium text-slate-800">{formatDate(inspection.deadline)}</dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status</dt><dd className="mt-1"><InspectionStatusBadge status={inspection.status} /></dd></div></dl>{inspection.status === 'assigned' && <p className="mt-5 flex gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />Accept this assignment to begin the inspection workflow.</p>}</article>
          </section>
        </div>
      )}
    </InspectorSectionLayout>
  );
}

export default InspectorInspectionDetailsPage;