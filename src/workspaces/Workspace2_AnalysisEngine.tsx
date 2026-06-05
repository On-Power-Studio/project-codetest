import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Play, Check, Loader2, AlertCircle } from 'lucide-react';

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
    <div className="flex-1 bg-bg-primary p-6 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none">
      <div className="space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide">Analysis Engine</h2>
            <span className="text-[11px] text-text-secondary">
              {isAnalyzing ? 'Deep code intelligence analysis in progress...' : 'Analysis idle. Trigger scanner to map dependencies.'}
            </span>
          </div>
          {!isAnalyzing && analysisProgress === 0 && (
            <button
              onClick={startAnalysis}
              className="bg-primary-purple hover:bg-primary-purple/90 text-text-primary text-xs font-bold py-1.5 px-4 rounded-lg flex items-center space-x-1.5 cursor-pointer border border-primary-purple/20 transition-all"
            >
              <Play className="h-3 w-3 fill-text-primary" />
              <span>Start Code Analysis</span>
            </button>
          )}
        </div>

        {/* Central Circular Scan Dashboard */}
        <div className="flex-1 grid grid-cols-12 gap-4 items-center justify-center min-h-[300px]">
          {/* Top Left: Frontend Analysis */}
          <div className="col-span-3 space-y-4">
            <AnalysisCard card={cards[0]} progress={analysisProgress} />
            <AnalysisCard card={cards[2]} progress={analysisProgress} />
          </div>

          {/* Center: Glowing Rings Scanner */}
          <div className="col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative h-64 w-64 flex items-center justify-center">
              {/* Outer scanning halo */}
              <div className="absolute inset-0 rounded-full border border-primary-purple/25 spin-slow pulse-glow" />
              
              {/* Outer neon dot rings */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary-purple/40 spin-slow-reverse" />
              
              {/* Inner glowing tracker ring */}
              <div className="absolute inset-8 rounded-full border border-secondary-blue/30 spin-slow" />
              <div className="absolute inset-10 rounded-full border border-dashed border-success/30 spin-slow-reverse" />
              
              {/* Core gauge screen */}
              <div className="absolute inset-14 bg-bg-secondary rounded-full border border-border-color shadow-2xl flex flex-col items-center justify-center p-4">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest text-center">Analyzing</span>
                <span className="text-4xl font-black text-text-primary font-mono my-1 tracking-tighter">
                  {analysisProgress}%
                </span>
                <span className="text-[9px] text-primary-purple font-semibold text-center leading-tight max-w-[110px]">
                  {analysisProgress === 100 ? 'Knowledge Graph Complete' : 'Building Knowledge Graph'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Backend & Infrastructure */}
          <div className="col-span-3 space-y-4">
            <AnalysisCard card={cards[1]} progress={analysisProgress} />
            <AnalysisCard card={cards[3]} progress={analysisProgress} />
          </div>
        </div>

        {/* Bottom statistics summary banner */}
        <div className="border-t border-border-color pt-4">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-3 text-center">Building Intelligence Graph</span>
          <div className="grid grid-cols-6 gap-4 text-center max-w-4xl mx-auto text-xs">
            {[
              { label: 'Files Scanned', val: analysisProgress === 100 ? '1,842' : `${Math.round(18.42 * analysisProgress)} / 1,842`, col: 'text-text-primary' },
              { label: 'Lines of Code', val: '128,456', col: 'text-text-primary' },
              { label: 'Components', val: analysisProgress === 100 ? '892' : Math.round(8.92 * analysisProgress), col: 'text-primary-purple' },
              { label: 'API Endpoints', val: analysisProgress === 100 ? '156' : Math.round(1.56 * analysisProgress), col: 'text-secondary-blue' },
              { label: 'Dependencies', val: analysisProgress === 100 ? '2,341' : Math.round(23.41 * analysisProgress), col: 'text-warning' },
              { label: 'Relationships', val: analysisProgress === 100 ? '8,742' : Math.round(87.42 * analysisProgress), col: 'text-success' }
            ].map(stat => (
              <div key={stat.label} className="bg-surface/20 border border-border-color/30 rounded-lg p-2.5">
                <span className="text-[9px] text-text-secondary block font-semibold mb-0.5">{stat.label}</span>
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
const AnalysisCard: React.FC<{ card: any, progress: number }> = ({ card, progress }) => {
  return (
    <div className="bg-surface/30 border border-border-color rounded-lg p-3.5 text-xs select-none">
      <div className="flex justify-between items-center border-b border-border-color/30 pb-2 mb-2">
        <div>
          <h3 className="font-bold text-text-primary text-[11px] tracking-wide">{card.title}</h3>
          <span className="text-[8px] text-text-secondary">{card.files}</span>
        </div>
        <span className="text-xs font-bold text-primary-purple font-mono">{card.pct}%</span>
      </div>

      <div className="space-y-1.5 text-[10px] text-text-secondary">
        {card.items.map((item: any, idx: number) => {
          // Calculate if item is active/spinning (next inline item to solve)
          const isDone = item.done;
          const isPending = !isDone && progress > 0;
          
          return (
            <div key={idx} className="flex items-center justify-between">
              <span className={isDone ? 'text-text-primary' : 'text-text-secondary'}>{item.label}</span>
              <span className="shrink-0 ml-2">
                {isDone ? (
                  <Check className="h-3.5 w-3.5 text-success font-black" />
                ) : isPending && idx === card.items.filter((i: any) => i.done).length ? (
                  <Loader2 className="h-3 w-3 text-primary-purple animate-spin" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-border-color mx-1" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
