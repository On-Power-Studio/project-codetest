import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Search, ChevronDown, RefreshCw, Play, Settings, Minus, Square, X, Zap } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { activeWorkspace, setActiveWorkspace } = useAxiomStore();

  return (
    <div className="h-12 bg-bg-secondary border-b border-border-color flex items-center justify-between px-4 select-none">
      {/* Left section: Logo and current project context */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => setActiveWorkspace('projects')}>
          <Zap className="h-5 w-5 text-primary-purple fill-primary-purple" />
          <span className="text-sm font-bold tracking-wider text-text-primary">AXIOM</span>
          <span className="text-[10px] text-text-secondary bg-surface px-1.5 py-0.5 rounded font-mono border border-border-color">v2.0.0</span>
        </div>
        
        <div className="h-4 w-px bg-border-color" />
        
        {/* Project Selector */}
        <div className="flex items-center space-x-2 bg-surface hover:bg-opacity-80 px-2.5 py-1 rounded border border-border-color text-xs text-text-primary cursor-pointer transition-colors">
          <span>ecommerce-platform</span>
          <ChevronDown className="h-3 w-3 text-text-secondary" />
        </div>
        
        {/* Branch indicator */}
        <div className="flex items-center space-x-1.5 bg-surface/50 px-2 py-0.5 rounded border border-border-color text-[11px] text-text-secondary font-mono">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>main</span>
        </div>
      </div>

      {/* Middle section: Global Command Palette search */}
      <div className="flex-1 max-w-xl mx-8 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-text-secondary" />
        </div>
        <input
          type="text"
          placeholder="Search files, components, APIs, tests..."
          className="w-full bg-surface border border-border-color rounded-md pl-9 pr-12 py-1.5 text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-purple/50 focus:ring-1 focus:ring-primary-purple/20 transition-all font-sans"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <kbd className="bg-bg-primary text-[10px] text-text-secondary px-1.5 py-0.5 rounded font-mono border border-border-color">Ctrl K</kbd>
        </div>
      </div>

      {/* Right section: System statuses and Window Utilities */}
      <div className="flex items-center space-x-4">
        {/* Live system state badge */}
        <div className="flex items-center space-x-2 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
          <span>System Operational</span>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center space-x-1">
          <button className="p-1.5 rounded hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Sync Status">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer" 
            title="Run Suite"
            onClick={() => setActiveWorkspace('validation')}
          >
            <Play className="h-3.5 w-3.5" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer" 
            title="Axiom Settings"
            onClick={() => setActiveWorkspace('settings')}
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-border-color" />

        {/* Mock OS Minimize/Maximize/Close buttons */}
        <div className="flex items-center space-x-0.5">
          <button className="p-1.5 hover:bg-surface text-text-secondary hover:text-text-primary transition-colors rounded">
            <Minus className="h-3 w-3" />
          </button>
          <button className="p-1.5 hover:bg-surface text-text-secondary hover:text-text-primary transition-colors rounded">
            <Square className="h-2.5 w-2.5" />
          </button>
          <button className="p-1.5 hover:bg-danger hover:text-white transition-colors rounded">
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
