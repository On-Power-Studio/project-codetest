import React, { useState, useEffect } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  Play, Search, ChevronDown, ChevronUp, CheckCircle, 
  Loader2, Code, Terminal, Clipboard, Check, Sparkles, Settings
} from 'lucide-react';
import { sendAIMessage } from '../services/aiService';

// Default code templates if offline
const CODE_TEMPLATES: Record<string, string> = {
  'ui-1': `import { test, expect } from '@playwright/test';\n\ntest('Login Flow - Valid Credentials', async ({ page }) => {\n  await page.goto('/login');\n  await page.fill('input[name="email"]', 'admin@axiom.ai');\n  await page.fill('input[name="password"]', 'SuperSecretPassword123');\n  await page.click('button[type="submit"]');\n  \n  await expect(page).toHaveURL('/dashboard');\n  await expect(page.locator('.user-profile-name')).toContainText('Administrator');\n});`,
  'ui-2': `import { test, expect } from '@playwright/test';\n\ntest('Add Product to Cart', async ({ page }) => {\n  await page.goto('/products/axiom-twin-sensor');\n  await page.click('button.add-to-cart');\n  \n  const cartBadge = page.locator('.cart-count-badge');\n  await expect(cartBadge).toHaveText('1');\n  \n  await page.click('.cart-icon');\n  await expect(page.locator('.cart-item-title')).toContainText('Axiom Twin Sensor');\n});`,
  'ui-3': `import { test, expect } from '@playwright/test';\n\ntest('Checkout Process - Guest User', async ({ page }) => {\n  await page.goto('/checkout');\n  await page.fill('#shipping-first-name', 'Maria');\n  await page.fill('#shipping-last-name', 'Jones');\n  await page.fill('#shipping-address', '100 Cyber Road');\n  await page.click('button.proceed-to-payment');\n  \n  const paymentSection = page.locator('#stripe-card-element');\n  await expect(paymentSection).toBeVisible();\n});`,
  'api-1': `import request from 'supertest';\nimport app from '../app';\n\ndescribe('POST /api/auth/login', () => {\n  it('should authenticate user and return jwt token', async () => {\n    const res = await request(app)\n      .post('/api/auth/login')\n      .send({\n        email: 'test@axiom.ai',\n        password: 'Password123'\n      });\n    expect(res.statusCode).toEqual(200);\n    expect(res.body).toHaveProperty('token');\n  });\n});`,
  'api-2': `import request from 'supertest';\nimport app from '../app';\n\ndescribe('GET /api/products', () => {\n  it('should return paginated products list', async () => {\n    const res = await request(app).get('/api/products?page=1&limit=10');\n    expect(res.statusCode).toEqual(200);\n    expect(res.body.data).toBeInstanceOf(Array);\n    expect(res.body.data.length).toBeLessThanOrEqual(10);\n  });\n});`,
  'api-3': `import request from 'supertest';\nimport app from '../app';\n\ndescribe('POST /api/orders', () => {\n  it('should create order and deduct inventory', async () => {\n    const res = await request(app)\n      .post('/api/orders')\n      .send({\n        items: [{ id: 'prod-102', qty: 2 }],\n        couponCode: 'WELCOME20'\n      });\n    expect(res.statusCode).toEqual(201);\n    expect(res.body.orderId).toBeDefined();\n  });\n});`
};

