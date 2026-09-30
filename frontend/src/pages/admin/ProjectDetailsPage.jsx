import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, CalendarDays, CircleAlert, ClipboardCheck, Edit3, Mail, MapPin, Phone, Users } from 'lucide-react';
import AdminSectionLayout from '../../components/admin-dashboard/AdminSectionLayout';
import Toast from '../../components/projects/Toast';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../hooks/useAuth';

const riskClasses = {
  low: 'bg-emerald-50 text-emerald-800',
  medium: 'bg-amber-50 text-amber-800',
  high: 'bg-rose-50 text-rose-800',
};
const statusClasses = {
  active: 'bg-emerald-50 text-emerald-800',
  inactive: 'bg-slate-100 text-slate-700',
  suspended: 'bg-rose-50 text-rose-800',
};

function displayDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value));
}

function DetailSkeleton() {
  return <div className="animate-pulse space-y-4" aria-label="Loading project details" aria-busy="true"><div className="h-28 rounded-xl bg-white" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-xl bg-white" />)}</div><div className="grid gap-4 lg:grid-cols-2"><div className="h-72 rounded-xl bg-white" /><div className="h-72 rounded-xl bg-white" /></div></div>;
}

function OverviewCard({ label, value, icon: Icon, note }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-2"><p className="text-sm text-slate-500">{label}</p><Icon className="h-4 w-4 text-blue-700" /></div><p className="mt-3 font-heading text-2xl font-semibold text-slate-900">{value}</p>{note && <p className="mt-1 text-xs text-slate-500">{note}</p>}</article>;
}

