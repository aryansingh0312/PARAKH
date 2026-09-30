import { CheckCircle2, CircleAlert, X } from 'lucide-react';

function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  const isError = type === 'error';
  const Icon = isError ? CircleAlert : CheckCircle2;

  return (
    <div role={isError ? 'alert' : 'status'} className={`fixed right-4 top-20 z-[70] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${isError ? 'border-rose-200 bg-white text-rose-800' : 'border-emerald-200 bg-white text-emerald-800'}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss notification" className="ml-2 rounded p-0.5 opacity-70 hover:bg-slate-100 hover:opacity-100"><X className="h-4 w-4" /></button>
    </div>
  );
}

export default Toast;