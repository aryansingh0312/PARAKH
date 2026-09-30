import Cta from '../components/Cta';
import DashboardPreview from '../components/DashboardPreview';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import InspectorApp from '../components/InspectorApp';
import Navbar from '../components/Navbar';
import ProblemSection from '../components/ProblemSection';
import RiskDetection from '../components/RiskDetection';
import SecuritySection from '../components/SecuritySection';
import Stats from '../components/Stats';

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ProblemSection />
        <Features />
        <RiskDetection />
        <HowItWorks />
        <InspectorApp />
        <DashboardPreview />
        <SecuritySection />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
