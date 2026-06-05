import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Layout, ChevronRight, HelpCircle, AlertCircle, RefreshCw, Cpu, Settings } from 'lucide-react';
import { useAxiomStore } from '../store/axiomStore';
import { sendAIMessage, buildSystemPrompt } from '../services/aiService';

export const Workspace4_AIWorkspace: React.FC = () => {
  const {
    aiMessages,
    addAiMessage,
    aiProvider,
    aiApiKey,
    aiModel,
    aiBaseUrl,
    aiConnected,
    setShowAiSettings,
    importedProject,
    analysisResult
  } = useAxiomStore();

  const [inputVal, setInputVal] = useState('');
  const [subActiveTab, setSubActiveTab] = useState<'arch' | 'data' | 'deps' | 'risk' | 'coverage'>('arch');
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, streamContent]);

  const handleSubmitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isStreaming) return;

    const userPrompt = inputVal;
    setInputVal('');
    
    // Add user message to history
    addAiMessage('user', userPrompt);

    if (!aiConnected) {
      // Offline / not configured fallback
      setIsStreaming(true);
      setStreamContent('');
      
      const offlineReply = `[SYSTEM WARN]: AI core is offline. Please click the settings gear icon in the top right to configure your API key or local model (Ollama / LM Studio).\n\nHere is a simulated response based on static analysis:\n\nAnalyzing prompt: "${userPrompt}"\n\nI recommend reviewing components in the checkout flow, specifically \`CheckoutForm.tsx\` and \`orders.controller.ts\`. Ensure robust validation for input states.`;
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < offlineReply.length) {
          setStreamContent(prev => prev + offlineReply.charAt(index));
          index += 5; // stream faster for simulation
        } else {
          clearInterval(interval);
          addAiMessage('assistant', offlineReply);
          setStreamContent('');
          setIsStreaming(false);
        }
      }, 20);
      return;
    }

    // Real streaming
    setIsStreaming(true);
    setStreamContent('');

    const systemPrompt = buildSystemPrompt(
      importedProject 
        ? `Project: ${importedProject.name}\nOwner: ${importedProject.owner}\nFrameworks: ${importedProject.frameworks.join(', ')}\nFiles: ${importedProject.files}\nLines: ${importedProject.lines}`
        : undefined
    );

    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...aiMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: userPrompt }
    ];

    try {
      await sendAIMessage(
        apiMessages,
        {
          provider: aiProvider,
          apiKey: aiApiKey,
          model: aiModel,
          baseUrl: aiBaseUrl,
          temperature: 0.7
        },
        {
          onChunk: (chunk) => {
            setStreamContent(prev => prev + chunk);
          },
          onDone: (fullText) => {
            addAiMessage('assistant', fullText);
            setStreamContent('');
            setIsStreaming(false);
          },
          onError: (err) => {
            addAiMessage('assistant', `[ERROR]: Failed to get response from AI Provider: ${err}`);
            setStreamContent('');
            setIsStreaming(false);
          }
        }
      );
    } catch (err: any) {
      addAiMessage('assistant', `[ERROR]: Network failed: ${err.message || err}`);
      setStreamContent('');
      setIsStreaming(false);
    }
  };

  const suggestedPrompts = [
    'Explain checkout architecture end to end',
    'List all API endpoints and their controller files',
    'Where are order states modified in the database?',
    'Scan the codebase for potential security vulnerabilities'
  ];

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
    <div className="flex-1 bg-[#02050b] p-6 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 relative select-none">
      {/* Scanline pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      {/* Main content grid */}
      <div className="flex-1 flex flex-col justify-between min-h-0 space-y-4 z-20">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div>
            <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400" /> AI COGNITIVE BRAIN
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              ACTIVE CORE: {aiConnected ? `${aiProvider.toUpperCase()} (${aiModel})` : 'MOCK ENGINE'}
            </span>
          </div>

          {!aiConnected && (
            <button
              onClick={() => setShowAiSettings(true)}
              className="flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-500 hover:bg-amber-500/25 text-[10px] font-bold font-mono tracking-widest px-3 py-1 rounded transition-all cursor-pointer animate-pulse"
            >
              <Settings className="h-3 w-3" />
              <span>ACTIVATE_REAL_AI</span>
            </button>
          )}
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 select-text scrollbar-thin">
          
          {/* Default static explanation card if conversation is fresh */}
          {aiMessages.length <= 2 && (
            <div className="bg-[#050b18]/85 border border-cyan-500/20 rounded-xl p-4 space-y-4 shadow-[0_0_15px_rgba(6,182,212,0.02)]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                <Bot className="h-4 w-4 text-cyan-400" />
                <span className="font-mono uppercase tracking-wider">Axiom Cognitive Architecture Map:</span>
              </div>

              {/* Sub Tabs Inside Info Box */}
              <div className="flex space-x-1 bg-surface/30 border border-border-color/30 p-1 rounded-lg max-w-md text-[10px]">
                {subTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSubActiveTab(t.id as any)}
                    className={`flex-1 py-1 rounded text-center transition-all cursor-pointer font-bold ${
                      subActiveTab === t.id
                        ? 'bg-cyan-500 text-bg-primary font-mono'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Architecture diagram view */}
              {subActiveTab === 'arch' && (
                <div className="bg-bg-primary/55 border border-cyan-500/10 rounded-xl p-4 overflow-x-auto select-none">
                  <div className="flex items-start justify-between min-w-[700px] text-[10px] space-x-4 font-mono text-slate-300">
                    {/* Frontend */}
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[8px] font-bold text-cyan-400 block mb-1 text-center tracking-wider uppercase">FRONTEND</span>
                      {frontendNodes.map(n => (
                        <div key={n} className="bg-[#050b18] border border-cyan-500/10 rounded px-2 py-1 text-center truncate text-[9.5px]">
                          {n}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center h-44"><ChevronRight className="h-4 w-4 text-cyan-500/30" /></div>

                    {/* APIs */}
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[8px] font-bold text-cyan-400 block mb-1 text-center tracking-wider uppercase">API ROUTER</span>
                      {apiNodes.map(n => (
                        <div key={n} className="bg-[#050b18] border border-cyan-500/10 rounded px-2 py-1 text-center truncate text-[9.5px]">
                          {n}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center h-44"><ChevronRight className="h-4 w-4 text-cyan-500/30" /></div>

                    {/* Services */}
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[8px] font-bold text-cyan-400 block mb-1 text-center tracking-wider uppercase">SERVICES</span>
                      {serviceNodes.map(n => (
                        <div key={n} className="bg-[#050b18] border border-cyan-500/10 rounded px-2 py-1 text-center truncate text-[9.5px]">
                          {n}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center h-44"><ChevronRight className="h-4 w-4 text-cyan-500/30" /></div>

                    {/* Databases */}
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[8px] font-bold text-cyan-400 block mb-1 text-center tracking-wider uppercase">DATABASE</span>
                      {dbNodes.map(n => (
                        <div key={n} className="bg-[#050b18] border border-cyan-500/10 rounded px-2 py-1 text-center truncate text-[9.5px]">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Static text summary */}
              <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-mono">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Flow Telemetry Summary</span>
                <p className="text-[11px] leading-relaxed">
                  The architecture mapping engine registers multi-level interactions between views, controllers, services, database layers, and third-party integrations. You can issue prompt requests below to ask specific queries about files, functions, DB changes, or trigger custom test code generations.
                </p>
              </div>
            </div>
          )}

          {/* Render Messages List */}
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3.5 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center border shrink-0 ${
                msg.role === 'user'
                  ? 'bg-purple-500/10 border-purple-500/35 text-purple-400'
                  : 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400'
              }`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`rounded-xl p-4 border text-xs leading-relaxed max-w-2xl whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-purple-500/5 border-purple-500/20 text-white font-medium'
                  : 'bg-[#050b18]/70 border-cyan-500/10 text-slate-200'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Render Streaming Chunk Bubble */}
          {isStreaming && streamContent && (
            <div className="flex items-start space-x-3.5 max-w-3xl">
              <div className="h-8 w-8 rounded-full flex items-center justify-center border bg-cyan-500/10 border-cyan-500/35 text-cyan-400 shrink-0">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>

              <div className="rounded-xl p-4 border bg-[#050b18]/70 border-cyan-500/10 text-slate-200 text-xs leading-relaxed max-w-2xl whitespace-pre-wrap">
                {streamContent}
                <span className="inline-block w-1.5 h-3 ml-0.5 bg-cyan-400 animate-pulse" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {aiMessages.length <= 4 && !isStreaming && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Suggested Prompt Telemetries</span>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map(p => (
                <button
                  key={p}
                  onClick={() => setInputVal(p)}
                  className="text-[10px] font-medium font-mono text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 border border-cyan-500/20 px-3 py-1 rounded-full cursor-pointer transition-all hover:border-cyan-400"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Chat Input */}
        <form onSubmit={handleSubmitChat} className="bg-[#050b18]/80 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col space-y-2 relative">
          <div className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isStreaming}
              placeholder={isStreaming ? "Awaiting neural core response..." : "Ask anything about your codebase..."}
              className="w-full bg-[#03070f] border border-cyan-500/15 rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 font-sans"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputVal.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 cursor-pointer transition-colors ${
                isStreaming ? 'text-slate-600' : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>AXIOM MODEL INTEGRATION IS ONLINE</span>
            <div className="flex items-center space-x-1 hover:text-slate-300 cursor-pointer">
              <HelpCircle className="h-3 w-3" />
              <span>Prompt Guide</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
