import { useAxiomStore } from '../store/axiomStore';
import type { WorkspaceType } from '../store/axiomStore';
import { ProjectExplorer } from './ProjectExplorer';
import { 
  Plus, HardDrive, Database, LayoutGrid, CheckCircle2,
  FileText, Activity, Server, Radio, BarChart2, ShieldAlert, Cpu, Eye,
  Lock, History, Settings, Compass, Sliders, Map
} from 'lucide-react';
import { GithubIcon, GitlabIcon } from './CustomIcons';

export const LeftSidebar: React.FC = () => {
  const { activeWorkspace, setActiveWorkspace, twinLayers, toggleTwinLayer, twinPreset, setTwinPreset } = useAxiomStore();

  // Render 1: Projects Workspace Sidebar (2.webp)
  const renderProjectsSidebar = () => (
    <div className="w-56 bg-bg-secondary border-r border-border-color flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        {/* Import button */}
        <button 
          onClick={() => setActiveWorkspace('projects')}
          className="w-full bg-primary-purple hover:bg-primary-purple/90 text-text-primary text-xs font-bold py-2 px-3 rounded flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Import New Project</span>
        </button>

        {/* Import sources list */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Import From</span>
          {[
            { label: 'GitHub Repository', sub: 'Import from a GitHub repository', icon: GithubIcon },
            { label: 'GitLab Repository', sub: 'Import from a GitLab repository', icon: GitlabIcon },
            { label: 'Bitbucket Repository', sub: 'Import from a Bitbucket repository', icon: Database },
            { label: 'Local Repository', sub: 'Import from local directory', icon: HardDrive }
          ].map(src => (
            <div key={src.label} className="p-2 hover:bg-surface/50 rounded-md border border-transparent hover:border-border-color flex items-center space-x-2.5 cursor-pointer transition-all">
              <src.icon className="h-4 w-4 text-text-secondary" />
              <div className="min-w-0">
                <div className="text-[10.5px] font-semibold text-text-primary leading-tight">{src.label}</div>
                <div className="text-[8px] text-text-secondary truncate mt-0.5">{src.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Recent Projects</span>
          {[
            { name: 'ecommerce-platform', path: 'C:\\Dev\\projects\\ecommerce-platform', active: true },
            { name: 'saas-dashboard', path: 'C:\\Dev\\projects\\saas-dashboard' },
            { name: 'mobile-backend', path: 'C:\\Dev\\projects\\mobile-backend' }
          ].map(proj => (
            <div 
              key={proj.name} 
              onClick={() => setActiveWorkspace(proj.active ? 'explorer' : 'projects')}
              className={`p-2 rounded-md border transition-all cursor-pointer flex items-center space-x-2.5 ${
                proj.active 
                  ? 'bg-surface border-border-color text-primary-purple' 
                  : 'bg-transparent border-transparent hover:bg-surface/30 text-text-secondary hover:text-text-primary'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <div className="min-w-0">
                <div className="text-[10.5px] font-semibold leading-tight">{proj.name}</div>
                <div className="text-[8px] text-text-secondary truncate mt-0.5">{proj.path}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render 2: Validation Sidebar (7.webp)
  const renderValidationSidebar = () => {
    const items = [
      { label: 'Mission Control', icon: Compass, active: true },
      { label: 'Validations', icon: CheckCircle2 },
      { label: 'Tests', icon: FileText },
      { label: 'Environments', icon: Server },
      { label: 'Systems', icon: Radio },
      { label: 'Monitoring', icon: Activity },
      { label: 'Coverage', icon: BarChart2 },
      { label: 'Impacted', icon: Cpu },
      { label: 'Reports', icon: FileText },
      { label: 'AI Insights', icon: ShieldAlert },
      { label: 'Settings', icon: Settings }
    ];

    return (
      <div className="w-48 bg-bg-secondary border-r border-border-color flex flex-col p-3 select-none">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-3 px-1.5">Control Center</span>
        <div className="space-y-0.5">
          {items.map(item => (
            <button
              key={item.label}
              className={`w-full text-left py-1.5 px-2.5 rounded text-[11px] font-sans font-semibold flex items-center space-x-2 transition-all cursor-pointer border-l-2 ${
                item.active 
                  ? 'bg-surface text-primary-purple border-primary-purple font-bold glow-purple' 
                  : 'text-text-secondary hover:text-text-primary border-transparent hover:bg-surface/30'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render 3: Impact Sidebar (8.webp)
  const renderImpactSidebar = () => {
    const items = [
      { label: 'Impact Analysis', icon: Cpu, active: true },
      { label: 'Change Monitor', icon: Eye },
      { label: 'Dependencies', icon: Sliders },
      { label: 'Services', icon: Server },
      { label: 'Database', icon: Database },
      { label: 'Tests', icon: FileText },
      { label: 'Risks', icon: ShieldAlert },
      { label: 'AI Insights', icon: CheckCircle2 },
      { label: 'Reports', icon: FileText },
      { label: 'Settings', icon: Settings }
    ];

    return (
      <div className="w-48 bg-bg-secondary border-r border-border-color flex flex-col p-3 select-none">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-3 px-1.5">Impact Suite</span>
        <div className="space-y-0.5">
          {items.map(item => (
            <button
              key={item.label}
              className={`w-full text-left py-1.5 px-2.5 rounded text-[11px] font-sans font-semibold flex items-center space-x-2 transition-all cursor-pointer border-l-2 ${
                item.active 
                  ? 'bg-surface text-primary-purple border-primary-purple font-bold glow-purple' 
                  : 'text-text-secondary hover:text-text-primary border-transparent hover:bg-surface/30'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render 4: Agents Sidebar (9.webp)
  const renderAgentsSidebar = () => {
    const items = [
      { label: 'Agent Command', icon: Radio, active: true },
      { label: 'Task Orchestrator', icon: Sliders },
      { label: 'System Monitor', icon: Activity },
      { label: 'Data Intelligence', icon: Database },
      { label: 'Communication', icon: Compass },
      { label: 'Knowledge Base', icon: FileText },
      { label: 'Security Center', icon: Lock },
      { label: 'Audit Trail', icon: History },
      { label: 'Settings', icon: Settings }
    ];

    return (
      <div className="w-48 bg-bg-secondary border-r border-border-color flex flex-col p-3 select-none">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-3 px-1.5">Ops Center</span>
        <div className="space-y-0.5">
          {items.map(item => (
            <button
              key={item.label}
              className={`w-full text-left py-1.5 px-2.5 rounded text-[11px] font-sans font-semibold flex items-center space-x-2 transition-all cursor-pointer border-l-2 ${
                item.active 
                  ? 'bg-surface text-primary-purple border-primary-purple font-bold glow-purple' 
                  : 'text-text-secondary hover:text-text-primary border-transparent hover:bg-surface/30'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render 5: Twin Sidebar (10.webp)
  const renderTwinSidebar = () => {
    const items = [
      { label: 'Twin Overview', icon: Map, active: true },
      { label: 'Infinite Canvas', icon: Sliders },
      { label: 'System Map', icon: Compass },
      { label: 'Traffic Flow', icon: Activity },
      { label: 'Dependencies', icon: Cpu },
      { label: 'Coverage', icon: BarChart2 },
      { label: 'Tests', icon: FileText },
      { label: 'Risks', icon: ShieldAlert },
      { label: 'AI Insights', icon: CheckCircle2 },
      { label: 'Predictions', icon: Sliders },
      { label: 'Incidents', icon: ShieldAlert },
      { label: 'Reports', icon: FileText },
      { label: 'Settings', icon: Settings }
    ];

    const layers: { key: keyof typeof twinLayers; label: string }[] = [
      { key: 'pages', label: 'Pages (Cities)' },
      { key: 'components', label: 'Components (Buildings)' },
      { key: 'apis', label: 'APIs (Roads)' },
      { key: 'services', label: 'Services (Infrastructure)' },
      { key: 'databases', label: 'Databases (Power Plants)' },
      { key: 'tests', label: 'Tests (Security)' },
      { key: 'traffic', label: 'Traffic Flow' },
      { key: 'risks', label: 'Risk Hotspots' },
      { key: 'coverage', label: 'Coverage Heatmap' }
    ];

    const presets: { id: typeof twinPreset; label: string }[] = [
      { id: 'overview', label: 'System Overview' },
      { id: 'risk', label: 'Risk Focus' },
      { id: 'traffic', label: 'Traffic Analysis' },
      { id: 'coverage', label: 'Coverage View' }
    ];

    return (
      <div className="w-52 bg-bg-secondary border-r border-border-color flex flex-col justify-between p-3 select-none max-h-full overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-2 px-1">Twin Control</span>
            {items.map(item => (
              <button
                key={item.label}
                className={`w-full text-left py-1 px-2 rounded text-[10.5px] font-sans font-semibold flex items-center space-x-1.5 transition-all cursor-pointer border-l-2 ${
                  item.active 
                    ? 'bg-surface text-primary-purple border-primary-purple font-bold glow-purple' 
                    : 'text-text-secondary hover:text-text-primary border-transparent hover:bg-surface/30'
                }`}
              >
                <item.icon className="h-3 w-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Layer Controls checkboxes */}
          <div className="border-t border-border-color pt-3">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-2 px-1">Layer Controls</span>
            <div className="space-y-1.5 px-1">
              {layers.map(layer => (
                <label key={layer.key} className="flex items-center space-x-2 text-[10px] text-text-secondary hover:text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twinLayers[layer.key]}
                    onChange={() => toggleTwinLayer(layer.key)}
                    className="rounded text-primary-purple bg-bg-primary border-border-color h-3 w-3"
                  />
                  <span>{layer.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* View Presets */}
          <div className="border-t border-border-color pt-3 pb-2">
            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-2 px-1">View Presets</span>
            <div className="space-y-1">
              {presets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setTwinPreset(preset.id)}
                  className={`w-full text-left py-1 px-2.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    twinPreset === preset.id
                      ? 'bg-primary-purple/15 text-primary-purple border border-primary-purple/35'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/30'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Select sidebar depending on workspace
  const getSidebar = () => {
    switch (activeWorkspace) {
      case 'explorer':
      case 'graph':
      case 'ai':
      case 'settings':
        return <ProjectExplorer />;
      case 'projects':
      case 'analysis':
        return renderProjectsSidebar();
      case 'tests':
        // Test workspace has its own 3-column setup without explorer sidebar
        return null;
      case 'validation':
        return renderValidationSidebar();
      case 'coverage':
        return renderProjectsSidebar(); // Coverage shares basic projects context or explorer
      case 'impact':
        return renderImpactSidebar();
      case 'agents':
        return renderAgentsSidebar();
      case 'twin':
        return renderTwinSidebar();
      default:
        return <ProjectExplorer />;
    }
  };

  const currentSidebar = getSidebar();
  if (!currentSidebar) return null;

  return currentSidebar;
};
