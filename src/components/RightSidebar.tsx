import React, { useState } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  Bot, Send, ChevronDown, CheckCircle, AlertTriangle, PlayCircle, 
  Settings, User, Code, FileText, BarChart2, Shield, Play, 
  ExternalLink, Layers, Database, Activity, RefreshCw
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { activeWorkspace, selectedGraphNode, aiMessages, addAiMessage } = useAxiomStore();
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addAiMessage('user', chatInput);
    const userQuery = chatInput;
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = "I've scanned the codebase. Let me know if you need specific test cases or refactoring instructions.";
      if (userQuery.toLowerCase().includes('checkout')) {
        response = "The checkout system currently uses `POST /api/orders` to persist transaction details and `POST /api/payments` via PaymentService. I recommend implementing a transaction rollback mechanism in case Stripe validations fail.";
      } else if (userQuery.toLowerCase().includes('test')) {
        response = "I can generate 4 new integration tests covering edge cases for coupon validations and expired cards. Shall I deploy them to tests/e2e/checkout.spec.ts?";
      }
      addAiMessage('assistant', response);
    }, 1000);
  };

  // Render 1: AI Copilot (Explorer Workspace - 1.webp)
  const renderAiCopilot = () => (
    <div className="h-full flex flex-col justify-between font-sans">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header tabs */}
        <div className="flex border-b border-border-color bg-surface/30">
          {['Chat', 'Ask', 'Context', 'Agents'].map((tab, idx) => (
            <button 
              key={tab} 
              className={`flex-1 py-2 text-xs font-medium cursor-pointer transition-colors ${
                idx === 0 ? 'text-primary-purple border-b-2 border-primary-purple bg-surface/5' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Model info */}
        <div className="px-3 py-2 bg-surface/20 border-b border-border-color flex justify-between items-center text-[10px]">
          <span className="text-text-secondary">AI Model:</span>
          <span className="text-primary-purple font-semibold flex items-center space-x-1 cursor-pointer">
            <span>Axiom 3.5 Opus</span>
            <ChevronDown className="h-3 w-3" />
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 select-text">
          {aiMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-1.5 text-[10px] text-text-secondary">
                {msg.role === 'assistant' ? <Bot className="h-3 w-3 text-primary-purple" /> : <User className="h-3 w-3" />}
                <span className="font-semibold">{msg.role === 'assistant' ? 'AI Assistant' : 'You'}</span>
              </div>
              <div className={`text-xs p-2.5 rounded-lg max-w-[90%] leading-relaxed border ${
                msg.role === 'user' 
                  ? 'bg-primary-purple/10 border-primary-purple/20 text-text-primary rounded-tr-none' 
                  : 'bg-surface border-border-color text-text-secondary rounded-tl-none whitespace-pre-line'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendChat} className="p-3 border-t border-border-color bg-surface/20">
        <div className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask anything about your codebase..."
            className="w-full bg-surface border border-border-color rounded-lg pl-3 pr-10 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary-purple/50"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-purple hover:text-primary-purple/80 cursor-pointer">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );

  // Render 2: Node Inspector (Graph Workspace - 4.webp)
  const renderNodeInspector = () => (
    <div className="h-full flex flex-col font-sans select-none overflow-y-auto">
      <div className="p-4 border-b border-border-color bg-surface/20 flex items-start space-x-3">
        <div className="p-2 bg-primary-purple/10 rounded-lg text-primary-purple border border-primary-purple/20">
          <Code className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">{selectedGraphNode || 'CheckoutForm'}</h3>
          <span className="text-[10px] text-text-secondary font-mono">React Component</span>
          <div className="text-[9px] text-text-secondary font-mono mt-1 opacity-75 truncate max-w-[190px]">
            apps/web/src/components/checkout/{selectedGraphNode || 'CheckoutForm'}.tsx
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-color text-xs bg-surface/10">
        {['Overview', 'Dependencies', 'Related', 'Metrics'].map((tab, idx) => (
          <button key={tab} className={`flex-1 py-2 cursor-pointer ${idx === 0 ? 'text-primary-purple border-b border-primary-purple font-medium bg-surface/5' : 'text-text-secondary'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 flex-1 space-y-4 text-xs">
        {/* Description */}
        <div>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Description</span>
          <p className="text-text-secondary leading-relaxed">
            Form component for collecting checkout information including shipping address, payment method, and order review.
          </p>
        </div>

        {/* Details List */}
        <div className="space-y-1.5 border-t border-border-color pt-3">
          <div className="flex justify-between"><span className="text-text-secondary">Type:</span><span className="text-text-primary">React Component</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Language:</span><span className="text-text-primary">TypeScript</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Lines of Code:</span><span className="text-text-primary">312</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Imported By:</span><span className="text-text-primary">5 components</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Used In:</span><span className="text-text-primary">2 pages</span></div>
        </div>

        {/* Dependencies */}
        <div className="border-t border-border-color pt-3">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">Dependencies (Direct)</span>
          <div className="space-y-1">
            {['OrderSummary', 'PaymentMethod', 'AddressForm', 'CouponInput'].map(dep => (
              <div key={dep} className="flex justify-between items-center py-0.5 hover:bg-surface/30 px-1 rounded">
                <span className="text-text-primary font-medium">{dep}</span>
                <span className="text-[9px] text-text-secondary font-mono bg-surface border border-border-color px-1 rounded">Component</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tests */}
        <div className="border-t border-border-color pt-3">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">Related Tests</span>
          <div className="space-y-2">
            {[
              { name: 'checkout-form.test.tsx', rate: '92%', status: 'success' },
              { name: 'checkout-flow.spec.ts', rate: '85%', status: 'success' },
              { name: 'checkout-validation.test.ts', rate: '90%', status: 'success' }
            ].map(t => (
              <div key={t.name} className="flex justify-between items-center text-[11px]">
                <span className="text-text-secondary truncate max-w-[140px]">{t.name}</span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-text-primary font-mono font-medium">{t.rate}</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Circular progress */}
        <div className="border-t border-border-color pt-4 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-full border-2 border-success/30">
              <span className="text-[10px] font-bold text-success font-mono">89%</span>
            </div>
            <span className="text-[9px] text-text-secondary mt-1.5">Coverage</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-full border-2 border-success/30">
              <span className="text-[10px] font-bold text-success font-mono">2.1</span>
            </div>
            <span className="text-[9px] text-text-secondary mt-1.5">Risk Score</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-full border-2 border-success/30">
              <span className="text-[10px] font-bold text-success font-mono">98ms</span>
            </div>
            <span className="text-[9px] text-text-secondary mt-1.5">Performance</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render 3: AI Actions (AI Workspace - 5.webp)
  const renderActionsWorkspace = () => (
    <div className="h-full flex flex-col font-sans select-none overflow-y-auto p-4 space-y-4">
      <div>
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Ready Actions</h3>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <button className="flex flex-col items-center p-2.5 bg-surface border border-border-color hover:border-primary-purple rounded-lg transition-colors cursor-pointer text-center">
            <Shield className="h-4 w-4 text-primary-purple mb-1.5" />
            <span className="font-semibold text-text-primary">Generate Tests</span>
            <span className="text-[8px] text-text-secondary mt-0.5">Checkout flow E2E</span>
          </button>
          <button className="flex flex-col items-center p-2.5 bg-surface border border-border-color hover:border-secondary-blue rounded-lg transition-colors cursor-pointer text-center">
            <Play className="h-4 w-4 text-secondary-blue mb-1.5" />
            <span className="font-semibold text-text-primary">Run Validation</span>
            <span className="text-[8px] text-text-secondary mt-0.5">Trigger regression suite</span>
          </button>
        </div>
      </div>

      {/* Generated Tests Preview */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Generated Tests Preview</h3>
        <div className="space-y-2">
          {[
            { name: 'checkout-flow.test.ts', type: 'E2E Test', rate: '92%' },
            { name: 'checkout-validation.test.ts', type: 'Unit Test', rate: '90%' },
            { name: 'payment-processing.test.ts', type: 'Integration', rate: '88%' }
          ].map(test => (
            <div key={test.name} className="p-2 bg-surface/50 border border-border-color rounded flex justify-between items-center">
              <div>
                <div className="text-[11px] font-semibold text-text-primary">{test.name}</div>
                <div className="text-[8px] text-text-secondary">{test.type}</div>
              </div>
              <span className="text-xs font-bold text-success font-mono">{test.rate}</span>
            </div>
          ))}
          <button className="w-full text-center text-[10px] text-primary-purple hover:underline mt-1 cursor-pointer">
            View All Tests
          </button>
        </div>
      </div>

      {/* Risk Analysis Summary */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Risk Analysis Summary</h3>
        <div className="space-y-1.5 text-[10px]">
          <div className="p-2 bg-danger/10 border border-danger/20 rounded flex items-center justify-between">
            <div>
              <span className="font-bold text-danger">High Risk</span>
              <p className="text-text-secondary text-[9px] mt-0.5">Payment failure scenarios not fully covered</p>
            </div>
            <span className="font-mono font-bold text-danger">92%</span>
          </div>
          <div className="p-2 bg-warning/10 border border-warning/20 rounded flex items-center justify-between">
            <div>
              <span className="font-bold text-warning">Medium Risk</span>
              <p className="text-text-secondary text-[9px] mt-0.5">Inventory race conditions under load</p>
            </div>
            <span className="font-mono font-bold text-warning">78%</span>
          </div>
        </div>
      </div>

      {/* Suggested Improvements */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Suggested Improvements</h3>
        <div className="space-y-1.5 text-[10.5px]">
          {[
            { text: 'Add idempotency key for order creation', impact: 'High Impact', color: 'text-danger' },
            { text: 'Implement circuit breaker for external APIs', impact: 'Medium Impact', color: 'text-warning' },
            { text: 'Add error boundaries for UI components', impact: 'Medium Impact', color: 'text-warning' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-purple mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-text-primary leading-tight">{item.text}</p>
                <span className={`text-[8px] font-bold uppercase tracking-wider ${item.color}`}>{item.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render 4: Coverage Preview (Tests Workspace - 6.webp)
  const renderCoveragePreview = () => (
    <div className="h-full flex flex-col font-sans select-none overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border-color pb-2">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Coverage Preview</h3>
        <span className="text-[10px] text-primary-purple font-mono cursor-pointer hover:underline">Overall Coverage</span>
      </div>

      {/* Circular Progress Gauge */}
      <div className="flex items-center space-x-4 bg-surface/20 p-3 rounded-lg border border-border-color">
        <div className="relative h-16 w-16 flex items-center justify-center rounded-full border-4 border-primary-purple/30 border-t-primary-purple">
          <span className="text-sm font-black text-text-primary font-mono">78.4%</span>
        </div>
        <div className="flex-1 text-[11px] space-y-1">
          <div className="flex justify-between"><span className="text-text-secondary">Total Tests:</span><span className="text-text-primary font-mono font-medium">1,342</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Passed:</span><span className="text-success font-mono font-medium">78.4% (1,052)</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Failed:</span><span className="text-danger font-mono font-medium">6.1% (82)</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Skipped:</span><span className="text-warning font-mono font-medium">15.5% (208)</span></div>
        </div>
      </div>

      {/* Horizontal Bars */}
      <div className="space-y-3">
        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Coverage By Type</div>
        {[
          { label: 'UI Tests', rate: 72.3, text: '325 / 450' },
          { label: 'API Tests', rate: 81.7, text: '490 / 600' },
          { label: 'Database Tests', rate: 85.2, text: '230 / 270' },
          { label: 'Integration Tests', rate: 69.1, text: '83 / 120' },
          { label: 'Security Tests', rate: 76.4, text: '55 / 72' }
        ].map(bar => (
          <div key={bar.label} className="text-[11px] space-y-1">
            <div className="flex justify-between text-text-secondary">
              <span>{bar.label}</span>
              <span className="font-mono font-medium">{bar.rate}% ({bar.text})</span>
            </div>
            <div className="h-1.5 bg-surface border border-border-color rounded-full overflow-hidden">
              <div className="h-full bg-primary-purple rounded-full" style={{ width: `${bar.rate}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Coverage heatmap grid snippet */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3.5">Coverage Heatmap</h3>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {[
            { name: 'Auth Service', rate: '92%', style: 'bg-success/15 border-success/30 text-success' },
            { name: 'User Service', rate: '88%', style: 'bg-success/15 border-success/30 text-success' },
            { name: 'Product Service', rate: '76%', style: 'bg-success/10 border-success/20 text-success' },
            { name: 'Order Service', rate: '81%', style: 'bg-success/15 border-success/30 text-success' },
            { name: 'Payment Service', rate: '73%', style: 'bg-warning/10 border-warning/20 text-warning' },
            { name: 'External APIs', rate: '58%', style: 'bg-danger/10 border-danger/20 text-danger' }
          ].map(cell => (
            <div key={cell.name} className={`p-2.5 border rounded-md text-center flex flex-col justify-center ${cell.style}`}>
              <span className="font-semibold text-text-primary text-[10.5px] truncate">{cell.name}</span>
              <span className="text-[11px] font-mono font-bold mt-1 block">{cell.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render 5: AI Root Cause Analysis (Validation Workspace - 7.webp)
  const renderAiRootCause = () => (
    <div className="h-full flex flex-col font-sans select-none overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border-color pb-2">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">AI Root Cause Analysis</h3>
        <span className="text-[9px] text-success bg-success/15 px-1.5 py-0.5 rounded font-bold border border-success/20">Analysis Complete</span>
      </div>

      {/* Root cause summary */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Root Cause</span>
        <p className="text-xs text-text-primary leading-relaxed bg-surface/50 border border-border-color p-3 rounded-lg">
          Payment processing failed due to insufficient inventory validation in concurrent checkout scenario.
        </p>
      </div>

      {/* Failures list */}
      <div className="border-t border-border-color pt-3 space-y-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block text-danger">Failures</span>
        <div className="space-y-1.5 text-[10px] font-mono text-text-secondary">
          <div className="flex items-start space-x-1.5">
            <span className="text-danger">●</span>
            <span className="text-text-primary">Payment Processing Test &gt; should process valid payment</span>
          </div>
          <div className="flex items-start space-x-1.5">
            <span className="text-danger">●</span>
            <span className="text-text-primary">Order Confirmation Test &gt; should confirm order</span>
          </div>
        </div>
      </div>

      {/* Code fix suggestion */}
      <div className="border-t border-border-color pt-3 space-y-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Fix Suggestions</span>
        <div className="space-y-2 text-[10.5px]">
          <div>
            <div className="font-semibold text-text-primary mb-1">1. Add inventory re-check before payment</div>
            <pre className="bg-bg-primary border border-border-color rounded p-2 text-[9.5px] font-mono text-text-secondary overflow-x-auto whitespace-pre leading-normal">
{`// In payment.service.ts
const isAvailable = await inventory.check(items);
if (!isAvailable) {
  throw new Error('Insufficient inventory');
}`}
            </pre>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-1">2. Implement distributed lock</div>
            <pre className="bg-bg-primary border border-border-color rounded p-2 text-[9.5px] font-mono text-text-secondary overflow-x-auto whitespace-pre leading-normal">
{`// In order.service.ts
await lockService.acquire(productId);`}
            </pre>
          </div>
        </div>
      </div>

      {/* Confidence gauge */}
      <div className="border-t border-border-color pt-3 flex flex-col justify-end">
        <div className="flex justify-between items-center text-[10px] text-text-secondary mb-1">
          <span>Confidence Score:</span>
          <span className="text-success font-bold font-mono">92%</span>
        </div>
        <div className="h-2 bg-surface border border-border-color rounded-full overflow-hidden">
          <div className="h-full bg-success" style={{ width: '92%' }} />
        </div>
        <span className="text-[8px] text-text-secondary mt-1 italic block text-right">Similar issues resolved in checkout.controller.ts</span>
      </div>
    </div>
  );

  // Render 6: Impact Predictions (Impact Workspace - 8.webp)
  const renderAiPredictionEngine = () => (
    <div className="h-full flex flex-col font-sans select-none overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-border-color pb-2">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">AI Prediction Engine</h3>
        <span className="text-[10px] text-text-secondary">Model: Axiom 3.5 Impact</span>
      </div>

      {/* Impact Score */}
      <div className="flex items-center justify-between bg-surface/20 p-3 rounded-lg border border-border-color">
        <div>
          <span className="text-[9px] text-text-secondary block font-bold uppercase tracking-wider">Overall Impact Score</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-danger">8.7</span>
            <span className="text-[10px] text-text-secondary">/ 10</span>
          </div>
          <span className="text-[9px] font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded border border-danger/20 mt-1 inline-block">High Impact</span>
        </div>
        <div className="text-center">
          <div className="h-14 w-14 rounded-full border-4 border-success flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-text-primary font-mono">92%</span>
            <span className="text-[7px] text-text-secondary uppercase">Confidence</span>
          </div>
        </div>
      </div>

      {/* Breakdown bar charts */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Impact Breakdown</span>
        {[
          { label: 'Functional Impact', score: 9.2 },
          { label: 'Data Impact', score: 8.1 },
          { label: 'Integration Impact', score: 8.6 },
          { label: 'Test Impact', score: 8.9 },
          { label: 'Performance Impact', score: 7.3 }
        ].map(item => (
          <div key={item.label} className="text-[11px] space-y-1">
            <div className="flex justify-between text-text-secondary">
              <span>{item.label}</span>
              <span className="font-mono font-medium">{item.score} / 10</span>
            </div>
            <div className="h-1.5 bg-surface border border-border-color rounded-full overflow-hidden">
              <div className="h-full bg-danger rounded-full" style={{ width: `${item.score * 10}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Actions */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Suggested Actions</h3>
        <div className="space-y-1.5 text-[10px]">
          {[
            { text: 'Review payment flow integration', label: 'Critical', style: 'bg-danger/10 border-danger/20 text-danger' },
            { text: 'Validate inventory availability checks', label: 'High', style: 'bg-warning/10 border-warning/20 text-warning' },
            { text: 'Update order total calculations', label: 'High', style: 'bg-warning/10 border-warning/20 text-warning' }
          ].map((action, idx) => (
            <div key={idx} className="p-2 bg-surface/50 border border-border-color rounded flex justify-between items-center">
              <span className="text-text-primary leading-snug">{action.text}</span>
              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${action.style}`}>{action.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render 7: Agent Task Queue & Reasoning Chains (Agents Workspace - 9.webp)
  const renderTaskOrchestrator = () => (
    <div className="h-full flex flex-col font-sans select-none overflow-y-auto p-4 space-y-4">
      <div>
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2.5">Task Orchestrator Queue</h3>
        <div className="space-y-2 text-[10px]">
          {[
            { name: 'Analyze order payment flow', progress: 75, status: 'In Progress' },
            { name: 'Generate tests for checkout', progress: 60, status: 'In Progress' },
            { name: 'Execute payment integration tests', progress: 90, status: 'In Progress' }
          ].map(task => (
            <div key={task.name} className="p-2 bg-surface/50 border border-border-color rounded space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-primary truncate max-w-[140px]">{task.name}</span>
                <span className="text-[8px] text-success">{task.status}</span>
              </div>
              <div className="h-1 bg-surface border border-border-color rounded-full overflow-hidden">
                <div className="h-full bg-primary-purple" style={{ width: `${task.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent reasoning chain list */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Agent Reasoning Chains</h3>
        <div className="space-y-2.5 text-[10px] leading-relaxed">
          {[
            { agent: 'Test Generator → Execution Agent', text: 'Identified test scenarios for payment validation. Generated 24 test cases covering edge cases. Coordinated with Execution Agent for validation.', active: true },
            { agent: 'Code Analyzer → Architecture Agent', text: 'Analyzed code changes in /api/orders. Identified 3 files modified, high impact detected.', active: false }
          ].map((chain, idx) => (
            <div key={idx} className="p-2 border border-border-color rounded bg-surface/20">
              <div className="flex justify-between items-center mb-1 text-[9px] font-bold">
                <span className="text-primary-purple">{chain.agent}</span>
                <span className="text-success font-normal">Active</span>
              </div>
              <p className="text-text-secondary text-[9px] font-mono leading-tight">{chain.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render 8: Twin Predictions & Risks (Digital Twin - 10.webp)
  const renderTwinPredictions = () => (
    <div className="h-full flex flex-col font-sans select-none overflow-y-auto p-4 space-y-4">
      <div className="border-b border-border-color pb-2">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">AI Predictions</h3>
      </div>

      {/* Predictions list */}
      <div className="space-y-2 text-[10px]">
        {[
          { title: 'High Traffic Surge', target: 'Payment Processing City', prob: '95% confidence', time: 'In 15 min' },
          { title: 'Potential Bottleneck', target: 'Order Service → Payment Service', prob: '88% confidence', time: 'In 5 min' },
          { title: 'Security Risk Detected', target: 'User Authentication API', prob: '92% confidence', time: 'In 30 min' }
        ].map((pred, idx) => (
          <div key={idx} className="p-2 bg-surface/50 border border-border-color rounded space-y-1">
            <div className="flex justify-between items-center text-text-primary font-semibold">
              <span>{pred.title}</span>
              <span className="text-success font-mono font-bold">{pred.prob}</span>
            </div>
            <div className="flex justify-between text-[9px] text-text-secondary">
              <span>{pred.target}</span>
              <span>{pred.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Hotspots */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Risk Hotspots</h3>
        <div className="space-y-1.5 text-[10.5px]">
          {[
            { name: 'Payment Service', risk: 'Critical', score: '9.8', color: 'text-danger bg-danger/10 border-danger/20' },
            { name: 'Order Processing API', risk: 'High', score: '8.7', color: 'text-warning bg-warning/10 border-warning/20' },
            { name: 'User Authentication', risk: 'High', score: '8.2', color: 'text-warning bg-warning/10 border-warning/20' }
          ].map(hot => (
            <div key={hot.name} className={`p-2 border rounded flex justify-between items-center ${hot.color}`}>
              <div>
                <span className="font-semibold text-text-primary text-[11px] block">{hot.name}</span>
                <span className="text-[8px] uppercase tracking-wider block font-bold mt-0.5">{hot.risk}</span>
              </div>
              <span className="font-mono font-black text-xs">{hot.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage heatmap */}
      <div className="border-t border-border-color pt-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Coverage Heatmap</h3>
        <div className="h-3 bg-gradient-to-r from-danger via-warning to-success rounded-full overflow-hidden border border-border-color" />
        <div className="flex justify-between text-[8px] text-text-secondary mt-1 font-mono uppercase tracking-wider font-bold">
          <span>0%</span>
          <span>Overall: 94.3%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-64 bg-bg-secondary border-l border-border-color flex flex-col select-none">
      {/* Sidebar Header Title */}
      <div className="px-3.5 py-3 border-b border-border-color bg-surface/10 flex items-center justify-between">
        <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">
          {activeWorkspace === 'explorer' && 'AI Co-Pilot'}
          {activeWorkspace === 'graph' && 'Node Inspector'}
          {activeWorkspace === 'ai' && 'Actions Workspace'}
          {activeWorkspace === 'tests' && 'Coverage Statistics'}
          {activeWorkspace === 'validation' && 'AI Diagnostics'}
          {activeWorkspace === 'coverage' && 'Coverage Insights'}
          {activeWorkspace === 'impact' && 'AI Prediction Engine'}
          {activeWorkspace === 'agents' && 'Task Coordinator'}
          {activeWorkspace === 'twin' && 'System Predictor'}
          {activeWorkspace === 'settings' && 'Axiom Configuration'}
        </span>
        <Bot className="h-4 w-4 text-primary-purple" />
      </div>

      {/* Sidebar content container */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeWorkspace === 'explorer' && renderAiCopilot()}
        {activeWorkspace === 'graph' && renderNodeInspector()}
        {activeWorkspace === 'ai' && renderActionsWorkspace()}
        {activeWorkspace === 'tests' && renderCoveragePreview()}
        {activeWorkspace === 'validation' && renderAiRootCause()}
        {activeWorkspace === 'coverage' && renderCoveragePreview()}
        {activeWorkspace === 'impact' && renderAiPredictionEngine()}
        {activeWorkspace === 'agents' && renderTaskOrchestrator()}
        {activeWorkspace === 'twin' && renderTwinPredictions()}
        {activeWorkspace === 'settings' && (
          <div className="p-4 text-xs text-text-secondary space-y-4">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Core Settings</span>
            <div className="space-y-3">
              <label className="flex flex-col space-y-1">
                <span>API Keys (OpenAI / Claude / Gemini)</span>
                <input type="password" value="••••••••••••••••••••" readOnly className="bg-surface border border-border-color rounded p-1.5 text-text-primary" />
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded text-primary-purple bg-surface border-border-color" />
                <span>Auto-run validation on change</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded text-primary-purple bg-surface border-border-color" />
                <span>Simulate operational traffic</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
