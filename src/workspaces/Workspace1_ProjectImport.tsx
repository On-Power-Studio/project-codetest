import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Folder, ChevronDown, Check, Play, AlertCircle } from 'lucide-react';
import { GithubIcon } from '../components/CustomIcons';

export const Workspace1_ProjectImport: React.FC = () => {
  const { 
    repoUrl, 
    setRepoUrl, 
    importStep, 
    importProgress, 
    isImporting, 
    startImport 
  } = useAxiomStore();

  const steps = [
    { num: 1, label: 'Connect' },
    { num: 2, label: 'Scan' },
    { num: 3, label: 'Analyze' },
    { num: 4, label: 'Build Graph' }
  ];

  return (
    <div className="flex-1 bg-bg-primary p-6 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none">
      <div className="space-y-6">
        {/* Header Title */}
        <div>
          <h2 className="text-lg font-bold text-text-primary">IMPORT REPOSITORY</h2>
          <span className="text-[11px] text-text-secondary">
            Step {importStep} of 4: {importStep === 1 ? 'Connect and analyze your repository' : importStep === 2 ? 'Scanning codebase folders' : importStep === 3 ? 'Extracting syntax relations' : 'Building software intelligence graph'}
          </span>
        </div>

        {/* Steps Progress Tracker */}
        <div className="flex items-center space-x-4 max-w-2xl bg-surface/20 border border-border-color p-3 rounded-lg">
          {steps.map((s, idx) => {
            const isCompleted = importStep > s.num;
            const isCurrent = importStep === s.num;
            
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center space-x-2">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                    isCompleted 
                      ? 'bg-success border-success text-bg-primary' 
                      : isCurrent 
                        ? 'bg-primary-purple border-primary-purple text-text-primary animate-pulse' 
                        : 'border-border-color text-text-secondary'
                  }`}>
                    {isCompleted ? <Check className="h-3 w-3" strokeWidth={3} /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? 'text-primary-purple' : isCompleted ? 'text-success' : 'text-text-secondary'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 min-w-8 transition-colors ${importStep > s.num ? 'bg-success/50' : 'bg-border-color'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="max-w-3xl flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isImporting}
              className="w-full bg-surface border border-border-color rounded-lg px-4 py-2 text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-purple/50 focus:ring-1 focus:ring-primary-purple/20"
            />
            {importStep > 1 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Check className="h-4 w-4 text-success" />
              </div>
            )}
          </div>
          
          <div className="flex items-center bg-surface border border-border-color px-3 py-1.5 rounded-lg text-xs text-text-primary cursor-pointer hover:bg-opacity-80">
            <GithubIcon className="h-4 w-4 text-text-secondary mr-2 shrink-0" />
            <span>GitHub</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-secondary ml-2 shrink-0" />
          </div>

          <button
            onClick={startImport}
            disabled={isImporting}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              isImporting 
                ? 'bg-surface border border-border-color text-text-secondary cursor-not-allowed animate-pulse' 
                : 'bg-primary-purple hover:bg-primary-purple/90 text-text-primary border border-primary-purple/25'
            }`}
          >
            {isImporting ? (
              <span>Connecting ({importProgress}%)</span>
            ) : (
              <>
                <Play className="h-3 w-3 fill-text-primary" />
                <span>Connect Repository</span>
              </>
            )}
          </button>
        </div>

        {/* Two Columns: Info cards and Dependency lists */}
        <div className="grid grid-cols-2 gap-6 max-w-5xl">
          {/* Column 1: Info Cards */}
          <div className="space-y-4">
            {/* Repository Info Card */}
            <div className="bg-surface/30 border border-border-color rounded-lg p-4 text-xs">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-3">Repository Information</span>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-border-color/30 pb-1.5"><span className="text-text-secondary">Repository</span><span className="text-text-primary font-semibold">ecommerce-platform</span></div>
                <div className="flex justify-between border-b border-border-color/30 pb-1.5"><span className="text-text-secondary">Owner</span><span className="text-text-primary font-semibold">your-org</span></div>
                <div className="flex justify-between border-b border-border-color/30 pb-1.5"><span className="text-text-secondary">Default Branch</span><span className="text-text-primary font-semibold">main</span></div>
                <div className="flex justify-between border-b border-border-color/30 pb-1.5"><span className="text-text-secondary">Visibility</span><span className="text-success font-semibold">Public</span></div>
                <div className="flex justify-between border-b border-border-color/30 pb-1.5"><span className="text-text-secondary">Size</span><span className="text-text-primary font-semibold font-mono">128 MB</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Last Updated</span><span className="text-text-primary">2 hours ago</span></div>
              </div>
            </div>

            {/* Detected Stack Card */}
            <div className="bg-surface/30 border border-border-color rounded-lg p-4 text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Detected Stack</span>
                <span className="text-[9px] bg-success/15 border border-success/35 text-success px-1.5 py-0.5 rounded font-bold">Auto-detected</span>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { label: 'Next.js', ver: '14.2.3', col: 'text-text-primary' },
                  { label: 'React', ver: '18.3.1', col: 'text-text-primary' },
                  { label: 'TypeScript', ver: '5.3.3', col: 'text-text-primary' },
                  { label: 'Node.js', ver: '20.11.1', col: 'text-text-primary' },
                  { label: 'PostgreSQL', ver: '15.4', col: 'text-text-primary' },
                  { label: 'Tailwind CSS', ver: '3.4.1', col: 'text-text-primary' }
                ].map(tech => (
                  <div key={tech.label} className="flex justify-between items-center py-1 border-b border-border-color/20">
                    <span className="text-text-secondary font-medium">{tech.label}</span>
                    <span className="text-text-primary font-semibold font-mono">{tech.ver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Top Level Dependency tree card */}
          <div className="bg-surface/30 border border-border-color rounded-lg p-4 text-xs flex flex-col min-h-[300px]">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-3">Dependency Tree (Top Level)</span>
            <div className="flex-1 space-y-3 font-mono overflow-y-auto pr-1">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4 text-secondary-blue fill-secondary-blue/10 shrink-0" />
                <span className="text-text-primary font-semibold">ecommerce-platform</span>
                <span className="text-[9px] text-text-secondary">(1,245 files)</span>
              </div>
              
              <div className="pl-6 space-y-2 border-l border-border-color/30">
                <div className="flex justify-between items-center py-0.5 hover:bg-surface/40 px-1.5 rounded transition-all">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-3.5 w-3.5 text-secondary-blue shrink-0" />
                    <span>frontend (Next.js)</span>
                  </div>
                  <span className="text-text-secondary text-[10px]">245 files</span>
                </div>
                <div className="pl-12 space-y-1.5 border-l border-border-color/20">
                  <div className="flex justify-between items-center text-[11px] text-text-secondary"><span>components</span><span>128 files</span></div>
                  <div className="flex justify-between items-center text-[11px] text-text-secondary"><span>pages</span><span>86 files</span></div>
                  <div className="flex justify-between items-center text-[11px] text-text-secondary"><span>utils</span><span>31 files</span></div>
                </div>

                <div className="flex justify-between items-center py-0.5 hover:bg-surface/40 px-1.5 rounded transition-all">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-3.5 w-3.5 text-secondary-blue shrink-0" />
                    <span>backend (Node.js/Express)</span>
                  </div>
                  <span className="text-text-secondary text-[10px]">612 files</span>
                </div>
                <div className="pl-12 space-y-1.5 border-l border-border-color/20">
                  <div className="flex justify-between items-center text-[11px] text-text-secondary"><span>controllers</span><span>54 files</span></div>
                  <div className="flex justify-between items-center text-[11px] text-text-secondary"><span>services</span><span>79 files</span></div>
                  <div className="flex justify-between items-center text-[11px] text-text-secondary"><span>routes</span><span>18 files</span></div>
                </div>

                <div className="flex justify-between items-center py-0.5 hover:bg-surface/40 px-1.5 rounded transition-all">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-3.5 w-3.5 text-secondary-blue shrink-0" />
                    <span>database (Prisma/PostgreSQL)</span>
                  </div>
                  <span className="text-text-secondary text-[10px]">156 files</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer bottom */}
      <div className="mt-6 flex items-center space-x-2 text-[10px] text-text-secondary">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>AXIOM automatically analyzes lockfiles (package-lock.json, package.json) to isolate framework modules.</span>
      </div>
    </div>
  );
};
