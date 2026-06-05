import React, { useState } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  Play, Search, ChevronDown, ChevronUp, CheckCircle, 
  Loader2
} from 'lucide-react';

export const Workspace5_TestGeneration: React.FC = () => {
  const { 
    isGeneratingTests, 
    testGenProgress, 
    testsList, 
    startGeneratingTests 
  } = useAxiomStore();

  const [searchVal, setSearchVal] = useState('');
  
  // Collapse state for categories
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({
    'ui': false,
    'api': false,
    'db': false,
    'integration': false,
    'security': false,
    'performance': false
  });

  const toggleCat = (cat: string) => {
    setCollapsedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group tests
  const uiTests = testsList.filter(t => t.category === 'ui');
  const apiTests = testsList.filter(t => t.category === 'api');
  const dbTests = testsList.filter(t => t.category === 'db');
  const intTests = testsList.filter(t => t.category === 'integration');
  const secTests = testsList.filter(t => t.category === 'security');
  const perfTests = testsList.filter(t => t.category === 'performance');

  const getStatusIcon = (status: string) => {
    if (status === 'Generated') return <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />;
    if (status === 'Generating') return <Loader2 className="h-3.5 w-3.5 text-primary-purple animate-spin shrink-0" />;
    return <div className="h-2 w-2 rounded-full bg-border-color mx-1 shrink-0" />;
  };

  return (
    <div className="flex-1 bg-bg-primary p-5 overflow-hidden flex flex-col font-sans h-full min-h-0 select-none">
      {/* Workspace Header */}
      <div className="border-b border-border-color pb-3 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide">Test Generation Studio</h2>
          <span className="text-[11px] text-text-secondary">Scan application interfaces and automatically generate robust E2E, integration, and security tests.</span>
        </div>
        {!isGeneratingTests && testGenProgress < 100 && (
          <button
            onClick={startGeneratingTests}
            className="bg-primary-purple hover:bg-primary-purple/90 text-text-primary text-xs font-bold py-1.5 px-4 rounded-lg flex items-center space-x-1.5 cursor-pointer border border-primary-purple/20 transition-all"
          >
            <Play className="h-3 w-3 fill-text-primary" />
            <span>Generate Missing Tests</span>
          </button>
        )}
      </div>

      {/* Main Grid: Application Graph (Left) and Test Suite Lists (Right) */}
      <div className="flex-1 grid grid-cols-12 gap-5 min-h-0">
        
        {/* Left Column: Application Graph */}
        <div className="col-span-5 bg-surface/10 border border-border-color rounded-xl p-4 flex flex-col justify-between min-h-0">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-3">Application Graph</span>
          
          {/* SVG Map of Services */}
          <div className="flex-1 relative flex items-center justify-center min-h-[300px] bg-bg-primary/30 border border-border-color/30 rounded-lg overflow-hidden">
            {/* Connecting lines */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-40">
              {/* WebApp to Auth and User */}
              <line x1="50%" y1="12%" x2="25%" y2="28%" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
              <line x1="50%" y1="12%" x2="75%" y2="28%" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
              
              {/* Auth and User to API services */}
              <line x1="25%" y1="28%" x2="16%" y2="48%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
              <line x1="25%" y1="28%" x2="50%" y2="48%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
              <line x1="75%" y1="28%" x2="50%" y2="48%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
              <line x1="75%" y1="28%" x2="84%" y2="48%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />

              {/* API services to inventory / notification */}
              <line x1="16%" y1="48%" x2="30%" y2="68%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
              <line x1="50%" y1="48%" x2="30%" y2="68%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
              <line x1="50%" y1="48%" x2="70%" y2="68%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
              <line x1="84%" y1="48%" x2="70%" y2="68%" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />

              {/* Support services to Database / Cache */}
              <line x1="30%" y1="68%" x2="36%" y2="88%" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
              <line x1="70%" y1="68%" x2="64%" y2="88%" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
            </svg>

            {/* Nodes */}
            <div className="absolute top-[8%] bg-surface border border-primary-purple rounded px-3 py-1 font-semibold text-[10px] text-text-primary glow-purple">Web App (Next.js)</div>
            
            <div className="absolute top-[24%] left-[10%] bg-surface border border-secondary-blue rounded px-2.5 py-1 text-[9px] text-text-primary">Auth Service</div>
            <div className="absolute top-[24%] right-[10%] bg-surface border border-secondary-blue rounded px-2.5 py-1 text-[9px] text-text-primary">User Service</div>

            <div className="absolute top-[44%] left-[2%] bg-surface border border-warning rounded px-2 py-0.5 text-[9px] text-text-primary">Product Service</div>
            <div className="absolute top-[44%] left-[38%] bg-surface border border-warning rounded px-2 py-0.5 text-[9px] text-text-primary">Order Service</div>
            <div className="absolute top-[44%] right-[2%] bg-surface border border-warning rounded px-2 py-0.5 text-[9px] text-text-primary">Payment Service</div>

            <div className="absolute top-[64%] left-[18%] bg-surface border border-info rounded px-2 py-0.5 text-[9px] text-text-primary">Inventory Service</div>
            <div className="absolute top-[64%] right-[18%] bg-surface border border-info rounded px-2 py-0.5 text-[9px] text-text-primary">Notification Service</div>

            <div className="absolute top-[84%] left-[24%] bg-surface border border-success rounded px-3 py-1 text-[10px] text-text-primary glow-green font-mono">PostgreSQL</div>
            <div className="absolute top-[84%] right-[24%] bg-surface border border-success rounded px-3 py-1 text-[10px] text-text-primary font-mono">Redis Cache</div>
          </div>

          {/* Legend bottom */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-[8.5px] text-text-secondary border-t border-border-color pt-3 text-center">
            <div className="flex items-center justify-center space-x-1.5">
              <div className="h-2 w-2 rounded bg-primary-purple" />
              <span>Frontend</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <div className="h-2 w-2 rounded bg-secondary-blue" />
              <span>API Service</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <div className="h-2 w-2 rounded bg-warning" />
              <span>Microservice</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <div className="h-2 w-2 rounded bg-info" />
              <span>Support Service</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <div className="h-2 w-2 rounded bg-success" />
              <span>Database</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <div className="h-2 w-2 rounded bg-border-color" />
              <span>External</span>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Tests Lists */}
        <div className="col-span-7 bg-surface/10 border border-border-color rounded-xl p-4 flex flex-col justify-between min-h-0">
          
          <div className="flex-1 flex flex-col min-h-0">
            {/* Title / Search filter toolbar */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Generated Tests</span>
              
              <div className="flex items-center space-x-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-text-secondary" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search tests..."
                    className="bg-surface border border-border-color rounded px-2.5 pl-6 py-1 text-[10px] text-text-primary focus:outline-none focus:border-primary-purple/40 w-36"
                  />
                </div>
                {/* Filter dropdown */}
                <div className="bg-surface border border-border-color px-2.5 py-1 rounded text-[10px] text-text-primary flex items-center space-x-1 cursor-pointer">
                  <span>All</span>
                  <ChevronDown className="h-3 w-3 text-text-secondary" />
                </div>
              </div>
            </div>

            {/* Test Generation Progress bar if active */}
            {isGeneratingTests && (
              <div className="bg-primary-purple/5 border border-primary-purple/20 p-2.5 rounded-lg mb-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 flex-1">
                  <Loader2 className="h-4 w-4 text-primary-purple animate-spin" />
                  <div className="flex-1">
                    <span className="font-bold text-text-primary block text-[11px]">Generating Test Suite cases...</span>
                    <div className="h-1 bg-surface border border-border-color rounded-full overflow-hidden mt-1.5 max-w-sm">
                      <div className="h-full bg-primary-purple rounded-full transition-all duration-300" style={{ width: `${testGenProgress}%` }} />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-primary-purple">{testGenProgress}%</span>
              </div>
            )}

            {/* Accordion List Container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
              
              {/* Category 1: UI Tests */}
              <TestCategory 
                title="UI TESTS" 
                count="8 / 24" 
                tests={uiTests} 
                isCollapsed={collapsedCats.ui} 
                onToggle={() => toggleCat('ui')} 
                getIcon={getStatusIcon}
              />

              {/* Category 2: API Tests */}
              <TestCategory 
                title="API TESTS" 
                count="12 / 36" 
                tests={apiTests} 
                isCollapsed={collapsedCats.api} 
                onToggle={() => toggleCat('api')} 
                getIcon={getStatusIcon}
              />

              {/* Category 3: Database Tests */}
              <TestCategory 
                title="DATABASE TESTS" 
                count="6 / 18" 
                tests={dbTests} 
                isCollapsed={collapsedCats.db} 
                onToggle={() => toggleCat('db')} 
                getIcon={getStatusIcon}
              />

              {/* Category 4: Integration Tests */}
              <TestCategory 
                title="INTEGRATION TESTS" 
                count="4 / 12" 
                tests={intTests} 
                isCollapsed={collapsedCats.integration} 
                onToggle={() => toggleCat('integration')} 
                getIcon={getStatusIcon}
              />

              {/* Category 5: Security Tests */}
              <TestCategory 
                title="SECURITY TESTS" 
                count="3 / 15" 
                tests={secTests} 
                isCollapsed={collapsedCats.security} 
                onToggle={() => toggleCat('security')} 
                getIcon={getStatusIcon}
              />

              {/* Category 6: Performance Tests */}
              <TestCategory 
                title="PERFORMANCE TESTS" 
                count="2 / 8" 
                tests={perfTests} 
                isCollapsed={collapsedCats.performance} 
                onToggle={() => toggleCat('performance')} 
                getIcon={getStatusIcon}
              />

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* Test Category Accordion Component */
const TestCategory: React.FC<{
  title: string;
  count: string;
  tests: any[];
  isCollapsed: boolean;
  onToggle: () => void;
  getIcon: (status: string) => React.ReactNode;
}> = ({ title, count, tests, isCollapsed, onToggle, getIcon }) => {
  return (
    <div className="bg-surface/20 border border-border-color/30 rounded-lg overflow-hidden select-none text-xs">
      <div 
        onClick={onToggle}
        className="px-3 py-2 bg-surface/30 hover:bg-surface/50 border-b border-border-color/25 flex justify-between items-center cursor-pointer transition-colors"
      >
        <div className="flex items-center space-x-2 font-bold text-[10.5px] text-text-primary">
          <span>{title}</span>
          <span className="text-[9px] font-mono text-text-secondary bg-surface px-1.5 py-0.2 rounded border border-border-color">{count}</span>
        </div>
        <div className="flex items-center space-x-2 text-text-secondary">
          <span className="text-[9px] tracking-wider uppercase font-semibold font-mono">Generating...</span>
          {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-2 space-y-1.5 bg-transparent divide-y divide-border-color/10">
          {tests.map(test => (
            <div key={test.id} className="flex justify-between items-center text-[11px] py-1 px-1.5 hover:bg-surface/30 rounded transition-all">
              <div className="flex items-center space-x-2.5 truncate">
                {getIcon(test.status)}
                <span className="text-text-primary truncate font-medium">{test.name}</span>
                {test.env && (
                  <span className="text-[8px] font-mono bg-surface border border-border-color px-1 py-0.2 rounded text-text-secondary uppercase">{test.env}</span>
                )}
              </div>
              <span className={`text-[9.5px] font-mono font-semibold ${
                test.status === 'Generated' ? 'text-success' : test.status === 'Generating' ? 'text-primary-purple' : 'text-text-secondary'
              }`}>
                {test.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
