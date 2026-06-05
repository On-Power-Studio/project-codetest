import { create } from 'zustand';
import {
  type AIProvider,
  type AIConfig,
  sendAIMessage,
  testAIConnection,
  fetchOllamaModels,
  PROVIDER_DEFAULTS,
  buildSystemPrompt
} from '../services/aiService';

export type WorkspaceType = 
  | 'explorer' 
  | 'projects' 
  | 'analysis'
  | 'graph' 
  | 'ai' 
  | 'tests' 
  | 'validation' 
  | 'coverage' 
  | 'impact' 
  | 'agents' 
  | 'twin'
  | 'settings';

interface LogEntry {
  time: string;
  type: 'INFO' | 'DEBUG' | 'ERROR' | 'WARN' | 'SUCCESS';
  message: string;
}

interface TestItem {
  id: string;
  name: string;
  category: 'ui' | 'api' | 'db' | 'integration' | 'security' | 'performance';
  env?: string;
  status: 'Generated' | 'Generating' | 'Queued';
}

interface DBChange {
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  rows: number;
  time: string;
}

interface ApiCall {
  method: string;
  url: string;
  status: number;
  time: number;
  size: string;
  type: string;
  offset: number; // For rendering timeline positioning
  duration: number; // px width simulation
  color: 'success' | 'warning' | 'danger' | 'info';
}

interface Agent {
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Busy';
  operation: string;
  cpu: number;
  memory: string;
  tasks: number;
}

interface AgentTask {
  id: number;
  priority: number;
  task: string;
  agent: string;
  status: 'In Progress' | 'Queued' | 'Completed';
  progress: number;
  eta: string;
}

interface AxiomState {
  // Navigation & UI Layout
  activeWorkspace: WorkspaceType;
  setActiveWorkspace: (workspace: WorkspaceType) => void;
  selectedFile: string;
  setSelectedFile: (file: string) => void;
  openFiles: string[];
  openFile: (file: string) => void;
  closeFile: (file: string) => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  consoleActiveTab: 'logs' | 'problems' | 'output' | 'debug' | 'terminal';
  setConsoleActiveTab: (tab: 'logs' | 'problems' | 'output' | 'debug' | 'terminal') => void;
  
  // Workspace 1: Project Import Center
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  importStep: number;
  importProgress: number;
  isImporting: boolean;
  importLogs: string[];
  startImport: () => void;
  
  // Workspace 2: Analysis Engine
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisLogs: string[];
  startAnalysis: () => void;
  
  // Workspace 3: Intelligence Graph
  selectedGraphNode: string | null;
  setSelectedGraphNode: (node: string | null) => void;
  graphViewMode: 'architecture' | 'data' | 'request' | 'coverage' | 'risk';
  setGraphViewMode: (mode: 'architecture' | 'data' | 'request' | 'coverage' | 'risk') => void;
  
  // Workspace 4: AI Assistant
  aiMessages: { role: 'user' | 'assistant'; content: string; id: string }[];
  addAiMessage: (role: 'user' | 'assistant', content: string) => void;
  
  // Workspace 5: Test Generation Studio
  isGeneratingTests: boolean;
  testGenProgress: number;
  testsList: TestItem[];
  startGeneratingTests: () => void;
  
  // Workspace 6: Validation Center
  validationRunning: boolean;
  validationProgress: number;
  activeValidationStep: number;
  validationRunStatus: 'Passed' | 'Failed' | 'Running' | 'Idle';
  validationLogs: LogEntry[];
  dbChanges: DBChange[];
  apiCalls: ApiCall[];
  runValidation: (type: 'full' | 'impacted' | 'critical') => void;
  
  // Workspace 8: Impact Analysis
  modifiedCodePath: string;
  setModifiedCodePath: (path: string) => void;
  
  // Workspace 9: Autonomous Agents
  agents: Agent[];
  agentTasks: AgentTask[];
  agentLogs: string[];
  
  // Workspace 10: Digital Twin
  twinLayers: {
    pages: boolean;
    components: boolean;
    apis: boolean;
    services: boolean;
    databases: boolean;
    tests: boolean;
    traffic: boolean;
    risks: boolean;
    coverage: boolean;
  };
  toggleTwinLayer: (layer: keyof AxiomState['twinLayers']) => void;
  twinPreset: 'overview' | 'risk' | 'traffic' | 'coverage' | 'dependency' | 'prediction';
  setTwinPreset: (preset: AxiomState['twinPreset']) => void;

