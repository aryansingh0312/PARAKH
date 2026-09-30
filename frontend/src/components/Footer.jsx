import { ArrowUpRight, Globe, ShieldCheck } from 'lucide-react';

const links = ['Platform', 'Features', 'How It Works', 'Monitoring', 'About'];

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-semibold tracking-[0.2em] text-slate-900">PARAKH</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              AI-powered monitoring and inspection platform.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {links.map((link) => (
              <a
                key={link}
                href={link === 'Platform' ? '#home' : link === 'Features' ? '#features' : link === 'How It Works' ? '#how-it-works' : link === 'Monitoring' ? '#dashboard' : '#about'}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {[Globe, ArrowUpRight, ShieldCheck].map((Icon, index) => (
              <a
                key={index}
                href="#home"
                aria-label="PARAKH utility link"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>SIH 2026 Prototype</span>
          <span>© 2026 PARAKH</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
