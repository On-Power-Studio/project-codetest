import React from 'react';
import { ShieldCheck, BarChart2, TrendingUp, AlertTriangle, Cpu, Radio, Activity } from 'lucide-react';

export const Workspace7_CoverageIntelligence: React.FC = () => {
  const metrics = [
    { label: 'Page Coverage', pct: 92, count: '22 / 24 pages', color: 'text-cyan-400 border-cyan-500/30 glow-cyan', colCode: '#06b6d4' },
    { label: 'Component Coverage', pct: 84, count: '542 / 642 comps', color: 'text-purple-400 border-purple-500/30 glow-purple', colCode: '#a855f7' },
    { label: 'API Coverage', pct: 81, count: '104 / 128 endpoints', color: 'text-cyan-400 border-cyan-500/30 glow-cyan', colCode: '#06b6d4' },
    { label: 'Service Coverage', pct: 78, count: '22 / 28 services', color: 'text-yellow-400 border-yellow-500/30 glow-yellow', colCode: '#eab308' },
    { label: 'Database Coverage', pct: 95, count: '26 / 28 tables', color: 'text-green-400 border-green-500/30 glow-green', colCode: '#22c55e' }
  ];

  return (
    <div className="flex-1 bg-[#02050b] p-6 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none relative">
      {/* Scanline pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      <div className="space-y-6 flex-1 flex flex-col z-20">
        {/* Header */}
        <div className="border-b border-cyan-500/20 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" /> Coverage Intelligence
            </h2>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mt-0.5">Code execution footprint, security validation gaps, & test densities.</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono bg-[#091122]/90 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] px-3 py-1 rounded text-cyan-400 font-bold">TOTAL_LINES_OF_CODE: 128,456</span>
          </div>
        </div>

        {/* Top Summary Row */}
        <div className="grid grid-cols-5 gap-4">
          {metrics.map(metric => (
            <div 
              key={metric.label} 
              className="bg-[#050b18]/85 border border-cyan-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(6,182,212,0.02)] relative overflow-hidden"
              style={{ borderLeft: `3px solid ${metric.colCode}` }}
            >
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mb-2 font-mono">{metric.label}</span>
              <div className="h-16 w-16 rounded-full border-2 flex items-center justify-center mb-2 shrink-0 relative" style={{ borderColor: `${metric.colCode}30` }}>
                <span className="text-base font-black font-mono text-white">{metric.pct}%</span>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin opacity-50" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{metric.count}</span>
            </div>
          ))}
        </div>

        {/* Main Grid: Treemap & Trends */}
        <div className="flex-1 grid grid-cols-12 gap-5 min-h-[300px]">
          
          {/* Left Column: Visual Coverage Treemap (Width 7/12) */}
          <div className="col-span-7 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-4 flex flex-col justify-between min-h-0 shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <div>
              <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-1">Package Coverage Treemap</span>
              <span className="text-[9.5px] text-slate-400">Heatmap representation of codebase modules. Red sectors represent high-risk execution gaps.</span>
            </div>

            {/* Treemap Grid Blocks */}
            <div className="flex-1 grid grid-cols-12 grid-rows-3 gap-2.5 mt-4 min-h-[220px]">
              <div className="col-span-6 row-span-2 bg-green-500/10 border border-green-500/30 rounded p-3 flex flex-col justify-between hover:bg-green-500/15 transition-all cursor-pointer">
                <span className="text-[11px] font-bold font-mono text-white">apps/web/components</span>
                <div className="text-right"><span className="text-lg font-black font-mono text-green-400">92%</span><span className="text-[8px] text-slate-400 block font-mono">42,128 LoC</span></div>
              </div>
              <div className="col-span-6 row-span-1 bg-cyan-500/10 border border-cyan-500/30 rounded p-3 flex flex-col justify-between hover:bg-cyan-500/15 transition-all cursor-pointer">
                <span className="text-[11px] font-bold font-mono text-white">apps/api/controllers</span>
                <div className="text-right"><span className="text-sm font-bold font-mono text-cyan-400">81%</span><span className="text-[8px] text-slate-400 block font-mono">24,156 LoC</span></div>
              </div>
              <div className="col-span-3 row-span-1 bg-yellow-500/10 border border-yellow-500/30 rounded p-3 flex flex-col justify-between hover:bg-yellow-500/15 transition-all cursor-pointer">
                <span className="text-[11px] font-bold font-mono text-white">apps/api/services</span>
                <div className="text-right"><span className="text-sm font-bold font-mono text-yellow-400">73%</span><span className="text-[8px] text-slate-400 block font-mono">18,230 LoC</span></div>
              </div>
              <div className="col-span-3 row-span-1 bg-red-500/10 border border-red-500/30 rounded p-3 flex flex-col justify-between hover:bg-red-500/15 transition-all cursor-pointer">
                <span className="text-[11px] font-bold font-mono text-white">libs/integrations</span>
                <div className="text-right"><span className="text-sm font-bold font-mono text-red-400">58%</span><span className="text-[8px] text-slate-400 block font-mono">12,115 LoC</span></div>
              </div>

              {/* Row 3 */}
              <div className="col-span-4 row-span-1 bg-green-500/15 border border-green-500/35 rounded p-3 flex flex-col justify-between hover:bg-green-500/20 transition-all cursor-pointer">
                <span className="text-[11px] font-bold font-mono text-white">libs/database</span>
                <div className="text-right"><span className="text-sm font-bold font-mono text-green-400">95%</span><span className="text-[8px] text-slate-400 block font-mono">14,352 LoC</span></div>
              </div>
              <div className="col-span-4 row-span-1 bg-cyan-500/10 border border-cyan-500/25 rounded p-3 flex flex-col justify-between hover:bg-cyan-500/15 transition-all cursor-pointer">
                <span className="text-[11px] font-bold font-mono text-white">apps/web/hooks</span>
                <div className="text-right"><span className="text-sm font-bold font-mono text-cyan-400">88%</span><span className="text-[8px] text-slate-400 block font-mono">11,280 LoC</span></div>
              </div>
              <div className="col-span-4 row-span-1 bg-slate-500/10 border border-slate-500/25 rounded p-3 flex flex-col justify-between hover:bg-slate-500/15 transition-all cursor-pointer">
                <span className="text-[11px] font-bold font-mono text-white">libs/utils</span>
                <div className="text-right"><span className="text-sm font-bold font-mono text-slate-300">68%</span><span className="text-[8px] text-slate-400 block font-mono">6,195 LoC</span></div>
              </div>
            </div>
          </div>

          {/* Right Column: Coverage Trends & Risk Profile (Width 5/12) */}
          <div className="col-span-5 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-4 flex flex-col justify-between min-h-0 shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <div>
              <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-1">Coverage Trends</span>
              <span className="text-[9.5px] text-slate-400">Build telemetry progress history (last 30 days).</span>
            </div>

            {/* Line chart widget */}
            <div className="flex-1 flex items-end justify-between px-4 mt-6 h-36 border-b border-cyan-500/20 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <TrendingUp className="h-24 w-24 text-cyan-400" />
              </div>
              <div className="w-[12%] bg-cyan-500/10 border border-cyan-500/30 h-[48%] rounded-t relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-cyan-400">48%</span>
              </div>
              <div className="w-[12%] bg-cyan-500/15 border border-cyan-500/30 h-[56%] rounded-t relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-cyan-400">56%</span>
              </div>
              <div className="w-[12%] bg-cyan-500/20 border border-cyan-500/40 h-[62%] rounded-t relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-cyan-400">62%</span>
              </div>
              <div className="w-[12%] bg-cyan-500/25 border border-cyan-500/40 h-[70%] rounded-t relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-cyan-400">70%</span>
              </div>
              <div className="w-[12%] bg-green-500/20 border border-green-500/40 h-[76%] rounded-t relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-green-400">76%</span>
              </div>
              <div className="w-[12%] bg-green-500/25 border border-green-500/45 h-[78.4%] rounded-t relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-green-400">78.4%</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded flex-1">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-wide">
                  <strong>CRITICAL_VULNERABILITY_GAP:</strong> 3 payment gateway handler services lack integration test blocks.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
