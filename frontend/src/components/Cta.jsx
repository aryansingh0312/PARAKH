import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Cta() {
  return (
    <section id="cta" className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-blue-200 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-6 py-10 text-white shadow-[0_30px_80px_rgba(37,99,235,0.28)] sm:px-10 lg:px-12 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              Make every inspection count.
            </h2>
            <p className="mt-4 text-base leading-8 text-blue-100 sm:text-lg">
              Bring field inspections, evidence and intelligent monitoring together in one platform.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-medium text-blue-700 shadow-[0_12px_28px_rgba(15,23,42,0.10)] transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
