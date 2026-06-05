import { useAxiomStore } from '../store/axiomStore';
import type { WorkspaceType } from '../store/axiomStore';
import { 
  FolderClosed, 
  Layers, 
  GitBranch, 
  Beaker, 
  ShieldCheck, 
  Activity, 
  BrainCircuit, 
  Settings,
  Cpu,
  Globe,
  Bot
} from 'lucide-react';

interface ActivityItem {
  type: WorkspaceType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string | number;
}

export const ActivityBar: React.FC = () => {
  const { activeWorkspace, setActiveWorkspace } = useAxiomStore();

  const topItems: ActivityItem[] = [
    { type: 'explorer', icon: FolderClosed, label: 'Explorer' },
    { type: 'projects', icon: Layers, label: 'Projects' },
    { type: 'graph', icon: GitBranch, label: 'Graph View' },
    { type: 'ai', icon: Bot, label: 'AI Workspace' },
    { type: 'tests', icon: Beaker, label: 'Test Studio' },
    { type: 'validation', icon: Activity, label: 'Validation' },
    { type: 'coverage', icon: ShieldCheck, label: 'Coverage' },
    { type: 'impact', icon: Cpu, label: 'Impact Analysis' },
    { type: 'agents', icon: BrainCircuit, label: 'QA Agents', badge: '6' },
    { type: 'twin', icon: Globe, label: 'Digital Twin' }
  ];

  return (
    <div className="w-14 bg-bg-secondary border-r border-border-color flex flex-col justify-between items-center py-4 select-none">
      {/* Top Navigation Icons */}
      <div className="flex flex-col space-y-2.5 w-full items-center">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeWorkspace === item.type;
          
          return (
            <div key={item.type} className="relative group w-full flex justify-center">
              {/* Left active glowing vertical bar */}
              <div className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary-purple transition-all duration-200 ${
                isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50 group-hover:opacity-40 group-hover:scale-y-75'
              }`} />
              
              <button
                onClick={() => setActiveWorkspace(item.type)}
                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-surface text-primary-purple glow-purple' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                }`}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>

              {/* Optional notifications badge */}
              {item.badge && (
                <span className="absolute top-0 right-3 bg-primary-purple text-text-primary text-[9px] font-bold px-1 py-0.5 rounded-full border border-bg-secondary">
                  {item.badge}
                </span>
              )}

              {/* Hover Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 bg-bg-tertiary border border-border-color text-text-primary text-xs px-2.5 py-1.5 rounded shadow-lg pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 z-50 whitespace-nowrap">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Configuration Icons */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {/* Settings Button */}
        <div className="relative group w-full flex justify-center">
          <div className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary-purple transition-all duration-200 ${
            activeWorkspace === 'settings' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50 group-hover:opacity-40'
          }`} />
          <button
            onClick={() => setActiveWorkspace('settings')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeWorkspace === 'settings' 
                ? 'bg-surface text-primary-purple glow-purple' 
                : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
            }`}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 bg-bg-tertiary border border-border-color text-text-primary text-xs px-2.5 py-1.5 rounded shadow-lg pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 z-50 whitespace-nowrap">
            Settings
          </div>
        </div>

        {/* User Profile Avatar */}
        <div className="relative group flex items-center justify-center cursor-pointer">
          <div className="h-8.5 w-8.5 rounded-full border border-border-color hover:border-primary-purple overflow-hidden transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
              alt="User Profile" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 bg-bg-tertiary border border-border-color p-3.5 rounded-lg shadow-xl pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 z-50 min-w-44 flex flex-col space-y-1">
            <span className="text-xs font-semibold text-text-primary">Arjun Verma</span>
            <span className="text-[10px] text-text-secondary">Software Architect</span>
            <span className="text-[9px] text-primary-purple uppercase tracking-wider font-bold">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
