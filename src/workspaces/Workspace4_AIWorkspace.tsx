import React, { useState } from 'react';
import { Bot, User, Send, Layout, ChevronRight, HelpCircle } from 'lucide-react';
import { useAxiomStore } from '../store/axiomStore';

export const Workspace4_AIWorkspace: React.FC = () => {
  const { aiMessages, addAiMessage } = useAxiomStore();
  const [inputVal, setInputVal] = useState('');
  const [subActiveTab, setSubActiveTab] = useState<'arch' | 'data' | 'deps' | 'risk' | 'coverage'>('arch');

  const handleSubmitChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addAiMessage('user', inputVal);
    setInputVal('');

    setTimeout(() => {
      addAiMessage('assistant', "I've analyzed your request against the 'ecommerce-platform' codebase. Based on your prompt, I recommend reviewing CheckoutForm.tsx and orders.controller.ts for potential concurrency errors.");
    }, 1000);
  };

  const subTabs = [
    { id: 'arch', label: 'Architecture' },
    { id: 'data', label: 'Data Flow' },
    { id: 'deps', label: 'Dependencies' },
    { id: 'risk', label: 'Risk Analysis' },
    { id: 'coverage', label: 'Coverage' }
  ];

  // Helper lists to render horizontal mini flow lines
  const frontendNodes = ['CheckoutPage', 'CheckoutForm', 'OrderSummary', 'PaymentMethod', 'PlaceOrderButton'];
  const apiNodes = ['POST /api/orders', 'GET /api/cart', 'POST /api/payments', 'GET /api/coupons', 'GET /api/users/me'];
  const serviceNodes = ['OrderService', 'PaymentService', 'InventoryService', 'CouponService', 'UserService'];
  const dbNodes = ['orders', 'order_items', 'payments', 'inventory', 'coupons', 'users'];
  const externalNodes = ['Stripe API', 'SendGrid Email', 'Redis Cache', 'S3 Storage'];

  return (
    <div className="flex-1 bg-bg-primary p-6 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none">
      {/* Conversation Workspace Container */}
      <div className="flex-1 flex flex-col justify-between min-h-0 space-y-4">
        {/* Header */}
        <div className="border-b border-border-color pb-3">
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide">AI Engineering Workspace</h2>
          <span className="text-[11px] text-text-secondary">Explore software architecture, generate tests, and predict code modifications.</span>
        </div>

        {/* Chat Stream Panel */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 select-text">
          {/* User Active chip */}
          <div className="flex justify-end">
            <div className="bg-primary-purple/10 border border-primary-purple/35 text-text-primary px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 glow-purple">
              <span>Explain checkout architecture</span>
              <button className="hover:text-danger ml-1 font-bold text-[10px] cursor-pointer">×</button>
            </div>
          </div>

          {/* AI Response Card */}
          <div className="bg-surface/30 border border-border-color rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-text-primary">
              <Bot className="h-4 w-4 text-primary-purple" />
              <span>Here's the complete architecture of your checkout flow:</span>
            </div>

            {/* Sub Tabs Inside Chat */}
            <div className="flex space-x-1 bg-surface border border-border-color p-1 rounded-lg max-w-md text-[10px]">
              {subTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSubActiveTab(t.id as any)}
                  className={`flex-1 py-1 rounded text-center transition-all cursor-pointer font-bold ${
                    subActiveTab === t.id
                      ? 'bg-primary-purple text-text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sub-Graph Flow Container */}
            {subActiveTab === 'arch' && (
              <div className="bg-bg-primary border border-border-color rounded-xl p-4 overflow-x-auto select-none">
                <div className="flex items-start justify-between min-w-[700px] text-[10px] space-x-4">
                  
                  {/* Column 1: Frontend */}
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Frontend (Next.js)</span>
                    {frontendNodes.map(n => (
                      <div key={n} className="bg-surface/50 border border-border-color rounded px-2 py-1 text-center truncate text-[9.5px]">
                        {n}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center h-44"><ChevronRight className="h-4 w-4 text-border-color" /></div>

                  {/* Column 2: APIs */}
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">API Layer</span>
                    {apiNodes.map(n => (
                      <div key={n} className="bg-surface/50 border border-border-color rounded px-2 py-1 text-center truncate text-[9.5px] font-mono">
                        {n}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center h-44"><ChevronRight className="h-4 w-4 text-border-color" /></div>

                  {/* Column 3: Services */}
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Services</span>
                    {serviceNodes.map(n => (
                      <div key={n} className="bg-surface/50 border border-border-color rounded px-2 py-1 text-center truncate text-[9.5px]">
                        {n}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center h-44"><ChevronRight className="h-4 w-4 text-border-color" /></div>

                  {/* Column 4: Databases */}
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Database</span>
                    {dbNodes.map(n => (
                      <div key={n} className="bg-surface/50 border border-border-color rounded px-2 py-1 text-center truncate text-[9.5px] font-mono">
                        {n}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center h-44"><ChevronRight className="h-4 w-4 text-border-color" /></div>

                  {/* Column 5: Externals */}
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">External</span>
                    {externalNodes.map(n => (
                      <div key={n} className="bg-surface/50 border border-border-color rounded px-2 py-1 text-center truncate text-[9.5px]">
                        {n}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* Architecture Summary Text */}
            <div className="text-xs text-text-secondary leading-relaxed space-y-3">
              <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">Architecture Summary</span>
              <p>
                The checkout flow follows a layered architecture pattern with clear separation of concerns. The frontend communicates with RESTful APIs, which delegate business logic to services. Data is persisted in PostgreSQL and external services handle payments, emails, and file storage.
              </p>
              
              {/* Architecture Brief counters layout */}
              <div className="grid grid-cols-5 gap-3 pt-2 text-center text-xs">
                {[
                  { label: 'Components', count: 12, col: 'text-text-primary' },
                  { label: 'API Endpoints', count: 8, col: 'text-secondary-blue' },
                  { label: 'Services', count: 7, col: 'text-warning' },
                  { label: 'Database Tables', count: 6, col: 'text-success' },
                  { label: 'External Services', count: 4, col: 'text-primary-purple' }
                ].map(item => (
                  <div key={item.label} className="bg-bg-primary border border-border-color rounded-lg py-2">
                    <span className="text-[16px] font-black font-mono block mb-0.5 leading-none">{item.count}</span>
                    <span className="text-[8.5px] text-text-secondary font-medium tracking-wide">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Input bar */}
        <form onSubmit={handleSubmitChat} className="bg-surface/20 border border-border-color rounded-xl p-3.5 flex flex-col space-y-2 relative">
          <div className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about your codebase..."
              className="w-full bg-surface border border-border-color rounded-lg pl-3 pr-10 py-2.5 text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-purple/50"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-purple hover:text-primary-purple/80 cursor-pointer">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[9px] text-text-secondary">
            <span>Axiom uses advanced code intelligence to provide accurate insights.</span>
            <div className="flex items-center space-x-1 hover:text-text-primary cursor-pointer">
              <HelpCircle className="h-3 w-3" />
              <span>Prompting guide</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
