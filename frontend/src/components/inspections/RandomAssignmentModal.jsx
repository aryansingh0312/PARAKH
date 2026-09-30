import { useEffect, useState } from 'react';
import { AlertTriangle, CalendarClock, LoaderCircle, Shuffle, Users } from 'lucide-react';
import { inspectionService } from '../../services/inspectionService';

function addDeadlineDays(days) {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + days);
  deadline.setHours(18, 0, 0, 0);
  if (deadline <= new Date()) deadline.setHours(23, 59, 0, 0);
  return deadline.toISOString();
}

function tomorrowLocalInput() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 0, 0, 0);
  const offset = tomorrow.getTimezoneOffset() * 60000;
  return new Date(tomorrow.getTime() - offset).toISOString().slice(0, 16);
}

function RandomAssignmentModal({ token, onClose, onAssigned }) {
  const [eligibility, setEligibility] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(true);
  const [preset, setPreset] = useState('tomorrow');
  const [customDeadline, setCustomDeadline] = useState(tomorrowLocalInput);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    inspectionService.eligibility(token, controller.signal)
      .then(setEligibility)
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message || 'Unable to load assignment availability.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingEligibility(false);
      });
    return () => controller.abort();
  }, [token]);

  const resolveDeadline = () => {
    if (preset === 'today') return addDeadlineDays(0);
    if (preset === '3days') return addDeadlineDays(3);
    if (preset === 'custom') return new Date(customDeadline).toISOString();
    return addDeadlineDays(1);
  };

  const submit = async () => {
    setError('');
    let deadline;
    try {
      deadline = resolveDeadline();
    } catch {
      setError('Choose a valid inspection deadline.');
      return;
    }
    if (new Date(deadline) <= new Date()) {
      setError('The inspection deadline must be in the future.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await inspectionService.assignRandom(token, deadline);
      onAssigned(result.inspection);
    } catch (requestError) {
      setError(requestError.message || 'Unable to generate an assignment.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="random-assignment-title" className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800"><Shuffle className="h-5 w-5" /></span>
          <h2 id="random-assignment-title" className="mt-4 font-heading text-xl font-semibold text-slate-900">Create Random Inspection</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">PARAKH will randomly select an active project and eligible inspector.</p>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-xs text-slate-500">Eligible Projects</p><p className="mt-1 font-heading text-2xl font-semibold text-slate-900">{loadingEligibility ? '—' : eligibility?.eligibleProjects ?? 0}</p></div>
            <div className="rounded-lg border border-slate-200 p-3"><p className="text-xs text-slate-500">Eligible Inspectors</p><p className="mt-1 flex items-center gap-2 font-heading text-2xl font-semibold text-slate-900">{loadingEligibility ? '—' : eligibility?.eligibleInspectors ?? 0}<Users className="h-4 w-4 text-slate-400" /></p></div>
          </div>
          <div>
            <label htmlFor="inspection-deadline-preset" className="mb-2 block text-sm font-medium text-slate-700">Inspection Deadline</label>
            <div className="relative">
              <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select id="inspection-deadline-preset" value={preset} onChange={(event) => setPreset(event.target.value)} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                <option value="today">Today · 6:00 PM</option><option value="tomorrow">Tomorrow · 6:00 PM</option><option value="3days">3 Days · 6:00 PM</option><option value="custom">Custom</option>
              </select>
            </div>
            {preset === 'custom' && <input aria-label="Custom inspection deadline" type="datetime-local" value={customDeadline} onChange={(event) => setCustomDeadline(event.target.value)} className="mt-3 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />}
          </div>
          {error && <div role="alert" className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" disabled={submitting} onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="button" disabled={submitting || loadingEligibility || !eligibility?.eligibleProjects || !eligibility?.eligibleInspectors} onClick={submit} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}{submitting ? 'Generating…' : 'Generate Assignment'}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RandomAssignmentModal;