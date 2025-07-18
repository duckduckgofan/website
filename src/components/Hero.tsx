import React, { useState, useEffect, useRef } from 'react';
import { Server, AlertTriangle, Shield, Zap, FileText } from 'lucide-react';
import { Link } from './Link';

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; radius: number; color: string; vx: number; vy: number; originX: number; originY: number }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        const colors = ['rgba(99, 102, 241, 0.5)', 'rgba(139, 92, 246, 0.5)', 'rgba(236, 72, 153, 0.5)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const vx = (Math.random() - 0.5) * 0.5;
        const vy = (Math.random() - 0.5) * 0.5;
        
        particles.push({ x, y, radius, color, vx, vy, originX: x, originY: y });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx = -particle.vx;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy = -particle.vy;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 51, 234, ${(100 - distance) / 500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none"></div>
      <div className="container mx-auto px-4 z-10 pt-32 md:pt-20">
        <div className="max-w-4xl mx-auto text-center mt-16 md:mt-24">
          <div className="inline-block mb-6 py-1 px-3 rounded-full bg-indigo-900/50 backdrop-blur-sm">
            <p className="text-sm text-indigo-300 font-medium">Advanced Threat Intelligence Platform</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            <span className="block">
              Advanced 
              <span className="relative inline-block px-2">
                <span className="relative z-10">Honeypot</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-indigo-600/30 transform -rotate-1 -z-0"></span>
              </span>
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Threat Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Proactive cyber defense through advanced honeypot technology. Detect, analyze, and respond to threats
            before they impact your organization's critical assets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="#contact"
              className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-300 text-lg flex items-center justify-center group"
            >
              Get Started
              <Zap className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="#features"
              className="px-8 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors duration-300 text-lg border border-gray-700"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center transform transition-transform hover:scale-105 border border-gray-700/50">
            <div className="bg-indigo-900/50 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
              <Server className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-white font-medium">Honeypot Network</h3>
            <p className="text-gray-400 text-sm">Distributed honeypot infrastructure that mimics real assets to attract and analyze threats</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center transform transition-transform hover:scale-105 border border-gray-700/50">
            <div className="bg-purple-900/50 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-medium">Threat Analysis</h3>
            <p className="text-gray-400 text-sm">Real-time analysis of attacker behavior, techniques, and patterns</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center transform transition-transform hover:scale-105 border border-gray-700/50">
            <div className="bg-blue-900/50 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-medium">Intelligence Reports</h3>
            <p className="text-gray-400 text-sm">Detailed threat intelligence reports with actionable insights</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center transform transition-transform hover:scale-105 border border-gray-700/50">
            <div className="bg-green-900/50 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-medium">Active Defense</h3>
            <p className="text-gray-400 text-sm">Proactive threat mitigation strategies based on real-world attack data</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16 flex justify-center">
          <div className="group max-w-[400px] w-full">
            <div className="relative inline-block w-full">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 rounded-xl blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"
                style={{ animationDuration: '3s' }}
              ></div>
              <div className="transform-gpu p-1">
                <a 
                  href="https://www.abuseipdb.com/user/215225" 
                  title="AbuseIPDB is an IP address blacklist for webmasters and sysadmins to report IP addresses engaging in abusive behavior on their networks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block transition-all duration-300 group-hover:scale-[1.02] group-hover:translate-y-0"
                >
                  <div className="bg-gray-800/30 backdrop-blur-md p-5 rounded-xl border border-gray-700/50 group-hover:border-indigo-500/50 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-medium text-gray-200">Verified Security Partner</span>
                      </div>
                      <span className="text-xs font-medium text-white bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/20">AbuseIPDB</span>
                    </div>
                    <div className="relative min-h-[160px] rounded-xl overflow-hidden bg-gray-800/30">
                      {!imageLoaded && (
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/20 to-indigo-600/10 animate-pulse" style={{ animationDuration: '2s' }}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-500/20 animate-ping"></div>
                            <div className="absolute w-8 h-8 rounded-full bg-indigo-500/40"></div>
                          </div>
                          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-scan"></div>
                        </div>
                      )}
                      <img 
                        src="https://www.abuseipdb.com/contributor/215225.svg" 
                        alt="AbuseIPDB Contributor Badge" 
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        className={`
                          relative z-10 p-4
                          transition-all duration-500
                          ${imageLoaded 
                            ? 'opacity-100 scale-100 translate-y-0 blur-0' 
                            : 'opacity-0 scale-95 translate-y-4 blur-sm'
                          }
                        `}
                        onLoad={() => setImageLoaded(true)}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-300">Active Contributor</span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <span className="inline-block w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                        Threat Intelligence Network
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;