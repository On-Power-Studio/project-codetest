import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { GitBranch, AlertCircle, RefreshCw, CheckCircle, Zap, Shield, Play } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { 
    activeWorkspace, 
    isImporting, 
    isAnalyzing, 
    importProgress, 
    analysisProgress,
    aiProvider,
    aiModel,
    aiConnected
  } = useAxiomStore();

  return (
    <div className="h-6.5 bg-bg-tertiary border-t border-border-color flex items-center justify-between px-3 text-[10px] text-text-secondary select-none font-sans font-medium">
      {/* Left items */}
      <div className="flex items-center space-x-4">
        {/* Branch */}
        <div className="flex items-center space-x-1 hover:text-text-primary cursor-pointer transition-colors">
          <GitBranch className="h-3 w-3" />
          <span>main</span>
        </div>

        {/* Problems brief */}
        <div className="flex items-center space-x-2 text-warning hover:text-text-primary cursor-pointer transition-colors">
          <AlertCircle className="h-3 w-3" />
          <span>0 ⚠️ 3</span>
        </div>

        {/* AI Provider Indicator */}
        <div className="flex items-center space-x-1">
          <span>CORE:</span>
          <span className={aiConnected ? "text-cyan-400 font-bold font-mono" : "text-amber-500 font-bold font-mono animate-pulse"}>
            {aiConnected ? `${aiProvider.toUpperCase()}/${aiModel}` : 'STANDBY'}
          </span>
        </div>

        {/* Dynamic status alert */}
        <div className="flex items-center space-x-1.5 font-mono text-[9px] uppercase tracking-wider text-text-secondary">
          {isImporting && (
            <span className="text-secondary-blue animate-pulse">Importing repository ({importProgress}%)</span>
          )}
          {isAnalyzing && (
            <span className="text-primary-purple animate-pulse">Running tree-sitter analysis ({analysisProgress}%)</span>
          )}
          {!isImporting && !isAnalyzing && (
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 bg-success rounded-full animate-ping" />
              <span>Axiom Agent: Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Center metadata */}
      <div className="flex items-center space-x-5 font-mono">
        <div>GRAPH: <span className="text-text-primary font-bold">1,842 nodes</span></div>
        <div>TESTS: <span className="text-text-primary font-bold">78 passed</span>, <span className="text-danger font-bold">6 failed</span>, <span className="text-warning font-bold">3 skipped</span></div>
        <div>COVERAGE: <span className="text-success font-bold">78.4%</span></div>
        <div className="flex items-center space-x-1">
          <span>RISK SCORE: </span>
          <span className="bg-danger text-text-primary font-bold px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase animate-pulse">High</span>
        </div>
      </div>

      {/* Right status flags */}
      <div className="flex items-center space-x-3">
        <span className="hover:text-text-primary cursor-pointer transition-colors">Live Share</span>
        <span className="hover:text-text-primary cursor-pointer transition-colors">Spell</span>
        <span className="hover:text-text-primary cursor-pointer transition-colors">Prettier</span>
        <div className="h-3 w-px bg-border-color" />
        <span className="text-text-primary font-bold">TypeScript React</span>
      </div>
    </div>
  );
};
