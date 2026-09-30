import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';
import AdminSectionLayout from '../../components/admin-dashboard/AdminSectionLayout';
import AssignmentSuccessModal from '../../components/inspections/AssignmentSuccessModal';
import RandomAssignmentModal from '../../components/inspections/RandomAssignmentModal';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

function RandomInspectionPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [assignment, setAssignment] = useState(false);

  return (
    <AdminSectionLayout title="Assign Inspection" subtitle="Random project and inspector assignment" activeId="inspections">
      <div className="mx-auto max-w-3xl">
        <button type="button" onClick={() => navigate('/admin/inspections')} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-800"><ArrowLeft className="h-4 w-4" />Back to Inspections</button>
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-7"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800"><ClipboardCheck className="h-5 w-5" /></span><h2 className="mt-4 font-heading text-xl font-semibold text-slate-900">Random Inspection Assignment</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">PARAKH selects an active project and an eligible inspector, avoiding recent inspector-project repeats when possible.</p></div>
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:justify-end sm:p-7"><button type="button" onClick={() => navigate('/admin/inspections')} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button></div>
        </section>
      </div>
      {assignment === false && <RandomAssignmentModal token={token} onClose={() => navigate('/admin/inspections')} onAssigned={setAssignment} />}
      {assignment && <AssignmentSuccessModal inspection={assignment} onDone={() => navigate('/admin/inspections', { replace: true })} />}
    </AdminSectionLayout>
  );
}

export default RandomInspectionPage;