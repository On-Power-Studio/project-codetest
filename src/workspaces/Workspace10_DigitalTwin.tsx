import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  AlertTriangle, Compass, Sliders, Map, RefreshCw, 
  ZoomIn, Maximize, Play, Settings, Layers, Eye
} from 'lucide-react';

interface Skyscraper {
  dx: number;
  dy: number;
  w: number;
  h: number;
  grad: string;
  stroke: string;
}

export const Workspace10_DigitalTwin: React.FC = () => {
  const { twinLayers, twinPreset, setTwinPreset, toggleTwinLayer } = useAxiomStore();

  const activeTests = [
    { name: 'Payment Flow Test', pct: 95, time: '2m 30s' },
    { name: 'Order Processing Test', pct: 88, time: '1m 45s' },
    { name: 'User Authentication Test', pct: 92, time: '2m 15s' },
    { name: 'Inventory Update Test', pct: 85, time: '1m 30s' },
    { name: 'Notification Delivery Test', pct: 90, time: '2m 45s' }
  ];

  const systemEvents = [
    { time: '10:24:30', event: 'Traffic spike detected in Payment Service', type: 'High' },
    { time: '10:24:28', event: 'New service instance started: Order Service', type: 'Info' },
    { time: '10:24:25', event: 'Test suite completed: User Auth API', type: 'Info' },
    { time: '10:24:23', event: 'Risk score updated for User Auth API', type: 'High' },
    { time: '10:24:20', event: 'Database query performance degraded - Analytics DB', type: 'Warning' }
  ];

  // Coordinates mapping for absolute position callouts overlay
  const callouts = [
    { id: 'web', name: 'Web Experience Hub', label: '12 Pages | 156 Components', cover: '98.2% Coverage', x: '35%', y: '10%', col: '#3B82F6', layer: 'pages' },
    { id: 'portal', name: 'Customer Portal City', label: '24 Pages | 342 Components', cover: '96.1% Coverage', x: '62%', y: '8%', col: '#8B5CF6', layer: 'pages' },
    { id: 'orders', name: 'Order Management District', label: '18 Services | 24 APIs | 142 Components', cover: '97.3% Coverage', x: '42%', y: '33%', col: '#EF4444', layer: 'services' },
    { id: 'payments', name: 'Payment Processing City', label: '15 Services | 18 APIs | 86 Components', cover: '95.7% Coverage', x: '9%', y: '38%', col: '#3B82F6', layer: 'services' },
    { id: 'users', name: 'User Management Sector', label: '10 Services | 14 APIs | 72 Components', cover: '93.1% Coverage', x: '78%', y: '40%', col: '#06B6D4', layer: 'services' },
    { id: 'notifications', name: 'Notification Service Hub', label: '6 Services | 8 APIs | 48 Components', cover: '91.5% Coverage', x: '72%', y: '68%', col: '#10B981', layer: 'services' },
    { id: 'analytics', name: 'Analytics & Reporting Hub', label: '8 Services | 12 APIs | 64 Components', cover: '92.8% Coverage', x: '42%', y: '74%', col: '#F59E0B', layer: 'services' },
    { id: 'inventory', name: 'Inventory Management Zone', label: '12 Services | 16 APIs | 78 Components', cover: '94.2% Coverage', x: '16%', y: '64%', col: '#10B981', layer: 'services' }
  ];

  // Dynamic skyscraper builders helper
  const makeSkyscrapers = (x: number, y: number, color: string, grad: string): Skyscraper[] => {
    return [
      { dx: x - 25, dy: y - 30, w: 8, h: 25, grad, stroke: color },
      { dx: x - 15, dy: y - 45, w: 10, h: 40, grad, stroke: color },
      { dx: x, dy: y - 55, w: 12, h: 50, grad, stroke: color },
      { dx: x + 15, dy: y - 35, w: 8, h: 30, grad, stroke: color },
      { dx: x + 25, dy: y - 20, w: 6, h: 15, grad, stroke: color }
    ];
  };

  return (
    <div className="flex-1 bg-bg-primary p-4 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none relative">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        
        {/* Top Header Row */}
        <div className="flex justify-between items-center border-b border-border-color pb-3 shrink-0">
          {/* System Health */}
          <div className="flex items-center space-x-4 bg-surface/20 p-2.5 rounded-xl border border-border-color/60">
            <div className="h-12 w-12 rounded-full border-4 border-success flex items-center justify-center shrink-0">
              <span className="text-[11px] font-black text-text-primary font-mono">98.7%</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9.5px] font-sans">
              <div className="flex justify-between space-x-2"><span className="text-text-secondary">Performance:</span><span className="text-success font-bold font-mono">96.2%</span></div>
              <div className="flex justify-between space-x-2"><span className="text-text-secondary">Reliability:</span><span className="text-success font-bold font-mono">99.1%</span></div>
              <div className="flex justify-between space-x-2"><span className="text-text-secondary">Security:</span><span className="text-success font-bold font-mono">97.8%</span></div>
              <div className="flex justify-between space-x-2"><span className="text-text-secondary">Test Coverage:</span><span className="text-success font-bold font-mono">94.3%</span></div>
            </div>
          </div>

          {/* District Preset Title */}
          <div className="text-center">
            <h2 className="text-base font-bold text-text-primary uppercase tracking-wide">Digital Twin Workspace</h2>
            <span className="text-[10px] text-text-secondary block">Interactive architectural topology map. Preset: <strong className="text-primary-purple uppercase">{twinPreset}</strong></span>
          </div>

          {/* Live Traffic */}
          <div className="flex items-center space-x-4 bg-surface/20 p-2.5 rounded-xl border border-border-color/60 text-[9.5px]">
            <div className="space-y-1 pr-3 border-r border-border-color/30 font-mono text-right">
              <div>RPS: <span className="text-text-primary font-bold">12,847</span></div>
              <div>DATA: <span className="text-primary-purple font-bold">2.4 GB/s</span></div>
              <div>CONN: <span className="text-text-primary font-bold">1,429</span></div>
            </div>
            <div className="w-20 h-8 flex items-end justify-between border-b border-border-color/40 relative">
              <div className="w-[15%] bg-secondary-blue h-[60%] rounded-t" />
              <div className="w-[15%] bg-secondary-blue h-[40%] rounded-t" />
              <div className="w-[15%] bg-secondary-blue h-[70%] rounded-t" />
              <div className="w-[15%] bg-secondary-blue h-[90%] rounded-t animate-pulse" />
              <div className="w-[15%] bg-secondary-blue h-[50%] rounded-t" />
              <span className="absolute inset-0 flex items-center justify-center text-[7px] text-text-secondary uppercase">Traffic</span>
            </div>
          </div>
        </div>

        {/* Central visual cyber ecosystem motherboard map */}
        <div className="flex-1 bg-bg-secondary/40 border border-border-color rounded-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* SVG board rendering */}
            <svg viewBox="0 0 900 420" className="w-full h-full">
              <defs>
                {/* Glow filters */}
                <filter id="twin-glow-purple" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="twin-glow-blue" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="twin-glow-red" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="twin-glow-green" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="twin-glow-orange" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Building gradients */}
                <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-purple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-red" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#064E3B" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-orange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#78350F" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#083344" stopOpacity="0.2" />
                </linearGradient>

                {/* Motherboard grid pattern */}
                <pattern id="pcb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="none" />
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.05)" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#pcb-grid)" />

              {/* Motherboard Trace Paths */}
              {twinLayers.apis && (
                <g strokeWidth="1.5" fill="none" opacity="0.6">
                  {/* Cyber board lanes */}
                  <path d="M 180 150 L 320 150 L 400 90 L 540 220" stroke="#3B82F6" strokeDasharray="1 3" />
                  <path d="M 380 90 L 480 90 L 540 220" stroke="#06B6D4" />
                  <path d="M 640 110 L 590 110 L 540 220" stroke="#8B5CF6" />
                  <path d="M 540 220 L 780 220" stroke="#3B82F6" />
                  <path d="M 540 220 L 680 310" stroke="#10B981" strokeDasharray="3 3" />
                  <path d="M 540 220 L 440 340" stroke="#F59E0B" />
                  <path d="M 280 320 L 180 150" stroke="#10B981" />

                  {/* Flow dots */}
                  <circle r="3" fill="#3B82F6" filter="url(#twin-glow-blue)">
                    <animateMotion dur="5s" repeatCount="indefinite" path="M 180 150 L 320 150 L 400 90 L 540 220" />
                  </circle>
                  <circle r="2.5" fill="#8B5CF6" filter="url(#twin-glow-purple)">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 640 110 L 590 110 L 540 220" />
                  </circle>
                  <circle r="3" fill="#EF4444" filter="url(#twin-glow-red)">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 540 220 L 440 340" />
                  </circle>
                </g>
              )}

              {/* Render Database Power Plants (Reactor Towers) in Left-Top next to Payment Processing */}
              {twinLayers.databases && (
                <g transform="translate(140, 80)" filter="url(#twin-glow-orange)">
                  {/* Tower 1 */}
                  <path d="M 10 40 C 15 25, 15 10, 10 0 L 25 0 C 20 10, 20 25, 25 40 Z" fill="url(#grad-orange)" stroke="#F59E0B" strokeWidth="1" />
                  <ellipse cx="17.5" cy="0" rx="7.5" ry="2" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
                  <ellipse cx="17.5" cy="40" rx="7.5" ry="2.5" fill="#F59E0B" opacity="0.3" />

                  {/* Tower 2 */}
                  <path d="M 40 40 C 45 25, 45 10, 40 0 L 55 0 C 50 10, 50 25, 55 40 Z" fill="url(#grad-orange)" stroke="#F59E0B" strokeWidth="1" transform="translate(15, 5)" />
                  <ellipse cx="65" cy="5" rx="7.5" ry="2" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />

                  {/* Tower 3 */}
                  <path d="M 70 40 C 75 25, 75 10, 70 0 L 85 0 C 80 10, 80 25, 85 40 Z" fill="url(#grad-orange)" stroke="#F59E0B" strokeWidth="1" transform="translate(30, 0)" />
                  <ellipse cx="107.5" cy="0" rx="7.5" ry="2" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
                </g>
              )}

              {/* Render District Skyscraper Clusters */}
              {twinLayers.components && (
                <>
                  {/* Web Experience (Blue) */}
                  <g filter="url(#twin-glow-blue)">
                    {makeSkyscrapers(380, 90, '#3B82F6', 'url(#grad-blue)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy} width={b.w} height={b.h} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                  </g>

                  {/* Customer Portal (Purple) */}
                  <g filter="url(#twin-glow-purple)">
                    {makeSkyscrapers(640, 110, '#8B5CF6', 'url(#grad-purple)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy} width={b.w} height={b.h} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                  </g>

                  {/* Order Management (Red - Central Big Cluster!) */}
                  <g filter="url(#twin-glow-red)">
                    {makeSkyscrapers(540, 220, '#EF4444', 'url(#grad-red)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy - 10} width={b.w + 2} height={b.h + 15} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                    {/* Extra center skyscrapers */}
                    <rect x="532" y="145" width="16" height="65" fill="url(#grad-red)" stroke="#EF4444" strokeWidth="1" />
                  </g>

                  {/* Payment Processing (Cyan/Blue) */}
                  <g filter="url(#twin-glow-cyan)">
                    {makeSkyscrapers(180, 150, '#06B6D4', 'url(#grad-cyan)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy} width={b.w} height={b.h} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                  </g>

                  {/* User Management (Teal/Blue) */}
                  <g filter="url(#twin-glow-blue)">
                    {makeSkyscrapers(780, 220, '#3B82F6', 'url(#grad-blue)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy} width={b.w} height={b.h} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                  </g>

                  {/* Notification (Green) */}
                  <g filter="url(#twin-glow-green)">
                    {makeSkyscrapers(680, 310, '#10B981', 'url(#grad-green)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy} width={b.w} height={b.h} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                  </g>

                  {/* Analytics (Orange) */}
                  <g filter="url(#twin-glow-orange)">
                    {makeSkyscrapers(440, 340, '#F59E0B', 'url(#grad-orange)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy} width={b.w} height={b.h} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                  </g>

                  {/* Inventory (Green) */}
                  <g filter="url(#twin-glow-green)">
                    {makeSkyscrapers(280, 320, '#10B981', 'url(#grad-green)').map((b, i) => (
                      <rect key={i} x={b.dx} y={b.dy} width={b.w} height={b.h} fill={b.grad} stroke={b.stroke} strokeWidth="0.5" />
                    ))}
                  </g>
                </>
              )}

              {/* Critical warning hotspot marker */}
              {twinLayers.risks && (
                <g transform="translate(320, 230)" filter="url(#twin-glow-red)">
                  <circle r="18" fill="rgba(239, 68, 68, 0.15)" stroke="#EF4444" strokeWidth="1" className="animate-ping" />
                  <polygon points="0,-10 -10,8 10,8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="0" y="5" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>
                </g>
              )}
            </svg>

          </div>

          {/* Absolute floating Glassmorphism callouts overlays */}
          {callouts.map(call => {
            const isVisible = 
              (call.layer === 'pages' && twinLayers.pages) ||
              (call.layer === 'services' && twinLayers.services) ||
              (call.layer === 'databases' && twinLayers.databases) ||
              call.layer === 'services';

            if (!isVisible) return null;

            return (
              <div 
                key={call.id} 
                className="absolute bg-surface/85 backdrop-blur border rounded-lg p-2.5 shadow-2xl flex flex-col text-[10px] text-text-primary z-30 min-w-[150px] transition-all hover:scale-102"
                style={{ 
                  left: call.x, 
                  top: call.y, 
                  borderColor: call.col,
                  boxShadow: `0 0 10px ${call.col}20` 
                }}
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-text-primary truncate max-w-[120px]">{call.name}</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                </div>
                <span className="text-[8px] text-text-secondary uppercase tracking-widest font-mono font-bold block">{call.label}</span>
                {twinLayers.coverage && (
                  <span className="text-[8px] text-text-secondary font-mono mt-1 border-t border-border-color/10 pt-1 flex justify-between">
                    <span>Coverage</span>
                    <span className="font-bold" style={{ color: call.col }}>{call.cover}</span>
                  </span>
                )}
              </div>
            );
          })}

          {/* Pill controls dashboard panel at the bottom center */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur border border-border-color px-4 py-1.5 rounded-full flex items-center space-x-4 z-40 shadow-2xl">
            <button className="p-1 hover:bg-bg-primary rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Zoom In"><ZoomIn className="h-4 w-4" /></button>
            <button className="p-1 hover:bg-bg-primary rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Recenter Map"><Maximize className="h-4 w-4" /></button>
            <button className="p-1 hover:bg-bg-primary rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Filter View"><Sliders className="h-4 w-4" /></button>
            <button className="p-1 hover:bg-bg-primary rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Toggle Layer Controls"><Layers className="h-4 w-4" /></button>
            <button className="p-1 hover:bg-bg-primary rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Operational Mode"><Compass className="h-4 w-4" /></button>
          </div>

          {/* Controls legend bottom */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-border-color bg-surface/20 shrink-0 text-[10px] text-text-secondary select-none z-30">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-secondary-blue" /><span>Pages (Cities)</span></span>
              <span className="flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-primary-purple" /><span>Components (Buildings)</span></span>
              <span className="flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-danger" /><span>APIs (Paths)</span></span>
              <span className="flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-success" /><span>Databases (Power)</span></span>
            </div>
            <div className="flex items-center space-x-1">
              <Map className="h-3.5 w-3.5 text-primary-purple mr-1" />
              <span>Motherboard Ecosystem Map (JARVIS Interface Mode)</span>
            </div>
          </div>
        </div>

        {/* Bottom Details diagnostic row */}
        <div className="grid grid-cols-12 gap-4 shrink-0 select-none">
          
          {/* Dependency force diagram thumbnail (Width 3/12) */}
          <div className="col-span-3 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Dependency Paths</span>
            <div className="flex-1 relative flex items-center justify-center min-h-[90px]">
              <div className="absolute h-8 w-8 rounded-full bg-primary-purple/20 border border-primary-purple" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-success -translate-x-6 -translate-y-4" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-success translate-x-6 -translate-y-4" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-danger translate-x-6 translate-y-4" />
              <div className="absolute h-1.5 w-1.5 rounded-full bg-warning -translate-x-6 translate-y-4" />
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20">
                <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="white" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Active tests execution (Width 5/12) */}
          <div className="col-span-5 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Active Tests</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2">
              {activeTests.map(test => (
                <div key={test.name} className="flex justify-between items-center text-[10.5px]">
                  <div className="flex items-center space-x-2 truncate">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shrink-0" />
                    <span className="text-text-primary font-medium truncate">{test.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-text-secondary font-mono">
                    <span>{test.pct}% passed</span>
                    <span>{test.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Events (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">System Events</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 font-mono text-[9px] text-text-secondary leading-normal">
              {systemEvents.map((ev, idx) => (
                <div key={idx} className="flex justify-between border-b border-border-color/10 pb-1.5 leading-snug">
                  <div className="flex space-x-2">
                    <span className="text-text-secondary shrink-0">{ev.time}</span>
                    <span className="text-text-primary">{ev.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
