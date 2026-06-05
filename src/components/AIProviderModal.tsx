import React, { useEffect, useState } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { X, HelpCircle, Activity, ShieldAlert, Key, Globe, Cpu, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { type AIProvider, PROVIDER_MODELS } from '../services/aiService';

export const AIProviderModal: React.FC = () => {
  const {
    aiProvider,
    aiApiKey,
    aiModel,
    aiBaseUrl,
    aiConnected,
    aiConnecting,
    aiLatencyMs,
    aiConnectionError,
    showAiSettings,
    setShowAiSettings,
    setAiProvider,
    setAiApiKey,
    setAiModel,
    setAiBaseUrl,
    testConnection,
    ollamaModels,
    loadOllamaModels
  } = useAxiomStore();

  const [localKey, setLocalKey] = useState(aiApiKey);
  const [localUrl, setLocalUrl] = useState(aiBaseUrl);
  const [customModel, setCustomModel] = useState(aiModel);

  // Sync state with store on show
  useEffect(() => {
    if (showAiSettings) {
      setLocalKey(aiApiKey);
      setLocalUrl(aiBaseUrl);
      setCustomModel(aiModel);
      if (aiProvider === 'ollama') {
        loadOllamaModels();
      }
    }
  }, [showAiSettings, aiProvider, aiApiKey, aiBaseUrl, aiModel]);

  if (!showAiSettings) return null;

  const providers: { id: AIProvider; name: string; desc: string; requiresKey: boolean }[] = [
    { id: 'openai', name: 'OpenAI', desc: 'GPT-4o, GPT-4, GPT-3.5-Turbo', requiresKey: true },
    { id: 'anthropic', name: 'Anthropic', desc: 'Claude 3.5 Sonnet, Claude 3 Opus', requiresKey: true },
    { id: 'gemini', name: 'Google Gemini', desc: 'Gemini 1.5 Pro & Flash', requiresKey: true },
    { id: 'ollama', name: 'Ollama', desc: 'Run models locally via Ollama daemon', requiresKey: false },
    { id: 'lmstudio', name: 'LM Studio', desc: 'Run models locally via LM Studio server', requiresKey: false },
    { id: 'custom', name: 'Custom OpenAI', desc: 'Any OpenAI-compatible gateway', requiresKey: false }
  ];

  const handleProviderSelect = (pId: AIProvider) => {
    setAiProvider(pId);
  };

  const handleSave = async () => {
    setAiApiKey(localKey);
    setAiBaseUrl(localUrl);
    if (aiProvider === 'custom') {
      setAiModel(customModel);
    }
    // Automatically trigger test connection on save
    setTimeout(() => {
      testConnection();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#010308]/90 backdrop-blur-md font-sans select-none p-4">
      {/* Outer panel box with glowing cyberpunk cyan/purple border */}
      <div className="relative w-full max-w-2xl bg-[#060b13]/95 border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden">
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.003)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

        {/* Title Bar */}
        <div className="flex justify-between items-center bg-[#09111f] border-b border-cyan-500/20 px-6 py-4 z-20">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-cyan-400 animate-pulse" />
            <h2 className="text-sm font-black text-cyan-400 uppercase tracking-widest font-mono">AXIOM_AI_CORE_CONFIGURATION</h2>
          </div>
          <button
            onClick={() => setShowAiSettings(false)}
            className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 z-20">
          {/* Provider Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Select AI Core Brain</span>
            <div className="grid grid-cols-3 gap-3">
              {providers.map((p) => {
                const isActive = aiProvider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleProviderSelect(p.id)}
                    className={`flex flex-col items-start p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'bg-surface/30 border-border-color/40 hover:bg-surface/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-xs font-bold ${isActive ? 'text-cyan-400 font-mono' : 'text-text-primary'}`}>
                        {p.name}
                      </span>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                    <span className="text-[9.5px] text-text-secondary leading-normal">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuration Inputs */}
          <div className="bg-[#05090f] border border-border-color/30 rounded-lg p-4 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-border-color/20 pb-1.5">
              2. Credentials & Server Endpoints
            </span>

            {/* API Key */}
            {providers.find(p => p.id === aiProvider)?.requiresKey && (
              <div className="space-y-1.5">
                <label className="flex items-center text-[10px] font-bold text-text-secondary uppercase">
                  <Key className="h-3 w-3 mr-1.5 text-cyan-500" />
                  API Access Secret Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    className="w-full bg-surface border border-border-color rounded-md px-3 py-2 text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-cyan-400/50 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Base URL (for Ollama, LM Studio, Custom) */}
            {['ollama', 'lmstudio', 'custom'].includes(aiProvider) && (
              <div className="space-y-1.5">
                <label className="flex items-center text-[10px] font-bold text-text-secondary uppercase">
                  <Globe className="h-3 w-3 mr-1.5 text-cyan-500" />
                  Server Host URL Endpoint
                </label>
                <input
                  type="text"
                  placeholder="e.g. http://localhost:11434"
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                  className="w-full bg-surface border border-border-color rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-cyan-400/50 font-mono"
                />
              </div>
            )}

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="flex items-center text-[10px] font-bold text-text-secondary uppercase">
                <Cpu className="h-3 w-3 mr-1.5 text-cyan-500" />
                Select Language Model Model
              </label>

              {aiProvider === 'ollama' ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="flex-1 bg-surface border border-border-color rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-cyan-400/50 font-mono"
                  >
                    {ollamaModels.length === 0 ? (
                      <option value="">No local models detected</option>
                    ) : (
                      ollamaModels.map(m => <option key={m} value={m}>{m}</option>)
                    )}
                  </select>
                  <button
                    onClick={() => loadOllamaModels()}
                    className="p-2 bg-surface hover:bg-white/5 border border-border-color rounded-md text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    title="Refresh local model list"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : aiProvider === 'custom' ? (
                <input
                  type="text"
                  placeholder="e.g. deepseek-chat"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="w-full bg-surface border border-border-color rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-cyan-400/50 font-mono"
                />
              ) : (
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-surface border border-border-color rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-cyan-400/50 font-mono"
                >
                  {(PROVIDER_MODELS[aiProvider] || []).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Connection Test Output */}
          <div className="flex items-center justify-between bg-[#05090f]/50 border border-border-color/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                aiConnected
                  ? 'bg-green-500/10 border-green-400 text-green-400'
                  : aiConnectionError
                    ? 'bg-red-500/10 border-red-400 text-red-400'
                    : 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500'
              }`}>
                {aiConnecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                ) : aiConnected ? (
                  <Check className="h-4 w-4" />
                ) : aiConnectionError ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <HelpCircle className="h-4 w-4" />
                )}
              </div>

              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-text-primary">Connection Telemetry Status</span>
                <p className="text-[10px] text-text-secondary leading-tight">
                  {aiConnecting
                    ? 'Pinging provider endpoint...'
                    : aiConnected
                      ? `Connection active! Latency: ${aiLatencyMs}ms — Model: ${aiModel}`
                      : aiConnectionError
                        ? `Failure: ${aiConnectionError}`
                        : 'System standby. Test connection to verify credentials.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={aiConnecting}
              className={`bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-400 text-xs font-bold font-mono tracking-widest py-1.5 px-4 rounded border border-cyan-500/40 transition-all cursor-pointer ${
                aiConnecting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              TEST_CONNECTION
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#09111f] border-t border-cyan-500/20 px-6 py-4 flex justify-end space-x-3 z-20">
          <button
            onClick={() => setShowAiSettings(false)}
            className="px-4 py-1.5 border border-border-color rounded text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await handleSave();
              setShowAiSettings(false);
            }}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 border border-cyan-400/25 rounded text-xs font-bold text-bg-primary transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
