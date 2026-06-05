import React from 'react';
import { ShieldCheck, BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';

export const Workspace7_CoverageIntelligence: React.FC = () => {
  const metrics = [
    { label: 'Page Coverage', pct: 92, count: '22 / 24 pages', color: 'text-success border-success/30' },
    { label: 'Component Coverage', pct: 84, count: '542 / 642 comps', color: 'text-success border-success/30' },
    { label: 'API Coverage', pct: 81, count: '104 / 128 endpoints', color: 'text-secondary-blue border-secondary-blue/30' },
    { label: 'Service Coverage', pct: 78, count: '22 / 28 services', color: 'text-warning border-warning/30' },
    { label: 'Database Coverage', pct: 95, count: '26 / 28 tables', color: 'text-success border-success/30' }
  ];

  return (
    <div className="flex-1 bg-bg-primary p-6 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none">
      <div className="space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border-color pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide">Coverage Intelligence</h2>
            <span className="text-[11px] text-text-secondary">Analyze test coverage percentages, identify risk vulnerabilities, and track code test density.</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <span className="font-mono bg-surface border border-border-color px-2 py-0.5 rounded font-bold">Total LoC: 128,456</span>
          </div>
        </div>

        {/* Top Summary Row */}
        <div className="grid grid-cols-5 gap-4">
          {metrics.map(metric => (
            <div key={metric.label} className="bg-surface/30 border border-border-color rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] text-text-secondary block font-bold uppercase tracking-wider mb-2">{metric.label}</span>
              <div className={`h-16 w-16 rounded-full border-4 flex items-center justify-center mb-2 shrink-0 ${metric.color}`}>
                <span className="text-base font-black font-mono text-text-primary">{metric.pct}%</span>
              </div>
              <span className="text-[10px] text-text-secondary">{metric.count}</span>
            </div>
          ))}
        </div>

        {/* Main Grid: Treemap & Trends */}
        <div className="flex-1 grid grid-cols-12 gap-5 min-h-[300px]">
          
          {/* Left Column: Visual Coverage Treemap (Width 7/12) */}
          <div className="col-span-7 bg-surface/30 border border-border-color rounded-xl p-4 flex flex-col justify-between min-h-0">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Package Coverage Treemap</span>
              <span className="text-[9.5px] text-text-secondary">Sized by lines of code, colored by coverage percentage.</span>
            </div>

            {/* Treemap Grid Blocks */}
            <div className="flex-1 grid grid-cols-12 grid-rows-3 gap-2.5 mt-4 min-h-[220px]">
              <div className="col-span-6 row-span-2 bg-success/20 border border-success/35 rounded-lg p-3 flex flex-col justify-between hover:bg-success/25 transition-all cursor-pointer">
                <span className="text-[11px] font-bold text-text-primary">apps/web/components</span>
                <div className="text-right"><span className="text-lg font-black font-mono">92%</span><span className="text-[8px] text-text-secondary block">42,128 LoC</span></div>
              </div>
              <div className="col-span-6 row-span-1 bg-success/15 border border-success/30 rounded-lg p-3 flex flex-col justify-between hover:bg-success/20 transition-all cursor-pointer">
                <span className="text-[11px] font-bold text-text-primary">apps/api/controllers</span>
                <div className="text-right"><span className="text-sm font-bold font-mono">81%</span><span className="text-[8px] text-text-secondary block">24,156 LoC</span></div>
              </div>
              <div className="col-span-3 row-span-1 bg-warning/15 border border-warning/30 rounded-lg p-3 flex flex-col justify-between hover:bg-warning/20 transition-all cursor-pointer">
                <span className="text-[11px] font-bold text-text-primary">apps/api/services</span>
                <div className="text-right"><span className="text-sm font-bold font-mono">73%</span><span className="text-[8px] text-text-secondary block">18,230 LoC</span></div>
              </div>
              <div className="col-span-3 row-span-1 bg-danger/15 border border-danger/30 rounded-lg p-3 flex flex-col justify-between hover:bg-danger/20 transition-all cursor-pointer">
                <span className="text-[11px] font-bold text-text-primary">libs/integrations</span>
                <div className="text-right"><span className="text-sm font-bold font-mono">58%</span><span className="text-[8px] text-text-secondary block">12,115 LoC</span></div>
              </div>

              {/* Row 3 */}
              <div className="col-span-4 row-span-1 bg-success/25 border border-success/40 rounded-lg p-3 flex flex-col justify-between hover:bg-success/30 transition-all cursor-pointer">
                <span className="text-[11px] font-bold text-text-primary">libs/database</span>
                <div className="text-right"><span className="text-sm font-bold font-mono">95%</span><span className="text-[8px] text-text-secondary block">14,352 LoC</span></div>
              </div>
              <div className="col-span-4 row-span-1 bg-success/15 border border-success/30 rounded-lg p-3 flex flex-col justify-between hover:bg-success/20 transition-all cursor-pointer">
                <span className="text-[11px] font-bold text-text-primary">apps/web/hooks</span>
                <div className="text-right"><span className="text-sm font-bold font-mono">88%</span><span className="text-[8px] text-text-secondary block">11,280 LoC</span></div>
              </div>
              <div className="col-span-4 row-span-1 bg-warning/10 border border-warning/20 rounded-lg p-3 flex flex-col justify-between hover:bg-warning/15 transition-all cursor-pointer">
                <span className="text-[11px] font-bold text-text-primary">libs/utils</span>
                <div className="text-right"><span className="text-sm font-bold font-mono">68%</span><span className="text-[8px] text-text-secondary block">6,195 LoC</span></div>
              </div>
            </div>
          </div>

          {/* Right Column: Coverage Trends & Risk Profile (Width 5/12) */}
          <div className="col-span-5 bg-surface/30 border border-border-color rounded-xl p-4 flex flex-col justify-between min-h-0">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Coverage Trends</span>
              <span className="text-[9.5px] text-text-secondary">Validation build coverage progress history (last 30 days).</span>
            </div>

            {/* Line chart widget */}
            <div className="flex-1 flex items-end justify-between px-4 mt-6 h-36 border-b border-border-color/30 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <TrendingUp className="h-20 w-20 text-success" />
              </div>
              <div className="w-[12%] bg-primary-purple/10 border border-primary-purple/30 h-[48%] rounded-t relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-secondary">48%</span></div>
              <div className="w-[12%] bg-primary-purple/15 border border-primary-purple/40 h-[56%] rounded-t relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-secondary">56%</span></div>
              <div className="w-[12%] bg-primary-purple/20 border border-primary-purple/50 h-[62%] rounded-t relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-secondary">62%</span></div>
              <div className="w-[12%] bg-primary-purple/25 border border-primary-purple/60 h-[70%] rounded-t relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-secondary">70%</span></div>
              <div className="w-[12%] bg-success/20 border border-success/35 h-[76%] rounded-t relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-secondary">76%</span></div>
              <div className="w-[12%] bg-success/25 border border-success/40 h-[78.4%] rounded-t relative group"><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-secondary">78.4%</span></div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-border-color/30 flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center space-x-2 text-warning bg-warning/10 border border-warning/20 p-2.5 rounded-lg flex-1">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  <strong>Risk Coverage Gap:</strong> 3 core payment APIs lack integration tests.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
