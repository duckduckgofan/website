import React, { useState, useEffect, useRef } from 'react';
import { Rss, ShieldCheck, Bug, Mail, Globe, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';

// Using a reliable CDN link for the high-quality "Earth at Night" image.
const WORLD_MAP_URL = 'https://cdn.jsdelivr.net/gh/stemkoski/stemkoski.github.com/Three.js/images/earth-night.jpg';

interface Threat {
  id: number;
  source: { lat: number; lng: number; location: string };
  target: { lat: number; lng: number; location: string };
  type: 'HTTP Exploit' | 'MySQL BruteForce' | 'Telnet BruteForce' | 'SSH BruteForce';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  progress: number;
  duration: number;
  opacity: number; // For smooth fade-in/out
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
}

const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const ThreatMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapImageRef = useRef<HTMLImageElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [openThreats, setOpenThreats] = useState<Threat[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });

  // Load world map image from a reliable CDN
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Necessary for loading images from other domains
    img.src = WORLD_MAP_URL;
    img.onload = () => {
      mapImageRef.current = img;
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error('CRITICAL: Failed to load map image from CDN. The dashboard will function without the map background.');
      setIsLoading(false);
    };
  }, []);

  // Generate and manage threats
  useEffect(() => {
    const generateThreats = () => {
      const threatTypes: Threat['type'][] = ['HTTP Exploit','MySQL BruteForce', 'Telnet BruteForce', 'SSH BruteForce'];
      const severities: Threat['severity'][] = ['low', 'medium', 'high', 'critical'];
      const locations = [
        // North America
        { location: 'New York, USA', lat: 40.7128, lng: -74.0060 }, { location: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437 },
        { location: 'Chicago, USA', lat: 41.8781, lng: -87.6298 }, { location: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
        { location: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207 }, { location: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
        { location: 'Miami, USA', lat: 25.7617, lng: -80.1918 }, { location: 'Montreal, Canada', lat: 45.5017, lng: -73.5673 },
        { location: 'Dallas, USA', lat: 32.7767, lng: -96.7970 }, { location: 'Houston, USA', lat: 29.7604, lng: -95.3698 },
        { location: 'Phoenix, USA', lat: 33.4484, lng: -112.0740 }, { location: 'Philadelphia, USA', lat: 39.9526, lng: -75.1652 },
        { location: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 }, { location: 'Seattle, USA', lat: 47.6062, lng: -122.3321 },
        { location: 'Denver, USA', lat: 39.7392, lng: -104.9903 }, { location: 'Boston, USA', lat: 42.3601, lng: -71.0589 },
        { location: 'Atlanta, USA', lat: 33.7490, lng: -84.3880 }, { location: 'Calgary, Canada', lat: 51.0447, lng: -114.0719 },
        { location: 'Ottawa, Canada', lat: 45.4215, lng: -75.6972 }, { location: 'Edmonton, Canada', lat: 53.5461, lng: -113.4938 },
        
        // Europe
        { location: 'London, UK', lat: 51.5074, lng: -0.1278 }, { location: 'Paris, France', lat: 48.8566, lng: 2.3522 },
        { location: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 }, { location: 'Madrid, Spain', lat: 40.4168, lng: -3.7038 },
        { location: 'Rome, Italy', lat: 41.9028, lng: 12.4964 }, { location: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
        { location: 'Moscow, Russia', lat: 55.7558, lng: 37.6173 }, { location: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
        { location: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686 }, { location: 'Vienna, Austria', lat: 48.2082, lng: 16.3738 },
        { location: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122 }, { location: 'Brussels, Belgium', lat: 50.8503, lng: 4.3517 },
        { location: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683 }, { location: 'Oslo, Norway', lat: 59.9139, lng: 10.7522 },
        { location: 'Helsinki, Finland', lat: 60.1699, lng: 24.9384 }, { location: 'Dublin, Ireland', lat: 53.3498, lng: -6.2603 },
        { location: 'Prague, Czech Republic', lat: 50.0755, lng: 14.4378 }, { location: 'Budapest, Hungary', lat: 47.4979, lng: 19.0402 },
        { location: 'Bucharest, Romania', lat: 44.4268, lng: 26.1025 }, { location: 'Athens, Greece', lat: 37.9838, lng: 23.7275 },
        { location: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 }, { location: 'Zagreb, Croatia', lat: 45.8150, lng: 15.9819 },
        { location: 'Belgrade, Serbia', lat: 44.7866, lng: 20.4489 }, { location: 'Sofia, Bulgaria', lat: 42.6977, lng: 23.3219 },
        
        // Asia
        { location: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 }, { location: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
        { location: 'Beijing, China', lat: 39.9042, lng: 116.4074 }, { location: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780 },
        { location: 'Mumbai, India', lat: 19.0760, lng: 72.8777 }, { location: 'Delhi, India', lat: 28.6139, lng: 77.2090 },
        { location: 'Singapore', lat: 1.3521, lng: 103.8198 }, { location: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
        { location: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 }, { location: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
        { location: 'Manila, Philippines', lat: 14.5995, lng: 120.9842 }, { location: 'Taipei, Taiwan', lat: 25.0330, lng: 121.5654 },
        { location: 'Osaka, Japan', lat: 34.6937, lng: 135.5023 }, { location: 'Guangzhou, China', lat: 23.1291, lng: 113.2644 },
        { location: 'Shenzhen, China', lat: 22.5431, lng: 114.0579 }, { location: 'Chengdu, China', lat: 30.5728, lng: 104.0668 },
        { location: 'Bangalore, India', lat: 12.9716, lng: 77.5946 }, { location: 'Chennai, India', lat: 13.0827, lng: 80.2707 },
        { location: 'Kolkata, India', lat: 22.5726, lng: 88.3639 }, { location: 'Hanoi, Vietnam', lat: 21.0285, lng: 105.8542 },
        { location: 'Ho Chi Minh City, Vietnam', lat: 10.8231, lng: 106.6297 }, { location: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869 },
        { location: 'Yangon, Myanmar', lat: 16.8661, lng: 96.1951 }, { location: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
        
        // Australia/Oceania
        { location: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 }, { location: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631 },
        { location: 'Brisbane, Australia', lat: -27.4698, lng: 153.0251 }, { location: 'Auckland, New Zealand', lat: -36.8509, lng: 174.7645 },
        { location: 'Perth, Australia', lat: -31.9505, lng: 115.8605 }, { location: 'Adelaide, Australia', lat: -34.9285, lng: 138.6007 },
        { location: 'Gold Coast, Australia', lat: -28.0167, lng: 153.4000 }, { location: 'Wellington, New Zealand', lat: -41.2866, lng: 174.7756 },
        { location: 'Christchurch, New Zealand', lat: -43.5320, lng: 172.6306 }, { location: 'Hobart, Australia', lat: -42.8821, lng: 147.3272 },
        
        // South America
        { location: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 }, { location: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729 },
        { location: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 }, { location: 'Lima, Peru', lat: -12.0464, lng: -77.0428 },
        { location: 'Santiago, Chile', lat: -33.4489, lng: -70.6693 }, { location: 'Bogotá, Colombia', lat: 4.7110, lng: -74.0721 },
        { location: 'Brasília, Brazil', lat: -15.7975, lng: -47.8919 }, { location: 'Montevideo, Uruguay', lat: -34.9011, lng: -56.1645 },
        { location: 'Quito, Ecuador', lat: -0.1807, lng: -78.4678 }, { location: 'Caracas, Venezuela', lat: 10.4806, lng: -66.9036 },
        { location: 'Asunción, Paraguay', lat: -25.2867, lng: -57.3333 }, { location: 'La Paz, Bolivia', lat: -16.4897, lng: -68.1193 },
        
        // Africa
        { location: 'Johannesburg, SA', lat: -26.2041, lng: 28.0473 }, { location: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
        { location: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 }, { location: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
        { location: 'Casablanca, Morocco', lat: 33.5731, lng: -7.5898 }, { location: 'Cape Town, SA', lat: -33.9249, lng: 18.4241 },
        { location: 'Addis Ababa, Ethiopia', lat: 9.0320, lng: 38.7492 }, { location: 'Dar es Salaam, Tanzania', lat: -6.7924, lng: 39.2083 },
        { location: 'Luanda, Angola', lat: -8.8383, lng: 13.2344 }, { location: 'Khartoum, Sudan', lat: 15.5007, lng: 32.5599 },
        { location: 'Accra, Ghana', lat: 5.6037, lng: -0.1870 }, { location: 'Algiers, Algeria', lat: 36.7538, lng: 3.0588 },
        { location: 'Tunis, Tunisia', lat: 36.8065, lng: 10.1815 }, { location: 'Dakar, Senegal', lat: 14.7167, lng: -17.4677 },
        
        // Middle East
        { location: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 }, { location: 'Tel Aviv, Israel', lat: 32.0853, lng: 34.7818 },
        { location: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753 }, { location: 'Doha, Qatar', lat: 25.2854, lng: 51.5310 },
        { location: 'Abu Dhabi, UAE', lat: 24.4539, lng: 54.3773 }, { location: 'Kuwait City, Kuwait', lat: 29.3759, lng: 47.9774 },
        { location: 'Muscat, Oman', lat: 23.5880, lng: 58.3829 }, { location: 'Manama, Bahrain', lat: 26.2285, lng: 50.5860 },
        { location: 'Amman, Jordan', lat: 31.9454, lng: 35.9284 }, { location: 'Beirut, Lebanon', lat: 33.8938, lng: 35.5018 }
      ];

      const newThreats = Array.from({ length: Math.floor(3 + Math.random() * 4) }, (_, i) => {
        const sourceLocation = locations[Math.floor(Math.random() * locations.length)];
        let targetLocation = locations[Math.floor(Math.random() * locations.length)];
        while (targetLocation.location === sourceLocation.location) {
          targetLocation = locations[Math.floor(Math.random() * locations.length)];
        }
        
        // Add realism by scattering attacks around a central point
        const jitter = () => (Math.random() - 0.5) * 2.5;

        const source = {
            location: sourceLocation.location,
            lat: sourceLocation.lat + jitter(),
            lng: sourceLocation.lng + jitter(),
        };
        const target = {
            location: targetLocation.location,
            lat: targetLocation.lat + jitter(),
            lng: targetLocation.lng + jitter(),
        };
        
        return {
          id: Date.now() + i,
          source,
          target,
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: Date.now() - Math.floor(Math.random() * 60000),
          progress: 0,
          duration: 6000 + Math.random() * 4000,
          opacity: 0,
        };
      });

      setThreats(prev => [...newThreats, ...prev.slice(0, 50)].sort((a,b) => b.timestamp - a.timestamp));
    };

    generateThreats();
    const interval = setInterval(generateThreats, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setStats({
      total: threats.length,
      critical: threats.filter(t => t.severity === 'critical').length,
      high: threats.filter(t => t.severity === 'high').length,
      medium: threats.filter(t => t.severity === 'medium').length,
      low: threats.filter(t => t.severity === 'low').length,
    });
  }, [threats]);

  // Main animation loop
  useEffect(() => {
    let animationFrameId: number;
    const frameInterval = 1000 / 60;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (timestamp - lastTimestamp >= frameInterval) {
        setThreats(prev =>
          prev.map(t => {
            const newProgress = t.progress + frameInterval / t.duration;
            let newOpacity = t.opacity;

            // Fade in and out logic
            if (newProgress < 0.15) {
              newOpacity = newProgress / 0.15;
            } else if (newProgress > 0.85) {
              newOpacity = (1 - newProgress) / 0.15;
            } else {
              newOpacity = 1;
            }

            return { ...t, progress: newProgress, opacity: Math.max(0, newOpacity) };
          }).filter(t => t.progress < 1.1) // Keep it a bit longer for fade out
        );

        setParticles(prev => {
          const newParticles = [...prev];
          // Update existing particles
          const updated = newParticles.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.02,
          })).filter(p => p.opacity > 0);

          // Add new particles for completed threats
          threats.forEach(threat => {
            if (threat.progress >= 1 && threat.progress - (frameInterval / threat.duration) < 1) {
              const canvas = canvasRef.current;
              if (!canvas) return;
              const targetX = ((threat.target.lng + 180) / 360) * canvas.width;
              const targetY = ((90 - threat.target.lat) / 180) * canvas.height;
              for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 1;
                updated.push({
                  x: targetX,
                  y: targetY,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  size: Math.random() * 2 + 1,
                  opacity: 1,
                });
              }
            }
          });
          return updated;
        });
        
        lastTimestamp = timestamp;
      }
      drawCanvas();
      animationFrameId = requestAnimationFrame(animate);
    };

    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas || isLoading) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw map background
      if (mapImageRef.current) {
        ctx.drawImage(mapImageRef.current, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(10, 16, 29, 0.7)'; // Dark blue overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#0a101d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw animated grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      const timeFactor = Date.now() / 2000;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i + Math.sin(timeFactor + i) * 2, 0);
        ctx.lineTo(i + Math.sin(timeFactor + i) * 2, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i + Math.cos(timeFactor + i) * 2);
        ctx.lineTo(canvas.width, i + Math.cos(timeFactor + i) * 2);
        ctx.stroke();
      }
      
      // Draw impact particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 80, 80, ${p.opacity})`;
        ctx.fill();
      });

      // Draw threats
      threats.forEach(threat => {
        const sourceX = ((threat.source.lng + 180) / 360) * canvas.width;
        const sourceY = ((90 - threat.source.lat) / 180) * canvas.height;
        const targetX = ((threat.target.lng + 180) / 360) * canvas.width;
        const targetY = ((90 - threat.target.lat) / 180) * canvas.height;
        
        const controlPointX = (sourceX + targetX) / 2 + (targetY - sourceY) * 0.3;
        const controlPointY = (sourceY + targetY) / 2 - (targetX - sourceX) * 0.3;

        const easedProgress = easeInOutQuad(threat.progress);
        const currentPoint = (t: number) => {
            const x = Math.pow(1 - t, 2) * sourceX + 2 * (1 - t) * t * controlPointX + Math.pow(t, 2) * targetX;
            const y = Math.pow(1 - t, 2) * sourceY + 2 * (1 - t) * t * controlPointY + Math.pow(t, 2) * targetY;
            return {x, y};
        };

        const {x: currentX, y: currentY} = currentPoint(easedProgress);

        let severityColor;
        switch (threat.severity) {
          case 'critical': severityColor = [255, 71, 87]; break;
          case 'high': severityColor = [255, 127, 80]; break;
          case 'medium': severityColor = [255, 215, 0]; break;
          default: severityColor = [0, 255, 127];
        }
        const color = `rgba(${severityColor.join(',')}, ${threat.opacity})`;

        // Draw the particle trail
        const trailLength = 20;
        for (let i = 0; i < trailLength; i++) {
          const t = easedProgress - i * 0.01;
          if (t > 0) {
            const {x, y} = currentPoint(t);
            const trailOpacity = (1 - i / trailLength) * 0.5 * threat.opacity;
            const size = (1 - i / trailLength) * 3; // Increased trail particle size
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${severityColor.join(',')}, ${trailOpacity})`;
            ctx.fill();
          }
        }
        
        // Draw the pulse head with multiple layers for a modern glow
        if (threat.progress < 1) {
          // Main glow
          ctx.beginPath();
          ctx.arc(currentX, currentY, 12, 0, Math.PI * 2); // Increased size
          ctx.fillStyle = `rgba(${severityColor.join(',')}, ${0.15 * threat.opacity})`;
          ctx.fill();
          
          // Inner glow
          ctx.beginPath();
          ctx.arc(currentX, currentY, 7, 0, Math.PI * 2); // Increased size
          ctx.fillStyle = `rgba(${severityColor.join(',')}, ${0.3 * threat.opacity})`;
          ctx.fill();
          
          // Lens flare effect
          const flareGradient = ctx.createLinearGradient(currentX - 15, currentY, currentX + 15, currentY);
          flareGradient.addColorStop(0, `rgba(${severityColor.join(',')}, 0)`);
          flareGradient.addColorStop(0.5, `rgba(${severityColor.join(',')}, ${0.5 * threat.opacity})`);
          flareGradient.addColorStop(1, `rgba(${severityColor.join(',')}, 0)`);
          ctx.fillStyle = flareGradient;
          ctx.fillRect(currentX - 15, currentY - 1.5, 30, 3); // Increased size

          // Bright core
          ctx.beginPath();
          ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2); // Increased size
          ctx.fillStyle = `rgba(255, 255, 255, ${threat.opacity})`;
          ctx.fill();
        }

        // Draw source/target markers and pings
        // Source Ping Animation
        const pingProgress = threat.progress / 0.2; // Ping lasts for first 20% of travel
        if (pingProgress < 1) {
            const radius = easeInOutQuad(pingProgress) * 30; // Increased size
            const opacity = (1 - pingProgress) * threat.opacity;
            ctx.beginPath();
            ctx.arc(sourceX, sourceY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${severityColor.join(',')}, ${opacity})`;
            ctx.lineWidth = 2.5 - (pingProgress * 2);
            ctx.stroke();
        }
        
        // Static target marker (flashes on impact via particle system)
        ctx.beginPath();
        ctx.arc(targetX, targetY, 5, 0, Math.PI * 2); // Increased size
        ctx.fillStyle = `rgba(${severityColor.join(',')}, ${0.5 * threat.opacity})`;
        ctx.fill();
      });
    };

    if (!isLoading) {
      animationFrameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [threats, isLoading, particles]);

  const handleThreatClick = (threat: Threat) => {
    // Set the clicked window as active to bring it to the front
    setActiveWindowId(threat.id);

    setOpenThreats(prev => {
      // If window isn't open yet, add it.
      if (!prev.find(t => t.id === threat.id)) {
        return [...prev, threat].slice(-5); // Limit to 5 open windows
      }
      return prev; // Otherwise, the list of open windows remains the same.
    });
  };
  
  const getThreatIcon = (type: Threat['type']) => {
    switch (type) {
      case 'HTTP Exploit': return <Zap className="w-4 h-4" />;
      case 'MySQL BruteForce': return <ShieldAlert className="w-4 h-4" />;
      case 'Telnet BruteForce': return <Bug className="w-4 h-4" />;
      case 'SSH BruteForce': return <ShieldCheck className="w-4 h-4" />;
    }
  };

  const getSeverityClass = (severity: Threat['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
    }
  };
  
  const StatCard: React.FC<{label: string, value: number, colorClass: string, icon: React.ReactNode}> = ({label, value, colorClass, icon}) => (
    <div className="bg-white/5 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
            <div className={`text-xs ${colorClass} uppercase`}>{label}</div>
            <div className={colorClass}>{icon}</div>
        </div>
        <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    </div>
  );

  return (
    <div className="relative w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-700 font-sans">
      {/* Map and Overlays */}
      <div ref={mapContainerRef} className="relative h-[600px] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            <span className="ml-4 text-gray-300 text-lg">Calibrating Global Sensors...</span>
          </div>
        )}
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-blue-300 animate-pulse" />
            <h1 className="text-2xl font-bold text-white tracking-wider">EliteHosting - ThreatMap</h1>
          </div>
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <Rss className="w-4 h-4" />
            <span>Live Feed</span>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="absolute bottom-4 left-4 grid grid-cols-2 lg:grid-cols-4 gap-3 z-10 w-full max-w-2xl">
            <StatCard label="Critical" value={stats.critical} colorClass="text-red-400" icon={<AlertTriangle />} />
            <StatCard label="High" value={stats.high} colorClass="text-orange-400" icon={<ShieldAlert />} />
            <StatCard label="Medium" value={stats.medium} colorClass="text-yellow-400" icon={<Zap />} />
            <StatCard label="Low" value={stats.low} colorClass="text-green-400" icon={<ShieldCheck />} />
        </div>

        {/* Draggable Threat Windows */}
        <AnimatePresence>
          {openThreats.map((threat) => (
            <DraggableThreatWindow 
              key={threat.id} 
              threat={threat}
              mapBoundsRef={mapContainerRef}
              isActive={activeWindowId === threat.id}
              onClose={() => setOpenThreats(prev => prev.filter(t => t.id !== threat.id))}
              onFocus={() => setActiveWindowId(threat.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Threat Feed Console */}
      <div className="bg-black/30 p-4 border-t-2 border-blue-400/20">
        <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-3">Threat Feed Console</h3>
        <div className="h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {threats.map((threat, index) => (
            <div key={threat.id} onClick={() => handleThreatClick(threat)}
              className={`threat-item grid grid-cols-12 gap-2 items-center p-2 rounded-md bg-white/5 border-l-4 transition-all duration-300 cursor-pointer hover:bg-white/10`}
              style={{
                '--severity-color': 
                  threat.severity === 'critical' ? '#ef4444' :
                  threat.severity === 'high' ? '#f97316' :
                  threat.severity === 'medium' ? '#eab308' : '#10b981',
                'animationDelay': `${Math.min(index * 50, 500)}ms`,
                borderColor: 'var(--severity-color)'
              } as React.CSSProperties}
            >
              {/* Icon */}
              <div className="col-span-1 flex items-center justify-center">
                <div className={`w-7 h-7 flex items-center justify-center rounded-full bg-opacity-10`} style={{backgroundColor: 'var(--severity-color)', color: 'var(--severity-color)'}}>
                  {getThreatIcon(threat.type)}
                </div>
              </div>
              
              {/* Details */}
              <div className="col-span-7">
                <p className="font-bold text-white capitalize text-sm">{threat.type}</p>
                <p className="text-xs text-gray-400 truncate">
                  <span className="font-mono">{threat.source.location}</span>
                  <span className="mx-1 text-blue-400 font-sans">&rarr;</span>
                  <span className="font-mono">{threat.target.location}</span>
                </p>
              </div>

              {/* Timestamp & Severity */}
              <div className="col-span-4 text-right">
                <p className={`text-xs font-bold uppercase`} style={{color: 'var(--severity-color)'}}>{threat.severity}</p>
                <p className="font-mono text-xs text-gray-500">{new Date(threat.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .holo-container { animation: holo-fade-in 0.5s ease-out; }
        @keyframes holo-fade-in { from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        .holo-scanlines { background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(59,130,246,0.2) 2px, rgba(0,0,0,0) 4px); background-size: 100% 4px; animation: scanlines 10s linear infinite; }
        @keyframes scanlines { from { background-position: 0 0; } to { background-position: 0 40px; } }
        .holo-corners { animation: corner-glow 3s infinite alternate; }
        @keyframes corner-glow { from { border-color: rgba(59, 130, 246, 0.4); } to { border-color: rgba(129, 236, 236, 0.8); } }
        .holo-text { text-shadow: 0 0 2px rgba(129, 236, 236, 0.5), 0 0 5px rgba(59, 130, 246, 0.3); animation: text-flicker 15s linear infinite; }
        @keyframes text-flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.95; } 50.1% { opacity: 1; } 75% { opacity: 0.98; } }
        
        .threat-item { animation: feed-item-in 0.4s ease-out forwards; opacity: 0; }
        @keyframes feed-item-in { from { opacity: 0; transform: translateX(-15px); } to { opacity: 1; transform: translateX(0); } }
        .threat-item:hover { box-shadow: inset 0 0 15px -5px var(--severity-color); border-color: var(--severity-color) !important; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(59, 130, 246, 0.4); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(59, 130, 246, 0.6); }

        .holo-window { user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }
      `}</style>
    </div>
  );
};

// New Draggable Window Component
const DraggableThreatWindow: React.FC<{
  threat: Threat;
  mapBoundsRef: React.RefObject<HTMLDivElement>;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
}> = ({ threat, mapBoundsRef, isActive, onClose, onFocus }) => {
  const dragControls = useDragControls();

  const getIcon = (type: Threat['type']) => {
    switch (type) {
      case 'HTTP Exploit': return <Zap className="w-5 h-5" />;
      case 'MySQL BruteForce': return <ShieldAlert className="w-5 h-5" />;
      case 'Telnet BruteForce': return <Bug className="w-5 h-5" />;
      case 'SSH BruteForce': return <ShieldCheck className="w-5 h-5" />;
    }
  };

  const severityClass = 
    threat.severity === 'critical' ? 'text-red-400' :
    threat.severity === 'high' ? 'text-orange-400' :
    threat.severity === 'medium' ? 'text-yellow-400' : 'text-green-400';

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={mapBoundsRef}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.8, y: -50 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        zIndex: isActive ? 100 : threat.id % 10 // Bring active window to front
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute top-1/4 left-1/4 w-[400px] z-20"
      style={{'--severity-color': `var(--${threat.severity})`} as React.CSSProperties}
    >
      <div className="holo-window p-4 bg-black/50 border border-blue-400/30 backdrop-blur-lg rounded-lg text-white relative overflow-hidden shadow-2xl shadow-black/50">
        {/* Hologram effects */}
        <div className="absolute inset-0 holo-scanlines pointer-events-none"></div>

        <div className="flex justify-between items-start mb-3">
          <div 
            onPointerDown={(e) => dragControls.start(e)}
            className="flex-grow flex items-center space-x-3 cursor-grab"
          >
            <div className={`p-2 rounded-full bg-opacity-20 ${severityClass.replace('text-', 'bg-')}`}>
              {getIcon(threat.type)}
            </div>
            <div>
              <h3 className="font-bold text-lg capitalize holo-text">{threat.type}</h3>
              <p className={`text-sm font-semibold uppercase ${severityClass} holo-text`}>{threat.severity} Severity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors z-30 flex-shrink-0">&times;</button>
        </div>

        <div className="space-y-2 text-sm pb-4">
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-gray-400">Source:</span>
            <span className="font-mono text-blue-300">{threat.source.location}</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-gray-400">Target:</span>
            <span className="font-mono text-blue-300">{threat.target.location}</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-gray-400">Timestamp:</span>
            <span className="font-mono">{new Date(threat.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-blue-400/30 font-mono">ID: {threat.id}</div>
      </div>
    </motion.div>
  );
}


export default ThreatMap;