function InfoRow({ label, value, icon: Icon, href }) {
  return <div className="flex min-w-0 gap-3 py-2.5"><span className="mt-0.5 text-slate-400">{Icon ? <Icon className="h-4 w-4" /> : null}</span><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</p>{href ? <a href={href} className="mt-1 block break-words text-sm text-blue-800 hover:underline">{value || '—'}</a> : <p className="mt-1 break-words text-sm text-slate-700">{value || '—'}</p>}</div></div>;
}

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.toast || '');
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    projectService.get(token, id, controller.signal)
      .then((data) => {
        setProject(data.project);
        setHistory(data.inspectionHistory || []);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message || 'Unable to load project.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token, id]);

  const changeStatus = async (status) => {
    setBusy(true);
    try {
      const result = await projectService.updateStatus(token, id, status);
      setProject(result.project);
      setConfirmStatus(false);
      setNotice(status === 'active' ? 'Project activated successfully' : 'Project deactivated successfully');
    } catch (requestError) {
      setNotice(requestError.message || 'Unable to update project status.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminSectionLayout title="Project Details" subtitle="Project and implementing organization profile">
      <Toast message={notice} type={notice.includes('successfully') ? 'success' : notice ? 'error' : 'success'} onClose={() => setNotice('')} />
      {confirmStatus && project && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="project-deactivate-title" className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-800"><CircleAlert className="h-5 w-5" /></span>
            <h2 id="project-deactivate-title" className="mt-4 font-heading text-lg font-semibold text-slate-900">Deactivate Project?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This project will no longer be available for new inspection assignments.</p>
            <div className="mt-6 flex justify-end gap-2"><button type="button" disabled={busy} onClick={() => setConfirmStatus(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700">Cancel</button><button type="button" disabled={busy} onClick={() => changeStatus('inactive')} className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Deactivating…' : 'Deactivate'}</button></div>
          </section>
        </div>
      )}

      {loading ? <DetailSkeleton /> : error || !project ? (
        <div className="flex min-h-[55vh] flex-col items-center justify-center text-center"><CircleAlert className="h-9 w-9 text-rose-600" /><h2 className="mt-3 font-heading text-lg font-semibold text-slate-900">{error || 'Project not found'}</h2><Link to="/admin/projects" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-800"><ArrowLeft className="h-4 w-4" />Projects</Link></div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-5">
            <div className="min-w-0">
              <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-800"><ArrowLeft className="h-4 w-4" />Projects</Link>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.13em] text-blue-800">Project profile</p>
              <h2 className="mt-1 break-words font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">{project.projectName}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses[project.status]}`}>{project.status}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${riskClasses[project.riskLevel]}`}>{project.riskLevel} · {project.riskScore}/100</span><span className="text-xs text-slate-500">{project.projectCode}</span></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate(`/admin/projects/${id}/edit`)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Edit3 className="h-4 w-4" />Edit Project</button>
              {project.status === 'active' ? <button type="button" onClick={() => setConfirmStatus(true)} className="rounded-lg border border-rose-200 px-3.5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50">Deactivate</button> : <button type="button" disabled={busy} onClick={() => changeStatus('active')} className="rounded-lg bg-emerald-700 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Activate</button>}
            </div>
          </div>

          <section aria-label="Project overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard label="Beneficiaries" value={Number(project.beneficiaryCount).toLocaleString()} icon={Users} />
            <OverviewCard label="Inspections" value={history.length} icon={ClipboardCheck} note="Mock history until inspection records are connected" />
            <OverviewCard label="Last Inspection" value={history.length ? displayDate(history[0].date) : '—'} icon={CalendarDays} />
            <OverviewCard label="Risk Score" value={`${project.riskScore} / 100`} icon={CircleAlert} note={`${project.riskLevel} risk`} />
          </section>

          <section className="grid items-start gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-4"><Building2 className="h-5 w-5 text-blue-800" /><div><h3 className="font-heading text-base font-semibold text-slate-900">Project Information</h3><p className="text-xs text-slate-500">Project and organization details</p></div></div>
              <div className="grid gap-x-6 sm:grid-cols-2">
                <InfoRow label="Project Code" value={project.projectCode} /><InfoRow label="Project Type" value={project.projectType} /><InfoRow label="Start Date" value={displayDate(project.startDate)} /><InfoRow label="Status" value={project.status} />
                <InfoRow label="NGO Name" value={project.ngoName} /><InfoRow label="Registration Number" value={project.ngoRegistrationNumber} /><InfoRow label="Contact Person" value={project.contactPerson} /><InfoRow label="Phone" value={project.contactPhone} icon={Phone} href={project.contactPhone ? `tel:${project.contactPhone}` : undefined} /><InfoRow label="Email" value={project.contactEmail} icon={Mail} href={project.contactEmail ? `mailto:${project.contactEmail}` : undefined} />
              </div>
              {project.description && <div className="mt-3 border-t border-slate-100 pt-3"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Description</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{project.description}</p></div>}
            </article>

            <div className="space-y-4">
              <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-4 sm:p-5"><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-800" /><div><h3 className="font-heading text-base font-semibold text-slate-900">Location</h3><p className="text-xs text-slate-500">Project address and coordinates</p></div></div><div className="mt-3"><p className="text-sm text-slate-700">{project.address}, {project.city}, {project.state} {project.pincode}</p><p className="mt-1 text-xs text-slate-500">{Number(project.latitude).toFixed(4)}, {Number(project.longitude).toFixed(4)}</p></div></div>
                <div className="relative h-48 overflow-hidden border-t border-slate-200 bg-[#eef3ef]" aria-label="Map-style project location preview">
                  <div className="absolute inset-0 opacity-75" style={{ backgroundImage: 'linear-gradient(28deg, transparent 46%, #fff 47%, #fff 48%, transparent 49%), linear-gradient(112deg, transparent 44%, #fff 45%, #fff 46%, transparent 47%), linear-gradient(0deg, transparent 48%, #d9e2dd 49%, #d9e2dd 50%, transparent 51%)', backgroundSize: '160px 130px, 190px 150px, 90px 76px' }} />
                  <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-800 text-white shadow-lg ring-4 ring-white"><MapPin className="h-5 w-5" /></div>
                  <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-1 text-[10px] font-medium text-slate-600">Coordinate preview · maps not connected</span>
                </div>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-3"><div><h3 className="font-heading text-base font-semibold text-slate-900">Risk Overview</h3><p className="mt-1 text-xs text-slate-500">Current recorded project risk</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${riskClasses[project.riskLevel]}`}>{project.riskLevel} risk</span></div>
                <div className="mt-4 flex items-end gap-2"><span className="font-heading text-4xl font-semibold text-slate-900">{project.riskScore}</span><span className="pb-1 text-sm text-slate-500">/ 100</span></div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600">Risk analysis will be available after inspections are recorded. This score is not AI-generated.</p>
              </article>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 sm:p-5"><h3 className="font-heading text-base font-semibold text-slate-900">Inspection History</h3><p className="mt-1 text-xs text-slate-500">Sample history until inspection records are connected</p></div>
            {history.length ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-left text-sm"><thead><tr className="border-y border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500"><th className="px-5 py-3">Date</th><th className="px-4 py-3">Inspector</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Risk</th><th className="px-4 py-3">Report</th></tr></thead><tbody>{history.map((inspection) => <tr key={inspection.id} className="border-b border-slate-100 last:border-0"><td className="px-5 py-3.5 whitespace-nowrap text-slate-700">{displayDate(inspection.date)}</td><td className="px-4 py-3.5 text-slate-700">{inspection.inspector}</td><td className="px-4 py-3.5"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">{inspection.status}</span></td><td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${riskClasses[String(inspection.risk).toLowerCase()] || riskClasses.low}`}>{inspection.risk}</span></td><td className="px-4 py-3.5"><button type="button" onClick={() => setNotice('Inspection report files are not connected yet.')} className="text-xs font-semibold text-blue-800 hover:text-blue-950">View Report</button></td></tr>)}</tbody></table></div> : <div className="px-5 pb-6 text-sm text-slate-500">No inspections yet. Assigned inspections will appear here.</div>}
          </section>
        </div>
      )}
    </AdminSectionLayout>
  );
}

export default ProjectDetailsPage;