  // AI settings
  aiProvider: AIProvider;
  aiApiKey: string;
  aiModel: string;
  aiBaseUrl: string;
  aiConnected: boolean;
  aiConnecting: boolean;
  aiLatencyMs?: number;
  aiConnectionError?: string;
  showAiSettings: boolean;
  setAiProvider: (provider: AIProvider) => void;
  setAiApiKey: (key: string) => void;
  setAiModel: (model: string) => void;
  setAiBaseUrl: (url: string) => void;
  setShowAiSettings: (open: boolean) => void;
  testConnection: () => Promise<void>;
  ollamaModels: string[];
  loadOllamaModels: () => Promise<void>;

  // Pipeline state
  importedProject: {
    name: string;
    owner: string;
    url: string;
    frameworks: string[];
    files: number;
    lines: number;
    structure: any;
  } | null;
  analysisResult: {
    nodes: any[];
    edges: any[];
    riskAreas: string[];
    coverageGaps: string[];
    complexity: number;
  } | null;
  generatedTests: any[];
  aiStreaming: boolean;
  aiStreamContent: string;
}

export const useAxiomStore = create<AxiomState>((set, get) => ({
  // Navigation & UI Layout
  activeWorkspace: 'projects', // Start at projects so the user imports first!
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),
  selectedFile: 'checkout.spec.ts',
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  openFiles: ['checkout.spec.ts', 'orders.controller.ts', 'schema.prisma'],
  openFile: (file) => set((state) => ({
    openFiles: state.openFiles.includes(file) ? state.openFiles : [...state.openFiles, file],
    selectedFile: file
  })),
  closeFile: (file) => set((state) => {
    const filtered = state.openFiles.filter((f) => f !== file);
    return {
      openFiles: filtered,
      selectedFile: state.selectedFile === file ? (filtered[filtered.length - 1] || '') : state.selectedFile
    };
  }),
  leftSidebarOpen: true,
  setLeftSidebarOpen: (leftSidebarOpen) => set({ leftSidebarOpen }),
  consoleActiveTab: 'logs',
  setConsoleActiveTab: (consoleActiveTab) => set({ consoleActiveTab }),

  // Workspace 1: Project Import Center
  repoUrl: 'https://github.com/your-org/ecommerce-platform',
  setRepoUrl: (repoUrl) => set({ repoUrl }),
  importStep: 1,
  importProgress: 0,
  isImporting: false,
  importLogs: [],
  startImport: () => {
    set({ isImporting: true, importProgress: 0, importStep: 1, importLogs: ['[INFO] Connecting to GitHub repository...'] });
    
    // Simulate GitHub import sequence
    const intervals = [
      { t: 800, p: 15, step: 1, log: '[INFO] Repository connection successful.' },
      { t: 1500, p: 32, step: 2, log: '[INFO] Fetching repository metadata... cloning repository...' },
      { t: 2500, p: 55, step: 2, log: '[INFO] Repository cloned successfully.' },
      { t: 3200, p: 75, step: 3, log: '[INFO] Running framework detection... Next.js, React, Express, PostgreSQL detected.' },
      { t: 4000, p: 90, step: 4, log: '[INFO] Building file trees, parsing dependencies...' },
      { t: 4800, p: 100, step: 4, log: '[INFO] Project successfully imported. Ready for full codebase analysis.' }
    ];
    
    intervals.forEach(({ t, p, step, log }) => {
      setTimeout(() => {
        set((state) => ({
          importProgress: p,
          importStep: step,
          importLogs: [...state.importLogs, log],
          isImporting: p < 100
        }));
        
        if (p === 100) {
          let owner = 'your-org';
          let name = 'ecommerce-platform';
          try {
            const urlObj = new URL(get().repoUrl);
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
              owner = pathParts[0];
              name = pathParts[1].replace(/\.git$/, '');
            }
          } catch {}

          set({
            importedProject: {
              name,
              owner,
              url: get().repoUrl,
              frameworks: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
              files: 1245,
              lines: 128456,
              structure: {
                frontend: { files: 245, pages: 86, components: 128, utils: 31 },
                backend: { files: 612, controllers: 54, services: 79, routes: 18 },
                database: { files: 156 }
              }
            }
          });

          // Switch to Analysis Engine automatically!
          setTimeout(() => {
            set({ activeWorkspace: 'analysis' });
            get().startAnalysis();
          }, 1000);
        }
      }, t);
    });
  },

  // Workspace 2: Analysis Engine
  isAnalyzing: false,
  analysisProgress: 0,
  analysisLogs: [],
  startAnalysis: () => {
    set({ isAnalyzing: true, analysisProgress: 0, analysisLogs: ['[INFO] Initializing AXIOM Analysis Engine v2.0.0...'] });
    
    const logs = [
      { t: 500, p: 10, log: '[INFO] Connecting to project: ecommerce-platform' },
      { t: 1000, p: 24, log: '[PARSER] Tree-sitter parsing started (TypeScript, TSX, JavaScript, JSON)' },
      { t: 1600, p: 38, log: '[PARSER] Parsed 4,842 files successfully.' },
      { t: 2200, p: 52, log: '[AST] Generating Abstract Syntax Trees (AST) for 128,456 lines of code...' },
      { t: 2800, p: 68, log: '[DEPS] Extracting imports, exports, and function calls...' },
      { t: 3400, p: 78, log: '[GRAPH] Building software architecture intelligence graph...' },
      { t: 4000, p: 88, log: '[ANALYZE] Running pattern detection: authentication flow (98%), checkout flow (95%).' },
      { t: 4600, p: 100, log: '[ANALYZE] Analysis complete. 8,742 dependencies mapped.' }
    ];
    
    logs.forEach(({ t, p, log }) => {
      setTimeout(() => {
        set((state) => ({
          analysisProgress: p,
          analysisLogs: [...state.analysisLogs, log],
          isAnalyzing: p < 100
        }));
        
        if (p === 100) {
          // Switch to Graph
          setTimeout(() => {
            set({ activeWorkspace: 'graph' });
          }, 1200);
        }
      }, t);
    });
  },

  // Workspace 3: Intelligence Graph
  selectedGraphNode: 'CheckoutForm',
  setSelectedGraphNode: (selectedGraphNode) => set({ selectedGraphNode }),
  graphViewMode: 'architecture',
  setGraphViewMode: (graphViewMode) => set({ graphViewMode }),

  // Workspace 4: AI Assistant
  aiMessages: [
    { id: '1', role: 'user', content: 'Explain the checkout flow end to end' },
    { id: '2', role: 'assistant', content: "I'll analyze the checkout flow for you. Here's the complete breakdown:\n\n### Checkout Flow Overview\nThe checkout process involves 6 main steps from UI interaction to database persistence:\n1. User fills checkout form.\n2. System validates cart and inventory.\n3. Payment is processed securely (via Stripe API).\n4. Order is created in PostgreSQL database.\n5. Inventory is updated.\n6. Order confirmation email is sent via SendGrid.\n\nYou can click on any component in the **Intelligence Graph** to inspect its specific APIs, variables, and test coverages." }
  ],
  addAiMessage: (role, content) => set((state) => ({
    aiMessages: [...state.aiMessages, { id: String(Date.now()), role, content }]
  })),

  // Workspace 5: Test Generation Studio
  isGeneratingTests: false,
  testGenProgress: 0,
  testsList: [
    { id: 'ui-1', name: 'Login Flow - Valid Credentials', category: 'ui', env: 'chromium', status: 'Generating' },
    { id: 'ui-2', name: 'Add Product to Cart', category: 'ui', env: 'firefox', status: 'Generated' },
    { id: 'ui-3', name: 'Checkout Process - Guest User', category: 'ui', env: 'webkit', status: 'Generated' },
    { id: 'ui-4', name: 'Responsive Navigation Menu', category: 'ui', env: 'chromium', status: 'Generated' },
    
    { id: 'api-1', name: 'POST /api/auth/login - Valid User', category: 'api', status: 'Generated' },
    { id: 'api-2', name: 'GET /api/products - List All', category: 'api', status: 'Generated' },
    { id: 'api-3', name: 'POST /api/orders - Create Order', category: 'api', status: 'Generating' },
    { id: 'api-4', name: 'POST /api/payments - Process Payment', category: 'api', status: 'Queued' },
    
    { id: 'db-1', name: 'Users Table - CRUD Operations', category: 'db', status: 'Generated' },
    { id: 'db-2', name: 'Orders Table - Data Integrity', category: 'db', status: 'Generating' },
    { id: 'db-3', name: 'Transactions - ACID Compliance', category: 'db', status: 'Queued' },
    
    { id: 'int-1', name: 'User Registration End-to-End', category: 'integration', status: 'Generating' },
    { id: 'int-2', name: 'Order to Payment Flow', category: 'integration', status: 'Queued' },
    
    { id: 'sec-1', name: 'SQL Injection - Login', category: 'security', status: 'Generated' },
    { id: 'sec-2', name: 'XSS Protection - Search', category: 'security', status: 'Generating' },
    { id: 'sec-3', name: 'Authentication Bypass - IDOR', category: 'security', status: 'Queued' },
    
    { id: 'perf-1', name: 'Load Test - 1000 Users', category: 'performance', status: 'Queued' },
    { id: 'perf-2', name: 'API Response Time - P95', category: 'performance', status: 'Queued' }
  ],
  startGeneratingTests: () => {
    set({ isGeneratingTests: true, testGenProgress: 0 });
    
    const interval = setInterval(() => {
      set((state) => {
        const nextProgress = state.testGenProgress + 5;
        if (nextProgress >= 100) {
          clearInterval(interval);
          
          // Set all to generated
          const updated = state.testsList.map(t => ({ ...t, status: 'Generated' as const }));
          return { testGenProgress: 100, isGeneratingTests: false, testsList: updated };
        }
        
        // Randomly update some test statuses
        const updated = state.testsList.map((t) => {
          if (t.status === 'Queued' && Math.random() > 0.7) {
            return { ...t, status: 'Generating' as const };
          }
          if (t.status === 'Generating' && Math.random() > 0.6) {
            return { ...t, status: 'Generated' as const };
          }
          return t;
        });
        
        return { testGenProgress: nextProgress, testsList: updated };
      });
    }, 300);
  },

  // Workspace 6: Validation Center
  validationRunning: false,
  validationProgress: 0,
  activeValidationStep: 1,
  validationRunStatus: 'Idle',
  validationLogs: [],
  dbChanges: [],
  apiCalls: [],
  runValidation: (_type) => {
    set({ 
      validationRunning: true, 
      validationProgress: 0, 
      activeValidationStep: 1, 
      validationRunStatus: 'Running',
      validationLogs: [
        { time: '10:24:25', type: 'INFO' as const, message: 'Test suite started: Full Validation' },
        { time: '10:24:25', type: 'INFO' as const, message: 'Parallel Workers initialized: 8' },
        { time: '10:24:26', type: 'INFO' as const, message: 'Connecting to headless chromium...' }
      ],
      dbChanges: [],
      apiCalls: []
    });

    const timeline = [
      { 
        t: 600, 
        step: 2, 
        log: { time: '10:24:26', type: 'SUCCESS' as const, message: 'Navigate to /checkout' },
        api: { method: 'POST', url: '/api/auth/login', status: 200, time: 120, size: '1.2 KB', type: 'fetch', offset: 5, duration: 35, color: 'success' as const }
      },
      { 
        t: 1200, 
        step: 3, 
        log: { time: '10:24:27', type: 'SUCCESS' as const, message: 'Validate cart items' },
        api: { method: 'GET', url: '/api/products', status: 200, time: 98, size: '24.5 KB', type: 'fetch', offset: 12, duration: 25, color: 'success' as const }
      },
      { 
        t: 1800, 
        step: 4, 
        log: { time: '10:24:27', type: 'SUCCESS' as const, message: 'Enter shipping information' },
        api: { method: 'GET', url: '/api/cart', status: 200, time: 85, size: '1.8 KB', type: 'fetch', offset: 18, duration: 20, color: 'success' as const }
      },
      { 
        t: 2400, 
        step: 5, 
        log: { time: '10:24:28', type: 'SUCCESS' as const, message: 'Select payment method' },
        api: { method: 'POST', url: '/api/orders', status: 201, time: 234, size: '2.1 KB', type: 'fetch', offset: 25, duration: 60, color: 'success' as const },
        db: { table: 'orders', operation: 'INSERT' as const, rows: 1, time: '10:24:28' }
      },
      { 
        t: 3000, 
        step: 5, 
        log: { time: '10:24:28', type: 'ERROR' as const, message: 'Error: Payment processing failed due to insufficient inventory validation in concurrent checkout scenario.' },
        api: { method: 'POST', url: '/api/payments', status: 500, time: 456, size: '156 B', type: 'fetch', offset: 40, duration: 90, color: 'danger' as const },
        db: { table: 'payments', operation: 'INSERT' as const, rows: 1, time: '10:24:28' }
      },
      { 
        t: 3600, 
        step: 5, 
        log: { time: '10:24:29', type: 'WARN' as const, message: 'Retrying Payment Processing...' },
        db: { table: 'inventory', operation: 'UPDATE' as const, rows: 2, time: '10:24:28' }
      },
      { 
        t: 4200, 
        step: 5, 
        log: { time: '10:24:29', type: 'ERROR' as const, message: 'Test suite validation halted: Order Confirmation Test Failed.' },
        db: { table: 'audit_logs', operation: 'INSERT' as const, rows: 1, time: '10:24:29' }
      }
    ];

    timeline.forEach(({ t, step, log, api, db }) => {
      setTimeout(() => {
        set((state) => {
          const newLogs = [...state.validationLogs, log];
          const newApis = api ? [...state.apiCalls, api] : state.apiCalls;
          const newDbs = db ? [...state.dbChanges, db] : state.dbChanges;
          const progress = Math.min(Math.round((t / 4200) * 100), 100);
          
          return {
            validationProgress: progress,
            activeValidationStep: step,
            validationLogs: newLogs,
            apiCalls: newApis,
            dbChanges: newDbs,
            validationRunStatus: progress === 100 ? 'Failed' : 'Running',
            validationRunning: progress < 100
          };
        });
      }, t);
    });
  },

  // Workspace 8: Impact Analysis
  modifiedCodePath: 'src/api/orders.controller.ts',
  setModifiedCodePath: (modifiedCodePath) => set({ modifiedCodePath }),

  // Workspace 9: Autonomous Agents
  agents: [
    { name: 'Code Analyzer', role: 'Deep code analysis', status: 'Active', operation: 'Analyzing /api/orders changes', cpu: 45, memory: '1.2 GB', tasks: 12 },
    { name: 'Architecture Agent', role: 'System architecture analysis', status: 'Active', operation: 'Evaluating system impact', cpu: 32, memory: '892 MB', tasks: 8 },
    { name: 'Test Generator', role: 'Intelligent test generation', status: 'Active', operation: 'Generating payment tests', cpu: 68, memory: '1.8 GB', tasks: 15 },
    { name: 'Execution Agent', role: 'Test execution & validation', status: 'Active', operation: 'Running integration tests', cpu: 72, memory: '2.1 GB', tasks: 18 },
    { name: 'Root Cause Agent', role: 'Failure analysis & RCA', status: 'Active', operation: 'Analyzing test failures', cpu: 55, memory: '1.4 GB', tasks: 10 },
    { name: 'Coverage Agent', role: 'Coverage analysis & gaps', status: 'Active', operation: 'Calculating coverage gaps', cpu: 28, memory: '756 MB', tasks: 6 }
  ],
  agentTasks: [
    { id: 1, priority: 1, task: 'Analyze order payment flow', agent: 'Code Analyzer', status: 'In Progress', progress: 75, eta: '2m 34s' },
    { id: 2, priority: 2, task: 'Generate tests for checkout', agent: 'Test Generator', status: 'In Progress', progress: 60, eta: '3m 12s' },
    { id: 3, priority: 3, task: 'Execute payment integration tests', agent: 'Execution Agent', status: 'In Progress', progress: 90, eta: '1m 45s' },
    { id: 4, priority: 4, task: 'Analyze test failures', agent: 'Root Cause Agent', status: 'Queued', progress: 0, eta: '5m 20s' },
    { id: 5, priority: 5, task: 'Update coverage analysis', agent: 'Coverage Agent', status: 'In Progress', progress: 45, eta: '2m 15s' },
    { id: 6, priority: 6, task: 'Review architecture impact', agent: 'Architecture Agent', status: 'Queued', progress: 0, eta: '3m 45s' },
    { id: 7, priority: 7, task: 'Security vulnerability scan', agent: 'Code Analyzer', status: 'Queued', progress: 0, eta: '4m 30s' },
    { id: 8, priority: 8, task: 'Performance regression tests', agent: 'Execution Agent', status: 'Queued', progress: 0, eta: '6m 10s' }
  ],
  agentLogs: [
    '10:24:28 [Test Generator -> Execution Agent] Task delegation: Execute 24 generated tests [Success]',
    '10:24:27 [Code Analyzer -> Architecture Agent] Impact analysis: 3 files modified, high impact detected [Success]',
    '10:24:26 [Execution Agent -> Root Cause Agent] Failure analysis request: 2 test failures detected [Success]',
    '10:24:25 [Coverage Agent -> Test Generator] Coverage gap detected: 15% in payment module [Success]',
    '10:24:24 [Architecture Agent -> All Agents] System architecture updated, sync required [Success]'
  ],

  // Workspace 10: Digital Twin
  twinLayers: {
    pages: true,
    components: true,
    apis: true,
    services: true,
    databases: true,
    tests: true,
    traffic: true,
    risks: true,
    coverage: true
  },
  toggleTwinLayer: (layer) => set((state) => ({
    twinLayers: {
      ...state.twinLayers,
      [layer]: !state.twinLayers[layer]
    }
  })),
  twinPreset: 'overview',
  setTwinPreset: (twinPreset) => set({ twinPreset }),

  // AI settings
  aiProvider: (localStorage.getItem('axiom_ai_provider') || 'openai') as AIProvider,
  aiApiKey: localStorage.getItem('axiom_ai_key') || '',
  aiModel: localStorage.getItem('axiom_ai_model') || PROVIDER_DEFAULTS[(localStorage.getItem('axiom_ai_provider') || 'openai') as AIProvider]?.model || '',
  aiBaseUrl: localStorage.getItem('axiom_ai_url') || PROVIDER_DEFAULTS[(localStorage.getItem('axiom_ai_provider') || 'openai') as AIProvider]?.baseUrl || '',
  aiConnected: localStorage.getItem('axiom_ai_connected') === 'true',
  aiConnecting: false,
  aiLatencyMs: undefined,
  aiConnectionError: undefined,
  showAiSettings: false,
  ollamaModels: [],

  setAiProvider: (provider) => {
    localStorage.setItem('axiom_ai_provider', provider);
    const defaults = PROVIDER_DEFAULTS[provider] || {};
    const model = defaults.model || '';
    const baseUrl = defaults.baseUrl || '';
    localStorage.setItem('axiom_ai_model', model);
    localStorage.setItem('axiom_ai_url', baseUrl);
    set({ 
      aiProvider: provider, 
      aiModel: model, 
      aiBaseUrl: baseUrl, 
      aiConnected: false,
      aiLatencyMs: undefined,
      aiConnectionError: undefined 
    });
    if (provider === 'ollama') {
      get().loadOllamaModels();
    }
  },

  setAiApiKey: (key) => {
    localStorage.setItem('axiom_ai_key', key);
    set({ aiApiKey: key, aiConnected: false });
  },

  setAiModel: (model) => {
    localStorage.setItem('axiom_ai_model', model);
    set({ aiModel: model, aiConnected: false });
  },

  setAiBaseUrl: (url) => {
    localStorage.setItem('axiom_ai_url', url);
    set({ aiBaseUrl: url, aiConnected: false });
    if (get().aiProvider === 'ollama') {
      get().loadOllamaModels();
    }
  },

  setShowAiSettings: (open) => set({ showAiSettings: open }),

  testConnection: async () => {
    set({ aiConnecting: true, aiConnectionError: undefined });
    const config: AIConfig = {
      provider: get().aiProvider,
      apiKey: get().aiApiKey,
      model: get().aiModel,
      baseUrl: get().aiBaseUrl,
    };
    const res = await testAIConnection(config);
    if (res.ok) {
      localStorage.setItem('axiom_ai_connected', 'true');
      set({ 
        aiConnected: true, 
        aiConnecting: false, 
        aiLatencyMs: res.latencyMs, 
        aiConnectionError: undefined 
      });
    } else {
      localStorage.setItem('axiom_ai_connected', 'false');
      set({ 
        aiConnected: false, 
        aiConnecting: false, 
        aiLatencyMs: undefined, 
        aiConnectionError: res.error || 'Connection test failed' 
      });
    }
  },

  loadOllamaModels: async () => {
    const models = await fetchOllamaModels(get().aiBaseUrl);
    set({ ollamaModels: models });
    if (models.length > 0 && !models.includes(get().aiModel)) {
      set({ aiModel: models[0] });
    }
  },

  // Pipeline state
  importedProject: null,
  analysisResult: null,
  generatedTests: [],
  aiStreaming: false,
  aiStreamContent: '',
}));