export const Workspace5_TestGeneration: React.FC = () => {
  const { 
    isGeneratingTests, 
    testGenProgress, 
    testsList, 
    startGeneratingTests,
    aiConnected,
    aiProvider,
    aiApiKey,
    aiModel,
    aiBaseUrl,
    setShowAiSettings
  } = useAxiomStore();

  const [searchVal, setSearchVal] = useState('');
  const [selectedTestId, setSelectedTestId] = useState<string>('ui-1');
  const [testCodeMap, setTestCodeMap] = useState<Record<string, string>>(CODE_TEMPLATES);
  const [isStreamingCode, setIsStreamingCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Collapse state for categories
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({
    'ui': false,
    'api': false,
    'db': true,
    'integration': true,
    'security': true,
    'performance': true
  });

  const toggleCat = (cat: string) => {
    setCollapsedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group tests
  const filteredTests = testsList.filter(t => 
    t.name.toLowerCase().includes(searchVal.toLowerCase()) || 
    t.category.toLowerCase().includes(searchVal.toLowerCase())
  );

  const uiTests = filteredTests.filter(t => t.category === 'ui');
  const apiTests = filteredTests.filter(t => t.category === 'api');
  const dbTests = filteredTests.filter(t => t.category === 'db');
  const intTests = filteredTests.filter(t => t.category === 'integration');
  const secTests = filteredTests.filter(t => t.category === 'security');
  const perfTests = filteredTests.filter(t => t.category === 'performance');

  const getStatusIcon = (status: string) => {
    if (status === 'Generated') return <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />;
    if (status === 'Generating') return <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin shrink-0" />;
    return <div className="h-2 w-2 rounded-full bg-slate-700 mx-1 shrink-0" />;
  };

  const handleCopyCode = () => {
    const code = testCodeMap[selectedTestId] || '// No code generated yet';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateSingleTest = async (testId: string) => {
    const testItem = testsList.find(t => t.id === testId);
    if (!testItem) return;

    setIsStreamingCode(true);
    setTestCodeMap(prev => ({ ...prev, [testId]: '' }));

    if (!aiConnected) {
      // Stream mock code template
      const template = CODE_TEMPLATES[testId] || `// Generated test for: ${testItem.name}\n// Framework: Jest/Vitest\n\ndescribe('${testItem.name}', () => {\n  it('executes verification routine', () => {\n    expect(true).toBe(true);\n  });\n});`;
      
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < template.length) {
          setTestCodeMap(prev => ({
            ...prev,
            [testId]: prev[testId] + template.charAt(currentIdx)
          }));
          currentIdx += 8;
        } else {
          clearInterval(interval);
          setIsStreamingCode(false);
        }
      }, 15);
      return;
    }

    // Call real AI
    try {
      let prompt = `Write a clean TypeScript test file for the feature: "${testItem.name}" in category "${testItem.category}".
Make it a real, production-ready, beautiful test block.`;
      
      if (testItem.category === 'ui') {
        prompt += ' Use Playwright test format. Add descriptive step-by-step actions and assertions.';
      } else if (testItem.category === 'api') {
        prompt += ' Use Supertest and Jest syntax. Setup mock endpoints and check responses.';
      } else {
        prompt += ' Use Jest/Vitest. Include mocks where needed.';
      }

      prompt += ' Respond ONLY with the TypeScript code, do not write markdown blocks or explanations.';

      await sendAIMessage(
        [
          { role: 'system', content: 'You are an automated testing assistant. Output test scripts only.' },
          { role: 'user', content: prompt }
        ],
        {
          provider: aiProvider,
          apiKey: aiApiKey,
          model: aiModel,
          baseUrl: aiBaseUrl
        },
        {
          onChunk: (chunk) => {
            setTestCodeMap(prev => ({
              ...prev,
              [testId]: (prev[testId] || '') + chunk
            }));
          },
          onDone: (full) => {
            // Clean markdown wrap if AI returned it
            const cleaned = full.replace(/```typescript\n|```js\n|```javascript\n|```/g, '');
            setTestCodeMap(prev => ({ ...prev, [testId]: cleaned }));
            setIsStreamingCode(false);
          },
          onError: (err) => {
            setTestCodeMap(prev => ({ ...prev, [testId]: `// Error generating code: ${err}` }));
            setIsStreamingCode(false);
          }
        }
      );
    } catch (err: any) {
      setTestCodeMap(prev => ({ ...prev, [testId]: `// Connection error: ${err.message}` }));
      setIsStreamingCode(false);
    }
  };

  const handleTestClick = (id: string) => {
    setSelectedTestId(id);
    if (!testCodeMap[id]) {
      generateSingleTest(id);
    }
  };

  return (
    <div className="flex-1 bg-[#02050b] p-5 overflow-hidden flex flex-col font-sans h-full min-h-0 select-none relative">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      {/* Workspace Header */}
      <div className="border-b border-cyan-500/20 pb-3 mb-4 flex justify-between items-center z-20">
        <div>
          <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Code className="h-5 w-5 text-cyan-400" /> Test Generation Studio
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            AUTOMATED SUITE BUILDER — CORE: {aiConnected ? `${aiProvider.toUpperCase()} (${aiModel})` : 'MOCK ENGINE'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {!aiConnected && (
            <button
              onClick={() => setShowAiSettings(true)}
              className="bg-amber-500/10 border border-amber-500/40 text-amber-500 text-[10px] font-bold font-mono tracking-widest py-1.5 px-3 rounded flex items-center space-x-1.5 cursor-pointer hover:bg-amber-500/20"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>CONFIGURE_AI_CORE</span>
            </button>
          )}

          {!isGeneratingTests && testGenProgress < 100 && (
            <button
              onClick={startGeneratingTests}
              className="bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-400 text-xs font-bold font-mono tracking-widest py-1.5 px-4 rounded border border-cyan-500/40 flex items-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            >
              <Play className="h-3 w-3 fill-cyan-400 text-cyan-400" />
              <span>RUN_GENERATOR</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Application Graph (Left), Test List (Center), Code editor (Right) */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 z-20">
        
        {/* Left Column: Application Graph */}
        <div className="col-span-3 bg-[#050b18]/85 border border-cyan-500/10 rounded-xl p-3.5 flex flex-col justify-between min-h-0">
          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">Service Topology Map</span>
          
          <div className="flex-1 relative flex items-center justify-center min-h-[200px] bg-[#02050b] border border-cyan-500/5 rounded-lg overflow-hidden">
            <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20">
              <line x1="50%" y1="12%" x2="25%" y2="30%" stroke="#06B6D4" strokeWidth="1.5" />
              <line x1="50%" y1="12%" x2="75%" y2="30%" stroke="#06B6D4" strokeWidth="1.5" />
              <line x1="25%" y1="30%" x2="16%" y2="50%" stroke="#06B6D4" strokeWidth="1.5" />
              <line x1="25%" y1="30%" x2="50%" y2="50%" stroke="#06B6D4" strokeWidth="1.5" />
              <line x1="75%" y1="30%" x2="50%" y2="50%" stroke="#06B6D4" strokeWidth="1.5" />
              <line x1="75%" y1="30%" x2="84%" y2="50%" stroke="#06B6D4" strokeWidth="1.5" />
            </svg>

            {/* Topology Labels */}
            <div className="absolute top-[8%] bg-[#050b18] border border-cyan-400 rounded px-2 py-0.5 font-bold text-[8px] text-cyan-400 font-mono">WEB_FRONTEND</div>
            
            <div className="absolute top-[28%] left-[5%] bg-[#050b18] border border-purple-500/50 rounded px-1.5 py-0.5 text-[8px] text-purple-400 font-mono">AUTH_SVC</div>
            <div className="absolute top-[28%] right-[5%] bg-[#050b18] border border-purple-500/50 rounded px-1.5 py-0.5 text-[8px] text-purple-400 font-mono">USER_SVC</div>

            <div className="absolute top-[48%] left-[2%] bg-[#050b18] border border-cyan-500/30 rounded px-1.5 py-0.5 text-[8px] text-slate-400 font-mono">PROD_SVC</div>
            <div className="absolute top-[48%] left-[36%] bg-[#050b18] border border-cyan-500/30 rounded px-1.5 py-0.5 text-[8px] text-slate-400 font-mono font-bold">ORDER_SVC</div>
            <div className="absolute top-[48%] right-[2%] bg-[#050b18] border border-cyan-500/30 rounded px-1.5 py-0.5 text-[8px] text-slate-400 font-mono">PAY_SVC</div>
          </div>

          <div className="mt-2 text-[8px] text-slate-500 border-t border-cyan-500/10 pt-2 font-mono">
            Topology feeds automatically into the test framework parameters.
          </div>
        </div>

        {/* Center Column: Generated Tests Lists */}
        <div className="col-span-4 bg-[#050b18]/85 border border-cyan-500/10 rounded-xl p-3.5 flex flex-col justify-between min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search tool */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">Test Telemetry Case List</span>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Filter cases..."
                  className="bg-[#03070f] border border-cyan-500/15 rounded px-2.5 pl-6 py-0.5 text-[9.5px] text-white focus:outline-none w-28 font-mono"
                />
              </div>
            </div>

            {/* Total Test Progress Bar */}
            {isGeneratingTests && (
              <div className="bg-cyan-500/5 border border-cyan-500/25 p-2 rounded mb-2 text-[10px]">
                <div className="flex justify-between font-mono mb-1 text-cyan-400">
                  <span>GENERATING...</span>
                  <span>{testGenProgress}%</span>
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${testGenProgress}%` }} />
                </div>
              </div>
            )}

            {/* Accordion container */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0 scrollbar-thin">
              <TestCategory 
                title="UI TESTS" 
                count={`${uiTests.filter(t => t.status === 'Generated').length}/${uiTests.length}`}
                tests={uiTests} 
                isCollapsed={collapsedCats.ui} 
                onToggle={() => toggleCat('ui')} 
                getIcon={getStatusIcon}
                selectedId={selectedTestId}
                onSelect={handleTestClick}
              />
              <TestCategory 
                title="API TESTS" 
                count={`${apiTests.filter(t => t.status === 'Generated').length}/${apiTests.length}`}
                tests={apiTests} 
                isCollapsed={collapsedCats.api} 
                onToggle={() => toggleCat('api')} 
                getIcon={getStatusIcon}
                selectedId={selectedTestId}
                onSelect={handleTestClick}
              />
              <TestCategory 
                title="DATABASE TESTS" 
                count={`${dbTests.filter(t => t.status === 'Generated').length}/${dbTests.length}`}
                tests={dbTests} 
                isCollapsed={collapsedCats.db} 
                onToggle={() => toggleCat('db')} 
                getIcon={getStatusIcon}
                selectedId={selectedTestId}
                onSelect={handleTestClick}
              />
              <TestCategory 
                title="INTEGRATION TESTS" 
                count={`${intTests.filter(t => t.status === 'Generated').length}/${intTests.length}`}
                tests={intTests} 
                isCollapsed={collapsedCats.integration} 
                onToggle={() => toggleCat('integration')} 
                getIcon={getStatusIcon}
                selectedId={selectedTestId}
                onSelect={handleTestClick}
              />
              <TestCategory 
                title="SECURITY TESTS" 
                count={`${secTests.filter(t => t.status === 'Generated').length}/${secTests.length}`}
                tests={secTests} 
                isCollapsed={collapsedCats.security} 
                onToggle={() => toggleCat('security')} 
                getIcon={getStatusIcon}
                selectedId={selectedTestId}
                onSelect={handleTestClick}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor Preview */}
        <div className="col-span-5 bg-[#050b18]/85 border border-cyan-500/10 rounded-xl p-3.5 flex flex-col justify-between min-h-0 relative">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header info */}
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-cyan-500/10">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-[10px] font-bold text-slate-300 font-mono">
                  {testsList.find(t => t.id === selectedTestId)?.name || 'CODE_EDITOR'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Single test trigger */}
                <button
                  onClick={() => generateSingleTest(selectedTestId)}
                  disabled={isStreamingCode}
                  className="p-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded text-[9px] font-mono hover:bg-cyan-500/25 cursor-pointer disabled:opacity-50"
                  title="Force regenerate single test via AI"
                >
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  REGEN
                </button>

                <button
                  onClick={handleCopyCode}
                  className="p-1 bg-surface border border-border-color rounded text-slate-400 hover:text-white cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Code pane */}
            <div className="flex-1 bg-[#02050b] border border-cyan-500/5 rounded p-3 font-mono text-[10.5px] text-cyan-300/95 overflow-y-auto select-text scrollbar-thin relative">
              {isStreamingCode && (
                <div className="absolute right-3 top-3 flex items-center space-x-1 text-[9px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>CORE_STREAMING</span>
                </div>
              )}
              <pre className="whitespace-pre-wrap leading-relaxed">
                {testCodeMap[selectedTestId] || '// Select a test or click "REGEN" to analyze and output code here...'}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* Internal Accordion Component */
const TestCategory: React.FC<{
  title: string;
  count: string;
  tests: any[];
  isCollapsed: boolean;
  onToggle: () => void;
  getIcon: (status: string) => React.ReactNode;
  selectedId: string;
  onSelect: (id: string) => void;
}> = ({ title, count, tests, isCollapsed, onToggle, getIcon, selectedId, onSelect }) => {
  return (
    <div className="bg-[#050b18]/60 border border-cyan-500/10 rounded overflow-hidden text-xs">
      <div 
        onClick={onToggle}
        className="px-2.5 py-1.5 bg-surface/10 hover:bg-surface/20 border-b border-cyan-500/5 flex justify-between items-center cursor-pointer transition-colors"
      >
        <div className="flex items-center space-x-1.5 font-bold text-[9.5px] text-white font-mono">
          <span>{title}</span>
          <span className="text-[8.5px] font-mono text-cyan-400 bg-[#02050b] px-1 rounded border border-cyan-500/10">{count}</span>
        </div>
        {isCollapsed ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronUp className="h-3.5 w-3.5 text-slate-500" />}
      </div>

      {!isCollapsed && (
        <div className="p-1.5 space-y-1 bg-transparent">
          {tests.map(test => {
            const isSelected = test.id === selectedId;
            return (
              <div 
                key={test.id} 
                onClick={() => onSelect(test.id)}
                className={`flex justify-between items-center text-[10px] py-1 px-2 rounded cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-white shadow-[0_0_8px_rgba(6,182,212,0.08)]' 
                    : 'hover:bg-[#03070f] text-slate-400 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getIcon(test.status)}
                  <span className="truncate">{test.name}</span>
                </div>
                <span className={`text-[8px] font-mono shrink-0 ${
                  test.status === 'Generated' ? 'text-green-400' : 'text-cyan-400 animate-pulse'
                }`}>
                  {test.status.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
