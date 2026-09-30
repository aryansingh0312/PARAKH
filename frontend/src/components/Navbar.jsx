import { useEffect, useState } from 'react';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Monitoring', href: '#dashboard' },
  { label: 'About', href: '#about' },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md border-b border-slate-200/80'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="PARAKH home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-semibold tracking-[0.2em] text-slate-900">
              PARAKH
            </span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-700 transition hover:text-blue-700"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_22px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Access Dashboard
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
            aria-label="Open mobile navigation"
            onClick={() => setMobileOpen((state) => !state)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-md lg:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 grid gap-2 pt-2">
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Access Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
