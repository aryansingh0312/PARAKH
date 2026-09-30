import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import AdminSectionLayout from '../../components/admin-dashboard/AdminSectionLayout';
import ProjectForm from '../../components/projects/ProjectForm';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../hooks/useAuth';

function ProjectFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEdit = mode === 'edit';
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isEdit) return undefined;
    const controller = new AbortController();
    projectService.get(token, id, controller.signal)
      .then((data) => setProject(data.project))
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(error.message || 'Unable to load project.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [isEdit, token, id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const result = isEdit
        ? await projectService.update(token, id, payload)
        : await projectService.create(token, payload);
      navigate(`/admin/projects/${result.project._id}`, {
        replace: true,
        state: { toast: isEdit ? 'Project updated successfully' : 'Project created successfully' },
      });
    } catch (error) {
      setSubmitError(error.message || 'Unable to save project.');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminSectionLayout title={isEdit ? 'Edit Project' : 'Add Project'} subtitle="Manage monitored projects and implementing organizations">
      <div className="mx-auto max-w-4xl space-y-5">
        <div>
          <Link to={isEdit && id ? `/admin/projects/${id}` : '/admin/projects'} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-800"><ArrowLeft className="h-4 w-4" />{isEdit ? 'Back to project' : 'Back to Projects'}</Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-800">Project management</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-900 sm:text-3xl">{isEdit ? 'Edit Project' : 'Add Project'}</h2>
          <p className="mt-1 text-sm text-slate-600">Enter the project and implementing organization details below.</p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4" aria-label="Loading project" aria-busy="true">{[1, 2, 3, 4].map((block) => <div key={block} className="h-48 rounded-xl border border-slate-200 bg-white" />)}</div>
        ) : loadError ? (
          <div className="rounded-xl border border-rose-200 bg-white p-6 text-center"><CircleAlert className="mx-auto h-8 w-8 text-rose-700" /><p className="mt-3 font-semibold text-slate-900">Unable to load project</p><p className="mt-1 text-sm text-slate-600">{loadError}</p></div>
        ) : (
          <>
            {submitError && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{submitError}</div>}
            <ProjectForm
              key={project?._id || 'new-project'}
              initialProject={project}
              onSubmit={handleSubmit}
              onCancel={() => navigate(isEdit && id ? `/admin/projects/${id}` : '/admin/projects')}
              submitLabel={isEdit ? 'Save Changes' : 'Create Project'}
              submitting={submitting}
            />
          </>
        )}
      </div>
    </AdminSectionLayout>
  );
}

export default ProjectFormPage;