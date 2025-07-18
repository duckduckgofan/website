import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThreatMap from './components/ThreatMap';
import ThreatAnalysis from './components/ThreatAnalysis';

function App() {
  const [showThreatAnalysis, setShowThreatAnalysis] = useState(false);

  useEffect(() => {
    // Update page title
    document.title = 'EliteHosting - Advanced Threat Intelligence Platform';
    
    // Dynamically set the favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/><path d="M12 22V12"/><path d="M12 12L4 7"/><path d="M12 12l8-5"/></svg>';
    }
  }, []);

  const handleThreatAnalysisClick = () => {
    setShowThreatAnalysis(true);
  };

  const handleBackToHome = () => {
    setShowThreatAnalysis(false);
  }

  if (showThreatAnalysis) {
    return <ThreatAnalysis />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar onThreatAnalysisClick={handleThreatAnalysisClick} />
      <Hero />
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Threat Intelligence</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Watch real-time cyber threats being detected and blocked across our global honeypot network.
            </p>
          </div>
          <ThreatMap />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;