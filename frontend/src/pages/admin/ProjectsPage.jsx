import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, MoreHorizontal, Plus, Search, SlidersHorizontal } from 'lucide-react';
import AdminSectionLayout from '../../components/admin-dashboard/AdminSectionLayout';
import Toast from '../../components/projects/Toast';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../hooks/useAuth';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-800',
  inactive: 'bg-slate-100 text-slate-600',
  suspended: 'bg-rose-50 text-rose-800',
};
const riskStyles = {
  low: 'bg-emerald-50 text-emerald-800',
  medium: 'bg-amber-50 text-amber-800',
  high: 'bg-rose-50 text-rose-800',
};

function formatDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

function ProjectStateBadge({ status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[status] || statusStyles.inactive}`}>{status}</span>;
}

function ProjectRiskBadge({ level, score }) {
  if (!level) return <span className="text-slate-400">—</span>;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${riskStyles[level] || riskStyles.low}`}><span className="capitalize">{level}</span>{Number.isFinite(Number(score)) && <span>{score}</span>}</span>;
}

function ProjectActions({ project, navigate, onStatusChange, onDeactivate }) {
  const openView = () => navigate(`/admin/projects/${project._id}`);
  const openEdit = () => navigate(`/admin/projects/${project._id}/edit`);
  const setStatus = () => project.status === 'active' ? onDeactivate(project) : onStatusChange(project, 'active');

  return (
    <details className="group relative inline-block text-left">
      <summary aria-label={`Actions for ${project.projectName}`} className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 [&::-webkit-details-marker]:hidden">
        <MoreHorizontal className="h-5 w-5" />
      </summary>
      <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
        <button type="button" onClick={openView} className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">View</button>
        <button type="button" onClick={openEdit} className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">Edit</button>
        <button type="button" onClick={setStatus} className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50 ${project.status === 'active' ? 'text-rose-700' : 'text-emerald-700'}`}>
          {project.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </details>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-slate-100" aria-label="Loading projects" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => <div key={index} className="grid grid-cols-5 gap-5 px-5 py-5"><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /></div>)}
    </div>
  );
}

function ConfirmDeactivate({ project, busy, onCancel, onConfirm }) {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="deactivate-title" className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-800"><CircleAlert className="h-5 w-5" /></span>
        <h2 id="deactivate-title" className="mt-4 font-heading text-lg font-semibold text-slate-900">Deactivate Project?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">This project will no longer be available for new inspection assignments.</p>
        <p className="mt-3 text-sm font-medium text-slate-800">{project.projectName}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" disabled={busy} onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-60">{busy ? 'Deactivating…' : 'Deactivate'}</button>
        </div>
      </section>
    </div>
  );
}

function ProjectsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [state, setState] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deactivateProject, setDeactivateProject] = useState(null);
  const [statusBusy, setStatusBusy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    const params = { page: String(pagination.page), limit: String(pagination.limit), search, status, riskLevel, state, sortBy, sortOrder };
    projectService.list(token, params, controller.signal)
      .then((data) => {
        setProjects(data.projects);
        setStates(data.states || []);
        setPagination(data.pagination);
        setError('');
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message || 'Unable to load projects.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token, pagination.page, pagination.limit, search, status, riskLevel, state, sortBy, sortOrder, retry]);

  const loadNextPage = (nextPage) => {
    setLoading(true);
    setPagination((current) => ({ ...current, page: nextPage }));
  };

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setLoading(true);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('all');
    setRiskLevel('all');
    setState('all');
    setLoading(true);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const changeSort = (event) => {
    const [nextSort, nextOrder] = event.target.value.split(':');
    setSortBy(nextSort);
    setSortOrder(nextOrder);
    setLoading(true);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const updateStatus = async (project, nextStatus) => {
    setStatusBusy(true);
    try {
      await projectService.updateStatus(token, project._id, nextStatus);
      setDeactivateProject(null);
      setToast({ message: nextStatus === 'active' ? 'Project activated successfully' : 'Project deactivated successfully', type: 'success' });
      setRetry((value) => value + 1);
    } catch (requestError) {
      setToast({ message: requestError.message || 'Unable to update project status.', type: 'error' });
    } finally {
      setStatusBusy(false);
    }
  };

  const hasFilters = Boolean(searchInput || status !== 'all' || riskLevel !== 'all' || state !== 'all');
  const noProjects = !pagination.total && !hasFilters;
  const noMatches = !pagination.total && hasFilters;
  const pageWindowStart = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, pagination.totalPages) },
    (_, index) => pageWindowStart + index,
  );

  return (
    <AdminSectionLayout title="Projects" subtitle="Manage monitored projects and implementing organizations">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <ConfirmDeactivate
        project={deactivateProject}
        busy={statusBusy}
        onCancel={() => setDeactivateProject(null)}
        onConfirm={() => updateStatus(deactivateProject, 'inactive')}
      />

      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">Portfolio management</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">Projects</h2>
            <p className="mt-1 text-sm text-slate-600">Manage monitored projects and implementing organizations</p>
          </div>
          <Link to="/admin/projects/new" className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 sm:self-auto"><Plus className="h-4 w-4" />Add Project</Link>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Project search and filters">
          <div className="grid gap-3 xl:grid-cols-[minmax(230px,1.4fr)_repeat(3,minmax(140px,.7fr))_minmax(190px,.9fr)]">
            <label className="relative block">
              <span className="sr-only">Search projects, NGOs or project codes</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={searchInput} onChange={(event) => { setSearchInput(event.target.value); setLoading(true); setPagination((current) => ({ ...current, page: 1 })); }} placeholder="Search projects, NGOs or project codes…" className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="relative">
              <span className="sr-only">Filter by status</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={status} onChange={changeFilter(setStatus)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm capitalize text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option></select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
            <label className="relative">
              <span className="sr-only">Filter by risk</span>
              <select value={riskLevel} onChange={changeFilter(setRiskLevel)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm capitalize text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"><option value="all">All risk levels</option><option value="low">Low risk</option><option value="medium">Medium risk</option><option value="high">High risk</option></select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
            <label className="relative">
              <span className="sr-only">Filter by state</span>
              <select value={state} onChange={changeFilter(setState)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"><option value="all">All states</option>{states.map((item) => <option key={item} value={item}>{item}</option>)}</select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
            <label className="relative">
              <span className="sr-only">Sort projects</span>
              <select value={`${sortBy}:${sortOrder}`} onChange={changeSort} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                <option value="createdAt:desc">Newest first</option><option value="createdAt:asc">Oldest first</option>
                <option value="projectName:asc">Project name A–Z</option><option value="projectName:desc">Project name Z–A</option>
                <option value="beneficiaryCount:desc">Beneficiaries high–low</option><option value="beneficiaryCount:asc">Beneficiaries low–high</option>
                <option value="riskScore:desc">Risk score high–low</option><option value="riskScore:asc">Risk score low–high</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>{loading ? 'Loading projects…' : `${pagination.total} project${pagination.total === 1 ? '' : 's'}`}</span>
            {hasFilters && <button type="button" onClick={clearFilters} className="font-semibold text-blue-700 hover:text-blue-900">Clear Filters</button>}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
              <CircleAlert className="h-8 w-8 text-rose-600" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-slate-900">Unable to load projects</h3>
              <p className="mt-1 text-sm text-slate-500">Please try again. The project list is temporarily unavailable.</p>
              <button type="button" onClick={() => { setLoading(true); setRetry((value) => value + 1); }} className="mt-4 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900">Retry</button>
            </div>
          ) : loading ? <TableSkeleton /> : noProjects || noMatches ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600"><Building2 className="h-6 w-6" /></span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900">{noMatches ? 'No matching projects' : 'No projects found'}</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">{noMatches ? 'Try adjusting or clearing your filters.' : 'Add your first monitored project to get started.'}</p>
              {noMatches ? <button type="button" onClick={clearFilters} className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear Filters</button> : <Link to="/admin/projects/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"><Plus className="h-4 w-4" />Add Project</Link>}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                  <thead><tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    <th className="px-5 py-3">Project</th><th className="px-4 py-3">NGO</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Beneficiaries</th><th className="px-4 py-3">Risk</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last Inspection</th><th className="px-3 py-3"><span className="sr-only">Actions</span></th>
                  </tr></thead>
                  <tbody>{projects.map((project) => (
                    <tr key={project._id} className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0">
                      <td className="px-5 py-3.5"><Link to={`/admin/projects/${project._id}`} className="font-semibold text-slate-800 hover:text-blue-800">{project.projectName}</Link><p className="mt-0.5 text-xs text-slate-500">{project.projectCode}</p></td>
                      <td className="px-4 py-3.5 text-slate-600">{project.ngoName}</td><td className="px-4 py-3.5 text-slate-600">{project.city}, {project.state}</td>
                      <td className="px-4 py-3.5 text-slate-700">{Number(project.beneficiaryCount).toLocaleString()}</td><td className="px-4 py-3.5"><ProjectRiskBadge level={project.riskLevel} score={project.riskScore} /></td><td className="px-4 py-3.5"><ProjectStateBadge status={project.status} /></td><td className="px-4 py-3.5 whitespace-nowrap text-slate-600">{formatDate(project.lastInspection)}</td>
                      <td className="px-3 py-3.5"><ProjectActions project={project} navigate={navigate} onStatusChange={updateStatus} onDeactivate={setDeactivateProject} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {projects.map((project) => (
                  <article key={project._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0"><Link to={`/admin/projects/${project._id}`} className="break-words font-semibold text-slate-900 hover:text-blue-800">{project.projectName}</Link><p className="mt-1 text-xs text-slate-500">{project.projectCode}</p></div>
                      <ProjectActions project={project} navigate={navigate} onStatusChange={updateStatus} onDeactivate={setDeactivateProject} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{project.ngoName}</p>
                    <p className="mt-1 text-xs text-slate-500">{project.city}, {project.state} · {Number(project.beneficiaryCount).toLocaleString()} beneficiaries</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2"><ProjectRiskBadge level={project.riskLevel} score={project.riskScore} /><ProjectStateBadge status={project.status} /><span className="text-xs text-slate-500">Last inspected {formatDate(project.lastInspection)}</span></div>
                  </article>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</p>
                {pagination.totalPages > 1 && <nav aria-label="Project pages" className="flex items-center gap-1 self-end sm:self-auto">
                  <button type="button" disabled={pagination.page <= 1} onClick={() => loadNextPage(pagination.page - 1)} aria-label="Previous page" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                  {pageWindowStart > 1 && <><button type="button" onClick={() => loadNextPage(1)} className="h-9 min-w-9 rounded-lg border border-slate-200 px-2 text-sm text-slate-600 hover:bg-slate-50">1</button><span className="px-1 text-slate-400">…</span></>}
                  {visiblePages.map((page) => <button type="button" key={page} onClick={() => loadNextPage(page)} aria-current={pagination.page === page ? 'page' : undefined} className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium ${pagination.page === page ? 'bg-blue-800 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>)}
                  {pageWindowStart + visiblePages.length - 1 < pagination.totalPages && <><span className="px-1 text-slate-400">…</span><button type="button" onClick={() => loadNextPage(pagination.totalPages)} className="h-9 min-w-9 rounded-lg border border-slate-200 px-2 text-sm text-slate-600 hover:bg-slate-50">{pagination.totalPages}</button></>}
                  <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => loadNextPage(pagination.page + 1)} aria-label="Next page" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
                </nav>}
              </div>
            </>
          )}
        </section>
      </div>
    </AdminSectionLayout>
  );
}

export default ProjectsPage;