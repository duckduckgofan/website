import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Shield, MapPin, Server, AlertTriangle, Clock, CheckCircle, XCircle,
    Globe, Skull, CreditCard, CloudLightning, Key, Crosshair, Fish, PhoneOff, Share2,
    MessageSquareWarning, MailWarning, Bot, TerminalSquare, DatabaseZap, Scan, Code, Waypoints,
    ServerCog, AppWindow, Router
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, Sector } from 'recharts';

interface Report {
    reportedAt: string;
    comment: string;
    categories: number[];
    reporterId: number;
    reporterCountryCode: string;
    reporterCountryName: string;
}

interface ApiResult {
    ipAddress: string;
    location: string;
    country: string;
    countryCode: string;
    city: string;
    isp: string;
    abuseConfidenceScore: number;
    totalReports: number;
    numDistinctUsers: number;
    isWhitelisted: boolean | null;
    usageType: string;
    domain: string;
    hostnames: string[];
    lastReportedAt: string;
    reports: Report[];
    reportsThisWeek: { name: string; reports: number }[];
    // Remove scamalytics, add blacklists
    blacklists?: { [key: string]: string };
}

const ReportsChart = ({ data }: { data: { name: string; reports: number }[] }) => (
    <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.8)',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        color: '#fff'
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                />
                <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#6366f1' }}
                    activeDot={{ r: 8, stroke: '#4f46e5', strokeWidth: 2 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const RadialProgress = ({ score }: { score: number }) => {
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    let color = '#4ade80'; // green-400
    let riskLevel = 'Low';
    if (score >= 50) { color = '#facc15'; riskLevel = 'Medium'; }
    if (score >= 75) { color = '#fb923c'; riskLevel = 'High'; }
    if (score >= 90) { color = '#f87171'; riskLevel = 'Critical'; }

    return (
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
        >
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90"
            >
                {/* Glow effect */}
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle
                    className="text-gray-700/50"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <motion.circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    strokeLinecap="round"
                    style={{ strokeDashoffset: circumference, filter: 'url(#glow)' }}
                    animate={{ strokeDashoffset: offset, stroke: color }}
                    transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-bold" style={{ color }}>{score}%</span>
                <span className="text-md font-semibold uppercase tracking-wider" style={{ color }}>
                    {riskLevel} Risk
                </span>
            </div>
        </motion.div>
    );
};

const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20 px-6 mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50"
    >
        <div className="flex justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
                <Shield className="w-8 h-8 text-indigo-300" />
            </div>
        </div>
        <h3 className="mt-6 text-2xl font-semibold text-white">Threat Analysis Center</h3>
        <p className="mt-2 text-lg text-gray-400">
            Enter an IP address above to generate a detailed intelligence report.
        </p>
    </motion.div>
);

const ThreatAnalysis = () => {
    const [ip, setIp] = useState('');
    const [results, setResults] = useState<ApiResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;
        let particles: { x: number; y: number; radius: number; color: string; vx: number; vy: number; }[] = [];
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };
        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(Math.floor(window.innerWidth / 15), 80);
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 2 + 1;
                const colors = ['rgba(99, 102, 241, 0.5)', 'rgba(139, 92, 246, 0.5)', 'rgba(236, 72, 153, 0.5)'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const vx = (Math.random() - 0.5) * 0.4;
                const vy = (Math.random() - 0.5) * 0.4;
                particles.push({ x, y, radius, color, vx, vy });
            }
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            particles.forEach((p1, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(147, 51, 234, ${(120 - distance) / 600})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
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

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ip) {
            setError('Please enter an IP address.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResults(null);
        try {
            const response = await fetch(`/api/lookup/${ip}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch IP information.');
            }
            const data = await response.json();
            setResults(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch IP information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryName = (id: number): string => {
        const categories: { [key: number]: string } = {
            1: 'DNS Compromise', 2: 'DNS Poisoning', 3: 'Fraud Orders', 4: 'DDoS Attack',
            5: 'FTP Brute-Force', 6: 'Ping of Death', 7: 'Phishing', 8: 'Fraud VoIP',
            9: 'Open-Proxy', 10: 'Web Spam', 11: 'Email Spam', 12: 'Blog Spam',
            13: 'VPN IP', 14: 'Port Scan', 15: 'Hacking', 16: 'SQL Injection',
            17: 'Spoofing', 18: 'Brute-Force', 19: 'Bad Web Bot', 20: 'Exploited Host',
            21: 'Web App Attack', 22: 'SSH', 23: 'IoT Targeted'
        };
        return categories[id] || 'Unknown';
    };

    const getCategoryIcon = (id: number): React.ReactNode => {
        const icons: { [key: number]: React.ReactNode } = {
            1: <Globe size={16} />, 2: <Skull size={16} />, 3: <CreditCard size={16} />, 4: <CloudLightning size={16} />,
            5: <Key size={16} />, 6: <Crosshair size={16} />, 7: <Fish size={16} />, 8: <PhoneOff size={16} />,
            9: <Share2 size={16} />, 10: <MessageSquareWarning size={16} />, 11: <MailWarning size={16} />, 12: <MessageSquareWarning size={16} />,
            13: <Globe size={16} />, 14: <Scan size={16} />, 15: <Code size={16} />, 16: <DatabaseZap size={16} />,
            17: <Waypoints size={16} />, 18: <Key size={16} />, 19: <Bot size={16} />, 20: <ServerCog size={16} />,
            21: <AppWindow size={16} />, 22: <TerminalSquare size={16} />, 23: <Router size={16} />
        };
        return icons[id] || <AlertTriangle size={16} />;
    };

    const COLORS = [
        '#6366f1', '#f59e42', '#10b981', '#ef4444', '#fbbf24', '#3b82f6', '#a21caf', '#eab308', '#14b8a6', '#f472b6', '#64748b', '#84cc16', '#f43f5e', '#0ea5e9', '#f97316', '#22d3ee', '#a3e635', '#e11d48', '#7c3aed', '#facc15'
    ];

    // Pie chart: declutter by grouping small slices into "Other" and hiding labels for small slices
    const ReportsByCountryPanel = ({ reports }: { reports: Report[] }) => {
      if (!reports || reports.length === 0) return null;

      // Aggregate and process data
      const countryCounts = reports.reduce((acc, r) => {
        const country = r.reporterCountryName || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let data = Object.entries(countryCounts).map(([name, value]) => ({ name, value }));
      data.sort((a, b) => b.value - a.value);

      // Group all countries with <4% of total into "Other"
      const total = reports.length;
      const minPercent = 0.04; // 4%
      let main: { name: string; value: number }[] = [];
      let otherTotal = 0;
      data.forEach((d) => {
        if (d.value / total < minPercent) {
          otherTotal += d.value;
        } else {
          main.push(d);
        }
      });
      if (otherTotal > 0) {
        main.push({ name: 'Other', value: otherTotal });
      }
      // If still too many slices, only show top 5 + Other
      if (main.length > 6) {
        const top = main.slice(0, 5);
        const restTotal = main.slice(5).reduce((sum, d) => sum + d.value, 0);
        top.push({ name: 'Other', value: restTotal });
        main = top;
      }
      const processedData = main;

      return (
        <div className="bg-gray-800/80 border border-gray-700/40 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-indigo-200">Reports by Country</h3>
            <span className="text-xs px-2 py-1 bg-indigo-900/40 rounded text-indigo-100 font-semibold">Total: {total}</span>
          </div>
          <ul className="divide-y divide-gray-700/60">
            {processedData.map((entry, idx) => {
              const percentage = ((entry.value / total) * 100).toFixed(1);
              let countryCode = null;
              if (entry.name !== 'Other') {
                const found = reports.find(r => r.reporterCountryName === entry.name);
                countryCode = found?.reporterCountryCode;
              }
              return (
                <li key={entry.name} className="flex items-center py-2 gap-3">
                  {countryCode ? (
                    <img
                      src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
                      alt={countryCode}
                      className="w-6 h-4 rounded border border-gray-700/60 object-cover"
                    />
                  ) : (
                    <span className="w-6 h-4 flex items-center justify-center bg-gray-700/60 rounded text-xs text-gray-400">?</span>
                  )}
                  <span className="flex-1 text-gray-100 font-medium truncate">{entry.name}</span>
                  <span className="text-sm text-indigo-200 font-semibold w-10 text-right">{entry.value}</span>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-700/40 rounded h-2">
                      <div
                        className="h-2 rounded"
                        style={{
                          width: `${percentage}%`,
                          background: `#6366f1`,
                          opacity: 0.7
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">{percentage}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    };

    // Clean, modern details panel for Threat Assessment
    const ThreatDetailsPanel = ({ results }: { results: ApiResult }) => {
      return (
        <div className="bg-gray-800/80 border border-gray-700/40 rounded-xl p-5 shadow-md mt-4">
          <h4 className="text-base font-bold text-indigo-200 mb-3">Details</h4>
          <ul className="divide-y divide-gray-700/60">
            <li className="flex items-center py-2 gap-3">
              <span className="w-32 text-gray-400 font-medium">IP Address</span>
              <span className="text-green-400 font-mono">{results.ipAddress}</span>
            </li>
            <li className="flex items-center py-2 gap-3">
              <span className="w-32 text-gray-400 font-medium">Hostname</span>
              <span className="text-gray-100">{results.domain || 'N/A'}</span>
            </li>
            <li className="flex items-center py-2 gap-3">
              <span className="w-32 text-gray-400 font-medium">ISP</span>
              <span className="text-gray-100">{results.isp}</span>
            </li>
            <li className="flex items-center py-2 gap-3">
              <span className="w-32 text-gray-400 font-medium">Usage Type</span>
              <span className="text-gray-100">{results.usageType}</span>
            </li>
            <li className="flex items-center py-2 gap-3">
              <span className="w-32 text-gray-400 font-medium">Location</span>
              <span className="text-gray-100">{results.location}</span>
            </li>
            <li className="flex items-center py-2 gap-3">
              <span className="w-32 text-gray-400 font-medium">Country</span>
              <span className="text-gray-100">{results.country} ({results.countryCode})</span>
            </li>
            <li className="flex items-center py-2 gap-3">
              <span className="w-32 text-gray-400 font-medium">City</span>
              <span className="text-gray-100">{results.city || 'N/A'}</span>
            </li>
          </ul>
        </div>
      );
    };

    // Helper for Blacklist Check Panel to always show Spamhaus
    const getBlacklistRows = (blacklists?: { [key: string]: string }) => {
      const rows: { name: string; val: string }[] = [];
      // Always show Spamhaus
      if (blacklists && Object.prototype.hasOwnProperty.call(blacklists, 'Spamhaus')) {
        rows.push({ name: 'Spamhaus', val: blacklists['Spamhaus'] });
      } else {
        rows.push({ name: 'Spamhaus', val: 'Not Checked' });
      }
      // Add all other blacklists except Spamhaus
      if (blacklists) {
        Object.entries(blacklists).forEach(([name, val]) => {
          if (name !== 'Spamhaus') rows.push({ name, val });
        });
      }
      return rows;
    };

    // Pagination state for Recent Reports
    const [reportPage, setReportPage] = useState(1);
    const REPORTS_PER_PAGE = 20;
    const paginatedReports = results && results.reports
      ? results.reports.slice((reportPage - 1) * REPORTS_PER_PAGE, reportPage * REPORTS_PER_PAGE)
      : [];
    const totalPages = results && results.reports ? Math.ceil(results.reports.length / REPORTS_PER_PAGE) : 1;
    useEffect(() => {
      setReportPage(1); // Reset to first page when results change
    }, [results]);

    return (
        <div className="relative h-screen overflow-hidden bg-gray-900 text-white font-sans">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900 pointer-events-none"></div>
            
            <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto">
                    <header className="text-center mb-12 pt-16">
                        <div className="inline-block mb-4 py-1 px-3 rounded-full bg-indigo-900/50 backdrop-blur-sm">
                            <p className="text-sm text-indigo-300 font-medium">IP & Domain Reputation</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Threat Analysis Center
                        </h1>
                        <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                            Investigate IP addresses for malicious activity and get detailed reputation reports.
                        </p>
                    </header>

                    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 p-6 rounded-xl shadow-2xl shadow-black/20 mb-8">
                        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                placeholder="Enter IP address (e.g., 8.8.8.8)"
                                className="flex-grow bg-gray-900/70 text-white placeholder-gray-500 border border-gray-600/80 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 disabled:cursor-not-allowed text-white font-bold rounded-lg px-6 py-3 transition-all duration-300 transform hover:scale-105"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-5 w-5" />
                                        <span>Lookup IP</span>
                                    </>
                                )}
                            </button>
                        </form>
                        {error && <p className="text-red-400 mt-4 text-center sm:text-left">{error}</p>}
                    </div>

                    <AnimatePresence mode="wait">
                        {results ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            >
                                {/* Left Column */}
                                <div className="lg:col-span-1 space-y-6">
                                    <InfoCard icon={<AlertTriangle />} title="Threat Assessment">
                                        <div className="grid grid-cols-2 gap-x-6 items-center">
                                            <div className="flex justify-center">
                                               <RadialProgress score={results.abuseConfidenceScore} />
                                            </div>
                                            <div className="space-y-2">
                                                <StatItem label="Total Reports" value={results.totalReports.toString()} />
                                                <StatItem label="Distinct Users" value={results.numDistinctUsers.toString()} />
                                                <StatItem label="Is Whitelisted?" value={results.isWhitelisted ? 'Yes' : 'No'} icon={results.isWhitelisted ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />} />
                                                <StatItem label="Last Reported" value={new Date(results.lastReportedAt).toLocaleDateString()} />
                                            </div>
                                        </div>
                                        <div className="mt-4 border-t border-gray-700/50 pt-4">
                                            <h4 className="text-sm font-semibold text-gray-300 mb-2 text-center">Reports This Week</h4>
                                            <ReportsChart data={results.reportsThisWeek} />
                                        </div>
                                        <div className="mt-4 border-t border-gray-700/50 pt-4">
                                            <ThreatDetailsPanel results={results} />
                                        </div>
                                    </InfoCard>
                                </div>

                                {/* Right Column */}
                                <div className="lg:col-span-1">
                                    <InfoCard icon={<Server />} title={`Recent Reports (${results.reports.length})`}>
                                        <div className="max-h-[520px] overflow-y-auto pr-3 custom-scrollbar">
                                            <motion.div 
                                                className="space-y-4"
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    visible: {
                                                        opacity: 1,
                                                        transition: {
                                                            staggerChildren: 0.05
                                                        }
                                                    }
                                                }}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                {results.reports.length > 0 ? paginatedReports.map((report) => (
                                                    <motion.div
                                                        key={report.reportedAt + report.reporterId}
                                                        variants={{
                                                            hidden: { opacity: 0, y: 20 },
                                                            visible: { opacity: 1, y: 0 }
                                                        }}
                                                        className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/60"
                                                    >
                                                        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{new Date(report.reportedAt).toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span>From: {report.reporterCountryName}</span>
                                                                <img src={`https://flagcdn.com/${report.reporterCountryCode.toLowerCase()}.svg`} alt={report.reporterCountryCode} className="w-5 h-auto rounded-sm" />
                                                            </div>
                                                        </div>
                                                        <p className="font-mono text-gray-200 text-sm leading-relaxed mb-3 p-3 bg-black/30 rounded">
                                                            {report.comment}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {Array.isArray(report.categories) && report.categories.map(cat => (
                                                                <div key={cat} className="flex items-center gap-2 bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-xs">
                                                                    {getCategoryIcon(cat)}
                                                                    <span>{getCategoryName(cat)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )) : <p className="text-center text-gray-400 py-4">No abuse reports found for this IP address.</p>}
                                            </motion.div>
                                            {/* Pagination Controls */}
                                            {results.reports.length > REPORTS_PER_PAGE && (
                                                <div className="flex justify-center items-center gap-2 mt-4">
                                                    <button
                                                        className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                                                        onClick={() => setReportPage(p => Math.max(1, p - 1))}
                                                        disabled={reportPage === 1}
                                                    >Prev</button>
                                                    <span className="text-sm text-gray-300">Page {reportPage} of {totalPages}</span>
                                                    <button
                                                        className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                                                        onClick={() => setReportPage(p => Math.min(totalPages, p + 1))}
                                                        disabled={reportPage === totalPages}
                                                    >Next</button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-8">
                                            <ReportsByCountryPanel reports={results.reports} />
                                        </div>
                                    </InfoCard>
                                </div>
                            </motion.div>
                        ) : (
                           <EmptyState key="empty" />
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            <style>{`
                .info-card {
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .info-card:hover {
                    border-color: rgba(99, 102, 241, 0.4);
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-track { 
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(99, 102, 241, 0.3);
                    border-radius: 6px;
                    border: 3px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(99, 102, 241, 0.6);
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
                    background-color: rgba(99, 102, 241, 0.5);
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
};

const InfoCard: React.FC<{icon: React.ReactNode, title: string, children: React.ReactNode}> = ({icon, title, children}) => (
    <div className="info-card bg-gray-800/50 backdrop-blur-md border border-gray-700/50 p-6 rounded-xl shadow-lg h-full">
        <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
            <div className="w-8 h-8 mr-3 bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <span>{title}</span>
        </h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const DetailItem: React.FC<{label: string, value: string, valueClass?: string}> = ({label, value, valueClass = 'text-gray-300'}) => (
    <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-3 text-sm first:mt-0 first:pt-0 first:border-none">
        <span className="text-gray-400 flex-shrink-0 mr-4">{label}:</span>
        <span className={`text-right break-all ${valueClass}`}>{value}</span>
    </div>
);

const StatItem: React.FC<{label: string, value: string, icon?: React.ReactNode}> = ({ label, value, icon }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-gray-700/50">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center space-x-2">
            {icon}
            <span className="font-semibold text-white">{value}</span>
        </div>
    </div>
);

export default ThreatAnalysis; 