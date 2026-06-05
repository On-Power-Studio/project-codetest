import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Play, Check, Loader2, Cpu, Radio, Shield, Activity } from 'lucide-react';

export const Workspace2_AnalysisEngine: React.FC = () => {
  const { analysisProgress, isAnalyzing, startAnalysis } = useAxiomStore();

  const cards = [
    {
      title: 'FRONTEND ANALYSIS',
      pct: Math.min(Math.round(analysisProgress * 0.98), 72),
      files: '892 files analyzed',
      items: [
        { label: 'Parsing React Components', done: analysisProgress >= 15 },
        { label: 'Analyzing Pages & Routes', done: analysisProgress >= 40 },
        { label: 'Extracting UI Dependencies', done: analysisProgress >= 70 },
        { label: 'Building Component Graph', done: analysisProgress >= 90 }
      ]
    },
    {
      title: 'BACKEND ANALYSIS',
      pct: Math.min(Math.round(analysisProgress * 0.93), 68),
      files: '456 files analyzed',
      items: [
        { label: 'Scanning API Endpoints', done: analysisProgress >= 20 },
        { label: 'Analyzing Business Logic', done: analysisProgress >= 45 },
        { label: 'Mapping Service Layer', done: analysisProgress >= 75 },
        { label: 'Building Call Graph', done: analysisProgress >= 90 }
      ]
    },
    {
      title: 'DATABASE ANALYSIS',
      pct: Math.min(Math.round(analysisProgress * 0.84), 61),
      files: '28 tables analyzed',
      items: [
        { label: 'Inspecting Schema', done: analysisProgress >= 30 },
        { label: 'Analyzing Relationships', done: analysisProgress >= 50 },
        { label: 'Tracing Query Patterns', done: analysisProgress >= 80 },
        { label: 'Building Data Lineage', done: analysisProgress >= 95 }
      ]
    },
    {
      title: 'INFRASTRUCTURE ANALYSIS',
      pct: Math.min(Math.round(analysisProgress * 0.67), 49),
      files: '12 config files analyzed',
      items: [
        { label: 'Parsing Configurations', done: analysisProgress >= 35 },
        { label: 'Detecting Services', done: analysisProgress >= 55 },
        { label: 'Analyzing Dependencies', done: analysisProgress >= 85 },
        { label: 'Mapping Deployments', done: analysisProgress >= 95 }
      ]
    }
  ];

  return (
    <div className="flex-1 bg-[#02050b] p-6 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none relative">
      {/* Scanline pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      <div className="space-y-6 flex-1 flex flex-col z-20">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3">
          <div>
            <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-400 animate-pulse" /> Analysis Engine
            </h2>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mt-0.5">
              {isAnalyzing ? 'Deep code intelligence scanner compiling project structure...' : 'Scanner system online. Trigger code mapping.'}
            </span>
          </div>
          {!isAnalyzing && analysisProgress === 0 && (
            <button
              onClick={startAnalysis}
              className="bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-400 text-xs font-bold font-mono tracking-widest py-1.5 px-4 rounded border border-cyan-500/40 flex items-center space-x-1.5 cursor-pointer transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            >
              <Play className="h-3 w-3 fill-cyan-400 text-cyan-400" />
              <span>START_SCANNER</span>
            </button>
          )}
        </div>

        {/* Central Circular Scan Dashboard */}
        <div className="flex-1 grid grid-cols-12 gap-4 items-center justify-center min-h-[300px]">
          {/* Top Left: Frontend Analysis */}
          <div className="col-span-3 space-y-4">
            <AnalysisCard card={cards[0]} progress={analysisProgress} color="#3B82F6" />
            <AnalysisCard card={cards[2]} progress={analysisProgress} color="#EF4444" />
          </div>

          {/* Center: Glowing Rings Scanner */}
          <div className="col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative h-64 w-64 flex items-center justify-center">
              {/* Outer scanning halo */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '8s' }} />
              
              {/* Outer neon dot rings */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-400/35 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
              
              {/* Inner glowing tracker ring */}
              <div className="absolute inset-8 rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-10 rounded-full border border-dashed border-green-500/30 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
              
              {/* Core gauge screen */}
              <div className="absolute inset-14 bg-[#050b18] rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center p-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono text-center">SCANNED</span>
                <span className="text-4xl font-black text-cyan-400 font-mono my-1 tracking-tighter shadow-cyan">
                  {analysisProgress}%
                </span>
                <span className="text-[8.5px] text-cyan-500 font-semibold font-mono text-center leading-tight max-w-[110px] uppercase">
                  {analysisProgress === 100 ? 'Knowledge Matrix OK' : 'Building Graph...'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Backend & Infrastructure */}
          <div className="col-span-3 space-y-4">
            <AnalysisCard card={cards[1]} progress={analysisProgress} color="#06B6D4" />
            <AnalysisCard card={cards[3]} progress={analysisProgress} color="#F59E0B" />
          </div>
        </div>

        {/* Bottom statistics summary banner */}
        <div className="border-t border-cyan-500/20 pt-4">
          <span className="text-[9px] font-bold text-cyan-500/50 uppercase tracking-widest font-mono block mb-3 text-center">KNOWLEDGE MATRIX TELEMETRY STATS</span>
          <div className="grid grid-cols-6 gap-4 text-center max-w-4xl mx-auto text-xs">
            {[
              { label: 'Files Scanned', val: analysisProgress === 100 ? '1,842' : `${Math.round(18.42 * analysisProgress)} / 1,842`, col: 'text-white' },
              { label: 'Lines of Code', val: '128,456', col: 'text-white' },
              { label: 'Components', val: analysisProgress === 100 ? '892' : Math.round(8.92 * analysisProgress), col: 'text-purple-400' },
              { label: 'API Endpoints', val: analysisProgress === 100 ? '156' : Math.round(1.56 * analysisProgress), col: 'text-cyan-400' },
              { label: 'Dependencies', val: analysisProgress === 100 ? '2,341' : Math.round(23.41 * analysisProgress), col: 'text-yellow-400' },
              { label: 'Relationships', val: analysisProgress === 100 ? '8,742' : Math.round(87.42 * analysisProgress), col: 'text-green-400' }
            ].map(stat => (
              <div key={stat.label} className="bg-[#050b18]/85 border border-cyan-500/10 rounded-sm p-2.5 shadow-[0_0_10px_rgba(6,182,212,0.01)]">
                <span className="text-[9px] text-slate-400 block font-semibold font-mono uppercase tracking-wider mb-0.5">{stat.label}</span>
                <span className={`text-sm font-bold font-mono ${stat.col}`}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Mini Helper Component for the 4 card panels */
const AnalysisCard: React.FC<{ card: any, progress: number, color: string }> = ({ card, progress, color }) => {
  return (
    <div 
      className="bg-[#050b18]/85 border border-cyan-500/20 rounded p-3.5 text-xs select-none shadow-[0_0_15px_rgba(6,182,212,0.02)]"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2 mb-2">
        <div>
          <h3 className="font-bold text-white font-mono text-[10.5px] tracking-wide">{card.title}</h3>
          <span className="text-[8px] font-mono text-slate-500">{card.files}</span>
        </div>
        <span className="text-xs font-bold font-mono" style={{ color }}>{card.pct}%</span>
      </div>

      <div className="space-y-1.5 text-[9.5px] text-slate-400 font-mono">
        {card.items.map((item: any, idx: number) => {
          const isDone = item.done;
          const isPending = !isDone && progress > 0;
          
          return (
            <div key={idx} className="flex items-center justify-between">
              <span className={isDone ? 'text-slate-200' : 'text-slate-500'}>{item.label}</span>
              <span className="shrink-0 ml-2">
                {isDone ? (
                  <Check className="h-3.5 w-3.5 text-green-400 font-black" />
                ) : isPending && idx === card.items.filter((i: any) => i.done).length ? (
                  <Loader2 className="h-3 w-3 text-cyan-400 animate-spin" />
                ) : (
                  <div className="h-1 w-1 rounded-full bg-slate-700 mx-1" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
