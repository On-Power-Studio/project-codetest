import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Eye, AlertTriangle, Cpu, Radio, Network, Server, Play } from 'lucide-react';

export const Workspace8_ImpactAnalysis: React.FC = () => {
  const { modifiedCodePath } = useAxiomStore();

  const paths = [
    { flow: 'POST /api/orders → OrderService → PaymentService → payments', score: '9.8', col: 'text-red-400' },
    { flow: 'POST /api/orders → Checkout → OrderSummary → OrderService', score: '9.2', col: 'text-red-400' },
    { flow: 'POST /api/orders → InventoryService → inventory → order_items', score: '8.9', col: 'text-yellow-400' },
    { flow: 'POST /api/orders → PricingService → OrderForm → /checkout', score: '7.8', col: 'text-yellow-400' },
    { flow: 'POST /api/orders → NotificationService → emails → users', score: '6.9', col: 'text-slate-400' }
  ];

  const timeline = [
    { time: '10:24:31', event: 'Change detected in POST /api/orders', diff: '31s ago' },
    { time: '10:24:32', event: 'Analyzing dependencies', diff: '30s ago' },
    { time: '10:24:35', event: 'Building impact graph', diff: '26s ago' },
    { time: '10:24:41', event: 'Calculating risk scores', diff: '20s ago' },
    { time: '10:24:47', event: 'AI analysis complete', diff: '14s ago' },
    { time: '10:24:51', event: 'Impact analysis ready', diff: '10s ago' }
  ];

  return (
    <div className="flex-1 bg-[#02050b] p-4 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none relative">
      {/* Scanline pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      <div className="space-y-4 flex-1 flex flex-col min-h-0 z-20">
        {/* Header */}
        <div className="border-b border-cyan-500/20 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Network size={20} className="text-cyan-400" /> Impact Analysis
            </h2>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mt-0.5">Ripple simulation mapping changes to UI components, database rows, & test scopes.</span>
          </div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          
          {/* Left Column (Width 3/12) */}
          <div className="col-span-3 space-y-4">
            
            {/* Change Detected Card */}
            <div className="bg-[#050b18]/85 border border-cyan-500/20 rounded-lg p-3 text-xs shadow-[0_0_15px_rgba(6,182,212,0.02)]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">Change Detected</span>
              <div className="bg-[#020409] border border-cyan-500/10 p-2.5 rounded mb-3">
                <div className="flex justify-between items-center"><span className="text-green-400 font-bold font-mono text-[9px] uppercase">API_MODIFIED</span><span className="text-slate-500 text-[9px]">31s ago</span></div>
                <div className="text-white font-mono font-bold mt-1 text-[11px]">POST /api/orders</div>
                <div className="text-slate-500 text-[8.5px] font-mono mt-0.5 truncate">{modifiedCodePath}</div>
              </div>
              <div className="space-y-1.5 font-mono text-[9.5px] text-slate-300">
                <div className="flex justify-between"><span>TYPE:</span><span className="text-cyan-400">API Endpoint</span></div>
                <div className="flex justify-between"><span>SCOPE:</span><span className="text-red-400 font-bold">CRITICAL_HIGH</span></div>
                <div className="flex justify-between"><span>LINES:</span><span className="text-green-400 font-bold font-mono">+24 -8</span></div>
              </div>
              <button className="w-full text-center bg-[#050b18] hover:bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono uppercase tracking-wider text-cyan-400 py-1.5 px-2.5 rounded mt-3.5 flex items-center justify-center space-x-1.5 cursor-pointer">
                <Eye className="h-3.5 w-3.5" />
                <span>OPEN_DIFF_FILE</span>
              </button>
            </div>

            {/* Affected Summary Card */}
            <div className="bg-[#050b18]/85 border border-cyan-500/20 rounded-lg p-3 text-xs shadow-[0_0_15px_rgba(6,182,212,0.02)]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">Impact Matrix</span>
              <div className="space-y-1.5 font-mono text-[9.5px] text-slate-300">
                <div className="flex justify-between"><span>PAGES:</span><span className="text-white font-mono">156 <span className="text-red-400 font-bold text-[8.5px] ml-1">↑ 23</span></span></div>
                <div className="flex justify-between"><span>COMPONENTS:</span><span className="text-white font-mono">342 <span className="text-red-400 font-bold text-[8.5px] ml-1">↑ 45</span></span></div>
                <div className="flex justify-between"><span>SERVICES:</span><span className="text-white font-mono">28 <span className="text-red-400 font-bold text-[8.5px] ml-1">↑ 8</span></span></div>
                <div className="flex justify-between"><span>DATABASE:</span><span className="text-white font-mono">42 <span className="text-red-400 font-bold text-[8.5px] ml-1">↑ 12</span></span></div>
                <div className="flex justify-between"><span>TEST_SUITES:</span><span className="text-white font-mono">312 <span className="text-red-400 font-bold text-[8.5px] ml-1">↑ 67</span></span></div>
                <div className="h-px bg-cyan-500/10 my-1.5" />
                <div className="flex justify-between font-bold text-cyan-400"><span>TOTAL_NODES:</span><span className="text-red-400 font-mono">4,782</span></div>
              </div>
            </div>

            {/* Risk matrix Card */}
            <div className="bg-[#050b18]/85 border border-cyan-500/20 rounded-lg p-3 text-xs shadow-[0_0_15px_rgba(6,182,212,0.02)]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">Risk Target Scope</span>
              <div className="grid grid-cols-4 gap-1 mt-2 text-center text-[8.5px] font-bold font-mono relative h-14">
                <div className="bg-red-500/10 border border-red-500/30 rounded flex items-center justify-center text-red-400">CRIT</div>
                <div className="bg-red-500/5 border border-red-500/20 rounded flex items-center justify-center text-red-400">HIGH</div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded flex items-center justify-center text-yellow-400">MED</div>
                <div className="bg-green-500/5 border border-green-500/20 rounded flex items-center justify-center text-green-400">LOW</div>

                {/* Target icon on High */}
                <div className="absolute top-[20%] left-[35%] bg-red-500 h-3 w-3 rounded-full border border-white animate-ping" />
                <div className="absolute top-[22%] left-[37%] bg-red-500 h-2 w-2 rounded-full border border-white" />
              </div>
            </div>

          </div>

          {/* Right Column (Width 9/12) */}
          <div className="col-span-9 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3.5 flex flex-col justify-between min-h-[400px] shadow-[0_0_20px_rgba(6,182,212,0.03)]">
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-cyan-500/10">
              <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest">Impact Dependency Flow</span>
              <div className="flex items-center space-x-4 font-mono text-[9px] text-slate-400">
                <div>TOTAL: <span className="text-white font-bold">4,782</span></div>
                <div>DIRECT: <span className="text-cyan-400 font-bold">1,246</span></div>
                <div>INDIRECT: <span className="text-purple-400 font-bold">3,536</span></div>
              </div>
            </div>

            {/* Simulated Horizontal Columns Network */}
            <div className="flex-1 relative flex items-center justify-between px-3 text-[10px] space-x-6 min-h-[260px]">
              
              {/* Column 1: Pages */}
              <div className="flex-1 space-y-2.5 z-20">
                <span className="text-[8px] font-bold font-mono text-cyan-500/50 block mb-1 text-center tracking-wider uppercase">[01] UI_PAGES</span>
                {['/checkout', '/cart', '/orders', '/order-confirmation'].map(n => (
                  <div key={n} className="bg-[#050b18]/90 border border-cyan-500/20 rounded-sm px-2.5 py-1.5 text-center font-mono truncate text-[9.5px] text-slate-300 hover:border-cyan-500 transition-all cursor-pointer">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 2: Components */}
              <div className="flex-1 space-y-2.5 z-20">
                <span className="text-[8px] font-bold font-mono text-cyan-500/50 block mb-1 text-center tracking-wider uppercase">[02] COMPONENTS</span>
                {['OrderForm', 'OrderSummary', 'PaymentMethod', 'AddressForm'].map(n => (
                  <div key={n} className="bg-[#050b18]/90 border border-cyan-500/20 rounded-sm px-2.5 py-1.5 text-center font-mono truncate text-[9.5px] text-slate-300 hover:border-cyan-500 transition-all cursor-pointer">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 3: Services */}
              <div className="flex-1 space-y-2.5 z-20">
                <span className="text-[8px] font-bold font-mono text-cyan-500/50 block mb-1 text-center tracking-wider uppercase">[03] SERVICES</span>
                {['OrderService', 'PaymentService', 'InventoryService', 'NotificationService'].map(n => (
                  <div key={n} className="bg-[#050b18] border border-cyan-500/40 rounded-sm px-2.5 py-1.5 text-center font-mono truncate text-[9.5px] text-cyan-400 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.15)] hover:border-cyan-500 transition-all cursor-pointer">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 4: Databases */}
              <div className="flex-1 space-y-2.5 z-20">
                <span className="text-[8px] font-bold font-mono text-cyan-500/50 block mb-1 text-center tracking-wider uppercase">[04] DATABASES</span>
                {['orders', 'order_items', 'payments', 'inventory'].map(n => (
                  <div key={n} className="bg-[#050b18] border border-red-500/40 rounded-sm px-2.5 py-1.5 text-center font-mono truncate text-[9.5px] text-red-400 hover:border-red-500 transition-all cursor-pointer">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 5: Tests */}
              <div className="flex-1 space-y-2.5 z-20">
                <span className="text-[8px] font-bold font-mono text-cyan-500/50 block mb-1 text-center tracking-wider uppercase">[05] TEST_SUITES</span>
                {['order.api.spec.ts', 'order.service.spec.ts', 'checkout.e2e.spec.ts', 'payment.spec.ts'].map(n => (
                  <div key={n} className="bg-[#050b18]/90 border border-cyan-500/20 rounded-sm px-2.5 py-1.5 text-center font-mono truncate text-[9.5px] text-slate-400 hover:border-cyan-500 transition-all cursor-pointer">
                    {n}
                  </div>
                ))}
              </div>

              {/* Dotted paths SVG overlay */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-40">
                <path d="M 120 70 C 180 70, 200 120, 260 120 M 260 120 C 320 120, 340 90, 400 90 M 400 90 C 460 90, 480 150, 540 150" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3" />
                <path d="M 120 120 C 180 120, 200 70, 260 70 M 260 70 C 320 70, 340 180, 400 180 M 400 180 C 460 180, 480 70, 540 70" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-4 min-h-0 select-none">
          
          {/* Bottom Left: Dependency Paths (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10">Dependency Flow Score</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 text-[10px] font-mono leading-tight">
              {paths.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 hover:bg-cyan-500/5 px-1 rounded transition-all">
                  <span className="text-slate-400 truncate max-w-[200px]">{p.flow}</span>
                  <span className={`font-bold font-mono ml-2 shrink-0 ${p.col}`}>{p.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Middle: Timeline Logs (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10">Analysis Telemetry</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 font-mono text-[9.5px] text-slate-400 leading-normal">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div className="flex space-x-2">
                    <span className="text-cyan-500/50 shrink-0">{item.time}</span>
                    <span className="text-slate-200">{item.event}</span>
                  </div>
                  <span className="text-slate-500 shrink-0 font-medium">{item.diff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right: Top Risky Nodes (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10">High Risk Nodes</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 font-mono text-[10px]">
              {[
                { name: 'PaymentService', type: 'Service', risk: 9.8, col: 'text-red-400' },
                { name: 'payments', type: 'Table', risk: 9.6, col: 'text-red-400' },
                { name: 'OrderService', type: 'Service', risk: 9.2, col: 'text-red-400' },
                { name: 'checkout.e2e.spec.ts', type: 'Test', risk: 9.1, col: 'text-red-400' },
                { name: 'order.service.spec.ts', type: 'Test', risk: 8.9, col: 'text-yellow-400' }
              ].map(node => (
                <div key={node.name} className="flex justify-between items-center py-1 hover:bg-cyan-500/5 px-1 rounded transition-all">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-slate-100 font-bold truncate">{node.name}</span>
                    <span className="text-[7.5px] uppercase font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 rounded shrink-0 font-mono">{node.type}</span>
                  </div>
                  <span className={`font-bold font-mono ml-2 shrink-0 ${node.col}`}>{node.risk}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
