import { useState } from 'react';
import { ArrowRight, Check, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'signup' && !form.name.trim()) {
      setError('Name is required.');
      return;
    }

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup' && form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (mode === 'signup' && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = mode === 'signup'
        ? await register(form.name.trim(), form.email.trim(), form.password)
        : await login(form.email.trim(), form.password, rememberMe);
      const role = response.user.role;

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      if (role === 'inspector') {
        navigate('/inspector/dashboard', { replace: true });
        return;
      }

      if (role === 'pmu') {
        navigate('/pmu/dashboard', { replace: true });
        return;
      }

      navigate('/ngo/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)] lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-8 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.25),transparent_35%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-heading text-2xl font-semibold tracking-[0.2em] text-white">PARAKH</span>
            </div>

            <div className="mt-16 max-w-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">AI-powered monitoring</p>
              <h1 className="font-heading text-4xl font-semibold leading-tight tracking-[-0.05em] text-white">
                Secure, transparent oversight for public programmes.
              </h1>
              <p className="mt-5 text-base leading-7 text-blue-100">
                Centralized field monitoring, GPS verification, digital evidence, and risk intelligence for government teams.
              </p>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm text-blue-100">
              <span>Inspection integrity</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-200">
                Verified
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['124', 'Projects'],
                ['106', 'Completed'],
                ['98%', 'Location Verified'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-slate-950/20 p-3">
                  <div className="text-xl font-semibold text-white">{value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-blue-100">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-semibold tracking-[0.2em] text-slate-900">PARAKH</span>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">PARAKH</p>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-slate-900">
                  {mode === 'signup' ? 'Create your PARAKH account' : 'Secure access to the monitoring platform'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                      Full name
                    </label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      placeholder="name@parakh.gov"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your password"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    />
                  </div>
                </div>

                {mode === 'signup' ? (
                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                      Confirm password
                    </label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                      />
                      Remember me
                    </label>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-base font-medium text-white shadow-[0_16px_30px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-600">
                {mode === 'signup' ? 'Already have an account?' : 'New to PARAKH?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'login' : 'signup');
                    setError('');
                  }}
                  className="font-semibold text-blue-700 hover:text-blue-800"
                >
                  {mode === 'signup' ? 'Sign in' : 'Sign up'}
                </button>
              </p>
              {mode === 'signup' && (
                <p className="mt-2 text-center text-xs text-slate-500">
                  New accounts receive Inspector access.
                </p>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3 w-3" />
                </span>
                Authorized personnel only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
