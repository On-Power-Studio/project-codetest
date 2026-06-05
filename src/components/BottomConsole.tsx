import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Terminal, Database, LineChart, Cpu, BarChart2, ShieldAlert } from 'lucide-react';

export const BottomConsole: React.FC = () => {
  const { 
    activeWorkspace, 
    consoleActiveTab, 
    setConsoleActiveTab, 
    importLogs, 
    analysisLogs,
    importProgress,
    analysisProgress,
    validationLogs,
    agentLogs
  } = useAxiomStore();

  const tabs = [
    { id: 'terminal', label: 'TERMINAL' },
    { id: 'logs', label: activeWorkspace === 'projects' ? 'IMPORT LOGS' : activeWorkspace === 'validation' ? 'EXECUTION LOGS' : 'ANALYSIS LOGS' },
    { id: 'problems', label: 'PROBLEMS (3)' },
    { id: 'output', label: 'OUTPUT' },
    { id: 'debug', label: 'DEBUG CONSOLE' }
  ];

  // Render Workspace 1 Console Details (Project Import - 2.webp)
  const renderProjectsConsole = () => (
    <div className="flex-1 grid grid-cols-12 gap-4 h-full text-xs min-h-0 select-none">
      {/* Left: Raw Logs list */}
      <div className="col-span-4 border-r border-border-color overflow-y-auto pr-2 font-mono text-[10.5px] text-text-secondary leading-normal">
        {importLogs.map((log, idx) => (
          <div key={idx} className="truncate">{log}</div>
        ))}
        {importProgress > 0 && importProgress < 100 && (
          <div className="text-secondary-blue font-semibold animate-pulse">Running Repository scanner...</div>
        )}
      </div>

      {/* Middle: 3D-feeling wireframe Scanning Globe and progress bar */}
      <div className="col-span-5 flex flex-col justify-center items-center px-4 relative">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Neon scan rings */}
          <div className="absolute inset-0 rounded-full border-2 border-primary-purple/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-secondary-blue/40 spin-slow" />
          <div className="absolute inset-4 rounded-full border border-dashed border-primary-purple/50 spin-slow-reverse" />
          <Cpu className="h-8 w-8 text-primary-purple animate-pulse" />
        </div>
        <div className="mt-2 text-center">
          <span className="text-[10px] font-semibold text-text-primary tracking-wide">Analyzing Project Structure</span>
          <p className="text-[9px] text-text-secondary mt-0.5">Scanning files and building dependency graph...</p>
        </div>
        <div className="w-full max-w-xs mt-3 flex items-center space-x-2">
          <div className="flex-1 h-1.5 bg-surface border border-border-color rounded-full overflow-hidden">
            <div className="h-full bg-primary-purple transition-all duration-300" style={{ width: `${importProgress}%` }} />
          </div>
          <span className="text-[10px] font-mono text-text-primary font-bold">{importProgress}%</span>
        </div>
      </div>

      {/* Right: Live stats checklist card */}
      <div className="col-span-3 overflow-y-auto pl-2 font-sans flex flex-col justify-center space-y-1.5 text-[10.5px] text-text-secondary">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Live Statistics</span>
        <div className="flex justify-between"><span>Files Scanned:</span><span className="text-text-primary font-mono">1,245 / 3,842</span></div>
        <div className="flex justify-between"><span>Lines of Code:</span><span className="text-text-primary font-mono">128,456</span></div>
        <div className="flex justify-between"><span>Components Found:</span><span className="text-text-primary font-mono">245</span></div>
        <div className="flex justify-between"><span>APIs Detected:</span><span className="text-text-primary font-mono">156</span></div>
        <div className="flex justify-between"><span>Tables Found:</span><span className="text-text-primary font-mono">12 / 28</span></div>
        <div className="flex justify-between"><span>Dependencies:</span><span className="text-text-primary font-mono">1,243</span></div>
      </div>
    </div>
  );

  // Render Workspace 2 Console Details (Analysis Engine - 3.webp)
  const renderAnalysisConsole = () => (
    <div className="flex-1 grid grid-cols-12 gap-4 h-full text-xs min-h-0 select-none">
      {/* Left: AST Engine Logs */}
      <div className="col-span-4 border-r border-border-color overflow-y-auto pr-2 font-mono text-[10.5px] text-text-secondary leading-normal">
        {analysisLogs.map((log, idx) => (
          <div key={idx} className="truncate">{log}</div>
        ))}
        {analysisProgress > 0 && analysisProgress < 100 && (
          <div className="text-primary-purple font-semibold animate-pulse">[PARSING] Extracting functions...</div>
        )}
      </div>

      {/* Middle: AST Tree node parsing structure preview */}
      <div className="col-span-4 border-r border-border-color overflow-y-auto px-2 font-mono text-[10px] text-text-secondary space-y-1 leading-normal select-text">
        <span className="text-[9px] font-sans font-bold text-text-secondary uppercase tracking-wider block mb-1">AST Tree structure</span>
        <div>Program [0, 342]</div>
        <div className="pl-3 text-secondary-blue">├─ ImportDeclaration [0, 56]</div>
        <div className="pl-6 text-text-secondary">├─ ImportSpecifier [10, 23]</div>
        <div className="pl-3 text-primary-purple">├─ VariableDeclaration [58, 91]</div>
        <div className="pl-6 text-text-secondary">├─ Identifier [62, 68] (stripe)</div>
        <div className="pl-6 text-text-secondary">└─ NewExpression [71, 90]</div>
        <div className="pl-3 text-warning">└─ CallExpression [93, 341]</div>
      </div>

      {/* Right: Dependency Graph (Live) interactive circular node preview */}
      <div className="col-span-4 overflow-hidden pl-2 flex flex-col relative h-full">
        <span className="text-[9px] font-sans font-bold text-text-secondary uppercase tracking-wider block mb-1">Dependency Graph (Live)</span>
        <div className="flex-1 flex items-center justify-center relative">
          {/* Simulated node connector */}
          <div className="absolute h-16 w-16 rounded-full border border-primary-purple/20 animate-pulse" />
          
          {/* Nodes */}
          <div className="absolute bg-primary-purple/25 border border-primary-purple font-mono font-bold text-[8.5px] px-1.5 py-0.5 rounded text-text-primary z-10 glow-purple">route.ts</div>
          
          <div className="absolute text-[8px] text-text-secondary font-mono bg-surface border border-border-color px-1 rounded -translate-x-12 -translate-y-8">auth.ts</div>
          <div className="absolute text-[8px] text-text-secondary font-mono bg-surface border border-border-color px-1 rounded translate-x-12 -translate-y-8">orders</div>
          <div className="absolute text-[8px] text-text-secondary font-mono bg-surface border border-border-color px-1 rounded translate-x-12 translate-y-8">webhook</div>
          <div className="absolute text-[8px] text-text-secondary font-mono bg-surface border border-border-color px-1 rounded -translate-x-12 translate-y-8">utils.ts</div>
          
          {/* Connector lines SVGs */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-40">
            <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="rgba(139,92,246,0.6)" strokeWidth="1" strokeDasharray="3" />
            <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="rgba(139,92,246,0.6)" strokeWidth="1" strokeDasharray="3" />
            <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="rgba(139,92,246,0.6)" strokeWidth="1" strokeDasharray="3" />
            <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="rgba(139,92,246,0.6)" strokeWidth="1" strokeDasharray="3" />
          </svg>
        </div>
      </div>
    </div>
  );

  // Render Workspace 6 Console Details (Validation Center - 7.webp)
  const renderValidationConsole = () => (
    <div className="flex-1 grid grid-cols-12 gap-4 h-full text-xs min-h-0 select-none">
      {/* Left: Bash Terminal Run Output */}
      <div className="col-span-4 border-r border-border-color pr-2 flex flex-col min-h-0 font-mono text-[10.5px] select-text">
        <div className="bg-bg-primary text-text-secondary p-2.5 rounded border border-border-color flex-1 overflow-y-auto leading-normal">
          <div className="text-text-primary">axiom@validation-center:~/workspace$ npm run validate</div>
          <div>&gt; ecommerce-platform@2.0.0 validate</div>
          <div>&gt; node ./bin/validate.js</div>
          <div className="mt-1 text-text-secondary">Starting validation suite...</div>
          <div>Environment: production</div>
          <div>Test Suite: Full Validation</div>
          <div>Parallel Workers: 8</div>
          <div className="mt-1 text-warning">[10:24:25] Initializing test environment...</div>
          <div className="text-success">[10:24:26] Loading test data...</div>
          <div className="text-success">[10:24:27] Starting test execution...</div>
          <div className="text-danger animate-pulse">[10:24:28] Test failed: Payment Processing Test</div>
        </div>
      </div>

      {/* Middle: Rich Execution Logs (Info, Warning, Error) */}
      <div className="col-span-4 border-r border-border-color overflow-y-auto px-2 font-mono text-[10px] space-y-1 leading-normal select-text">
        <span className="text-[9px] font-sans font-bold text-text-secondary uppercase tracking-wider block mb-1">Execution Logs</span>
        {validationLogs.map((log, idx) => (
          <div key={idx} className="flex space-x-2">
            <span className="text-text-secondary shrink-0">{log.time}</span>
            <span className={`font-semibold shrink-0 ${
              log.type === 'SUCCESS' ? 'text-success' : log.type === 'ERROR' ? 'text-danger' : log.type === 'WARN' ? 'text-warning' : 'text-secondary-blue'
            }`}>[{log.type}]</span>
            <span className="text-text-primary">{log.message}</span>
          </div>
        ))}
      </div>

      {/* Right: Performance Metrics graph list */}
      <div className="col-span-4 overflow-hidden pl-2 flex flex-col h-full font-sans">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Performance Metrics</span>
        <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
          <div className="bg-surface/50 border border-border-color rounded p-2 text-center">
            <span className="text-text-secondary block">Avg. Response Time</span>
            <span className="text-base font-bold text-text-primary font-mono mt-0.5 block">892 ms</span>
          </div>
          <div className="bg-surface/50 border border-border-color rounded p-2 text-center">
            <span className="text-text-secondary block">Success Rate</span>
            <span className="text-base font-bold text-success font-mono mt-0.5 block">98.2%</span>
          </div>
        </div>
        
        {/* Simple charts */}
        <div className="flex-1 flex space-x-2 items-end pb-1 h-[40px]">
          <div className="flex-1 bg-surface border border-border-color rounded relative h-full flex items-end overflow-hidden">
            {/* Simple simulated charts bar */}
            <div className="w-[10%] bg-secondary-blue h-[40%] mx-0.5 rounded-t" />
            <div className="w-[10%] bg-secondary-blue h-[60%] mx-0.5 rounded-t animate-pulse" />
            <div className="w-[10%] bg-secondary-blue h-[80%] mx-0.5 rounded-t" />
            <div className="w-[10%] bg-secondary-blue h-[50%] mx-0.5 rounded-t" />
            <div className="w-[10%] bg-secondary-blue h-[30%] mx-0.5 rounded-t" />
            <div className="w-[10%] bg-secondary-blue h-[70%] mx-0.5 rounded-t" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-text-secondary font-mono tracking-wider">THROUGHPUT (128 r/s)</span>
          </div>
          <div className="w-24 bg-surface border border-border-color rounded text-[9px] p-1.5 flex flex-col justify-between h-full font-mono text-text-secondary">
            <div className="flex justify-between"><span>CPU:</span><span className="text-text-primary font-bold">45%</span></div>
            <div className="flex justify-between"><span>MEM:</span><span className="text-text-primary font-bold">2.1 GB</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render default standard terminal view for Explorer, Graph, AI etc.
  const renderDefaultConsole = () => (
    <div className="flex-1 font-mono text-[11px] text-text-secondary bg-bg-primary border border-border-color p-3 rounded-lg overflow-y-auto leading-relaxed select-text">
      {consoleActiveTab === 'logs' && (
        <div className="space-y-0.5">
          <div>10:24:31 [INFO] Graph engine initialized</div>
          <div>10:24:32 [INFO] Loading project: ecommerce-platform</div>
          <div>10:24:33 [PARSER] Tree-sitter parsing started (TypeScript, TSX, JavaScript, JSON)</div>
          <div>10:24:35 [PARSER] Parsed 4,842 files successfully</div>
          <div>10:24:36 [AST] AST generation completed (2.45s)</div>
          <div>10:24:37 [DEPS] Extracting dependencies and imports</div>
          <div>10:24:39 [DEPS] Found 2,341 dependencies</div>
          <div>10:24:40 [GRAPH] Building code intelligence graph</div>
          <div className="text-success">10:24:44 [GRAPH] Created 8,742 nodes</div>
          <div className="text-success">10:24:48 [GRAPH] Created 16,341 relationships</div>
          <div>10:24:50 [ANALYZE] Analyzing architectural patterns</div>
          <div>10:24:52 [ANALYZE] Detected 24 architectural patterns</div>
          <div className="text-success font-semibold">10:24:54 [ANALYZE] Analysis complete - Graph ready</div>
        </div>
      )}
      {consoleActiveTab === 'terminal' && (
        <div>
          <span className="text-success font-bold">axiom@ecommerce-platform:~/workspace$ </span>
          <span className="text-text-primary">git status</span>
          <div className="text-text-secondary mt-1">
            On branch main
            Your branch is up to date with 'origin/main'.
            
            Changes not staged for commit:
              (use "git add &lt;file&gt;..." to update what will be committed)
              (use "git restore &lt;file&gt;..." to discard changes in working directory)
              <span className="text-danger block mt-1">modified:   src/api/orders.controller.ts</span>
            
            no changes added to commit (use "git add" and/or "git commit -a")
          </div>
        </div>
      )}
      {consoleActiveTab === 'problems' && (
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-danger">
            <span className="font-bold shrink-0">[ERROR]</span>
            <span className="text-text-primary font-semibold font-sans">schema.prisma:L42</span>
            <span>- Missing unique constraint on email field in User model.</span>
          </div>
          <div className="flex items-center space-x-2 text-warning">
            <span className="font-bold shrink-0">[WARN]</span>
            <span className="text-text-primary font-semibold font-sans">orders.controller.ts:L114</span>
            <span>- Unhandled rejection possibility on payment process promise.</span>
          </div>
          <div className="flex items-center space-x-2 text-warning">
            <span className="font-bold shrink-0">[WARN]</span>
            <span className="text-text-primary font-semibold font-sans">checkout.spec.ts:L32</span>
            <span>- Deprecated await page.waitForTimeout used, replace with locator assertions.</span>
          </div>
        </div>
      )}
      {consoleActiveTab === 'output' && (
        <div>[System Output Logs] - Webpack / Vite dev server running on http://localhost:5173/ ... Hot Module Reload active.</div>
      )}
      {consoleActiveTab === 'debug' && (
        <div className="text-warning">[Debugger] - Attached to process 8274... debugger listening on port 9229. type 'help' for commands.</div>
      )}
    </div>
  );

  return (
    <div className="h-44 bg-bg-secondary border-t border-border-color flex flex-col p-3 min-h-0 select-none">
      {/* Console Tab selector */}
      <div className="flex items-center space-x-4 border-b border-border-color pb-2 mb-2 bg-surface/10 px-2 rounded">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setConsoleActiveTab(tab.id as any)}
            className={`text-[10px] font-bold tracking-wider hover:text-text-primary transition-colors cursor-pointer ${
              consoleActiveTab === tab.id 
                ? 'text-primary-purple border-b border-primary-purple pb-0.5' 
                : 'text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Panel based on Tab and active workspace */}
      <div className="flex-1 min-h-0 flex flex-col">
        {consoleActiveTab === 'logs' ? (
          activeWorkspace === 'projects' ? renderProjectsConsole() : 
          activeWorkspace === 'analysis' ? renderAnalysisConsole() :
          activeWorkspace === 'validation' ? renderValidationConsole() :
          renderDefaultConsole()
        ) : renderDefaultConsole()}
      </div>
    </div>
  );
};
