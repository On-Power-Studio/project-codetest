import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  Play, ShieldAlert, Cpu, CheckCircle, HelpCircle, 
  ChevronRight, RefreshCw, Globe, ChevronDown, Check,
  GitPullRequest, GitBranch, AlertCircle, HardDrive, Wifi,
  Zap, AlertTriangle, ShieldCheck, Terminal as TerminalIcon,
  MessageSquare, ExternalLink
} from 'lucide-react';

export const Workspace6_ValidationCenter: React.FC = () => {
  const { 
    validationRunning, 
    validationProgress, 
    activeValidationStep, 
    validationRunStatus, 
    dbChanges, 
    apiCalls, 
    runValidation,
    devPushStatus,
    releaseDecision,
    releaseReadinessScore,
    resilienceScore,
    chaosMode,
    piiLeaksFound,
    activeTriage,
    triggerDevPush,
    setChaosMode
  } = useAxiomStore();

  const execSteps = [
    { num: 1, label: 'Navigate to /checkout', time: '1.2s', status: activeValidationStep > 1 ? 'passed' : activeValidationStep === 1 && validationRunning ? 'running' : 'idle' },
    { num: 2, label: 'Validate cart items', time: '0.8s', status: activeValidationStep > 2 ? 'passed' : activeValidationStep === 2 && validationRunning ? 'running' : 'idle' },
    { num: 3, label: 'Enter shipping information', time: '2.1s', status: activeValidationStep > 3 ? 'passed' : activeValidationStep === 3 && validationRunning ? 'running' : 'idle' },
    { num: 4, label: 'Select payment method', time: '1.1s', status: activeValidationStep > 4 ? 'passed' : activeValidationStep === 4 && validationRunning ? 'running' : 'idle' },
    { num: 5, label: 'Submit order', time: '4.2s', status: validationRunStatus === 'Failed' ? 'failed' : activeValidationStep === 5 && validationRunning ? 'running' : 'idle' },
    { num: 6, label: 'Validate PII & Privacy Leak guardrails', time: '1.5s', status: activeValidationStep === 5 && !validationRunning ? (chaosMode === 'service_shutdown' ? 'idle' : 'passed') : 'idle' },
    { num: 7, label: 'Check email notification & SLAs', time: '1.0s', status: activeValidationStep === 5 && !validationRunning ? (chaosMode === 'service_shutdown' ? 'idle' : 'passed') : 'idle' }
  ];

  return (
    <div className="flex-1 bg-[#02050b] p-4 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none relative">
      {/* Scanline pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      <div className="space-y-4 flex-1 flex flex-col min-h-0 z-20">
        
        {/* Top Validation Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyan-500/20 pb-3 gap-3">
          <div>
            <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-400 animate-pulse" /> Mission Validation Control
            </h2>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mt-0.5">
              Phase 5: Automated gating with real-time UI/API testing & Chaos Resilience engines.
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-5 text-right pl-4">
            <div className="text-xs">
              <span className="text-slate-500 text-[8.5px] block font-semibold uppercase tracking-wider">Total Tests</span>
              <span className="font-bold text-white font-mono text-[14px]">1,342</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-500 text-[8.5px] block font-semibold uppercase tracking-wider">Passed</span>
              <span className="font-bold text-green-400 font-mono text-[14px]">{chaosMode === 'service_shutdown' ? '1,324' : '1,342'}</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-500 text-[8.5px] block font-semibold uppercase tracking-wider">Failed</span>
              <span className="font-bold text-red-400 font-mono text-[14px]">{chaosMode === 'service_shutdown' ? '18' : '0'}</span>
            </div>
            <div className={`h-10 w-10 rounded-full border-4 ${chaosMode === 'service_shutdown' ? 'border-red-500/40 text-red-400' : 'border-green-500/40 text-green-400'} flex items-center justify-center`}>
              <span className="text-[9.5px] font-bold font-mono">{chaosMode === 'service_shutdown' ? '98.6%' : '100%'}</span>
            </div>
          </div>
        </div>

        {/* Central Dashboard 3-Column Grid Layout */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          
          {/* Column 1: Release Readiness, Push Simulator, Chaos Injector (Width 4/12) */}
          <div className="col-span-4 flex flex-col space-y-4 min-h-0">
            
            {/* 1. Release Readiness Center */}
            <div className="bg-[#050b18]/90 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(6,182,212,0.03)] relative">
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[7.5px] font-mono text-cyan-400 tracking-wider">REALTIME_GATE</span>
              </div>
              <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1 border-b border-cyan-500/10">Release Readiness Center</span>
              
              <div className="flex items-center justify-between my-2">
                <div className="flex flex-col">
                  <span className="text-[8.5px] font-mono text-slate-500 uppercase">Readiness Decision</span>
                  <div className={`text-2xl font-black font-mono tracking-widest ${
                    releaseDecision === 'GO' 
                      ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]' 
                      : releaseDecision === 'NO-GO' 
                        ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                        : 'text-amber-500'
                  }`}>
                    {releaseDecision === 'PENDING' ? 'PENDING...' : `${releaseDecision}`}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8.5px] font-mono text-slate-500 uppercase">Score</span>
                  <div className={`text-2xl font-bold font-mono ${
                    releaseReadinessScore >= 90 
                      ? 'text-green-400' 
                      : releaseReadinessScore >= 70 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                  }`}>
                    {releaseReadinessScore}%
                  </div>
                </div>
              </div>

              {/* Status Checks grid */}
              <div className="space-y-1.5 font-mono text-[9px] text-slate-400 pt-2 border-t border-cyan-500/10">
                <div className="flex justify-between items-center">
                  <span>COMPLIANCE & PII SCAN:</span>
                  <span className="font-bold text-green-400 flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3 inline text-green-400" />
                    <span>PASSED</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SLA PERFORMANCE:</span>
                  {chaosMode === 'network_throttle' ? (
                    <span className="font-bold text-yellow-400 flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3 inline text-yellow-400" />
                      <span>WARNING</span>
                    </span>
                  ) : chaosMode === 'service_shutdown' ? (
                    <span className="font-bold text-red-500 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3 inline text-red-500" />
                      <span>SLA_FAILED</span>
                    </span>
                  ) : (
                    <span className="font-bold text-green-400 flex items-center space-x-1">
                      <Check className="h-3 w-3 inline text-green-400" />
                      <span>PASSED</span>
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>CHAOS RESILIENCE:</span>
                  <span className={`font-bold ${
                    resilienceScore >= 90 ? 'text-green-400' : resilienceScore >= 70 ? 'text-yellow-400' : 'text-red-500'
                  } flex items-center space-x-1`}>
                    {resilienceScore >= 80 ? (
                      <Check className="h-3 w-3 inline text-green-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 inline text-red-500" />
                    )}
                    <span>{resilienceScore}% ({chaosMode === 'none' ? 'EXCELLENT' : chaosMode === 'service_shutdown' ? 'CRITICAL' : 'DEGRADED'})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Developer Git Push Simulator */}
            <div className="bg-[#050b18]/90 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(6,182,212,0.03)]">
              <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1 border-b border-cyan-500/10">Swarm Event Simulator</span>
              <p className="text-[10px] text-slate-400 font-sans mb-3 leading-relaxed">
                Phase 5 testing triggers automatically on Git push. AXIOM's Explorer and API agents crawl UI/REST routes concurrently to render Go/No-Go decisions.
              </p>
              
              <button 
                onClick={triggerDevPush}
                disabled={devPushStatus === 'pushing' || devPushStatus === 'swarm_running'}
                className={`w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                  devPushStatus === 'pushing' || devPushStatus === 'swarm_running'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 cursor-wait animate-pulse'
                    : 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 hover:from-cyan-600/55 hover:to-purple-600/55 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)] hover:border-cyan-400'
                }`}
              >
                <GitPullRequest className="h-4 w-4" />
                <span>
                  {devPushStatus === 'pushing' 
                    ? 'Pushing Code...' 
                    : devPushStatus === 'swarm_running' 
                      ? 'Swarm Active...' 
                      : 'Simulate Developer Push'}
                </span>
              </button>

              {devPushStatus !== 'idle' && (
                <div className="mt-2 text-center text-[8.5px] font-mono text-cyan-500 animate-pulse">
                  Workflow status: {devPushStatus.toUpperCase()}
                </div>
              )}
            </div>

            {/* 3. Chaos Engineering Injector Panel */}
            <div className="bg-[#050b18]/90 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(6,182,212,0.03)]">
              <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1 border-b border-cyan-500/10">Chaos Engineering Injector</span>
              
              <div className="space-y-2.5 my-2">
                {[
                  { id: 'none', title: 'None (Baseline Staging)', desc: 'Systems running in optimal parameters.' },
                  { id: 'network_throttle', title: 'Throttle Network (Staging)', desc: 'Spikes response latency (5x latency) to evaluate client degradation.' },
                  { id: 'cpu_spike', title: 'Spike Host CPU (99% Load)', desc: 'Spikes container CPU limits to verify service execution resilience.' },
                  { id: 'service_shutdown', title: 'Shutdown Payment Gateway API', desc: 'Forces 503 Service Unavailable to verify failure handling & routing.' }
                ].map(mode => (
                  <label 
                    key={mode.id} 
                    className={`flex items-start space-x-3 p-2 rounded border cursor-pointer transition-all ${
                      chaosMode === mode.id 
                        ? 'bg-red-500/10 border-red-500/40 text-white' 
                        : 'bg-[#02050b]/80 border-cyan-500/5 hover:border-cyan-500/25 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="chaos"
                      checked={chaosMode === mode.id}
                      onChange={() => setChaosMode(mode.id as any)}
                      className="mt-0.5 rounded-full text-red-500 bg-bg-primary border-border-color h-3.5 w-3.5"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold font-mono leading-tight">{mode.title}</div>
                      <div className="text-[8px] text-slate-500 leading-normal mt-0.5">{mode.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="text-[7.5px] font-mono text-red-400/80 mt-1 border-t border-red-500/10 pt-2 flex items-center space-x-1">
                <Zap className="h-3 w-3 inline text-red-400" />
                <span>Chaos updates feed directly into the Release Readiness decision loop.</span>
              </div>
            </div>

          </div>

          {/* Column 2: Live Browser & Execution Steps (Width 4/12) */}
          <div className="col-span-4 flex flex-col space-y-4 min-h-0">
            
            {/* Live Browser Card */}
            <div className="bg-[#050b18]/90 border border-cyan-500/20 rounded-xl p-3 flex flex-col min-h-0 flex-1 relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2 shrink-0 border-b border-cyan-500/10 pb-1.5">
                <span className="font-bold uppercase tracking-wider font-mono">Live Headless Browser</span>
                <div className="flex items-center space-x-1 text-cyan-400">
                  <Globe className="h-3 w-3" />
                  <span className="font-mono text-[9px]">AXIOM_BROWSER</span>
                </div>
              </div>

              {/* Browser Shell Frame */}
              <div className="flex-1 bg-white border border-slate-300 rounded-lg flex flex-col overflow-hidden text-black min-h-[160px] text-left select-text relative">
                
                {/* Explorer Agent scanning overlay */}
                {devPushStatus === 'swarm_running' && (
                  <div className="absolute inset-0 bg-cyan-500/15 border-2 border-cyan-400/90 rounded-lg flex flex-col items-center justify-center pointer-events-none z-30">
                    <div className="absolute top-0 w-full h-[3px] bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] animate-pulse" style={{ animationDuration: '0.8s' }} />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)] animate-ping" style={{ animationDuration: '2s' }} />
                    <span className="font-mono text-[9px] font-bold text-cyan-400 bg-[#02050b] border border-cyan-400/30 px-2.5 py-1 rounded shadow-lg uppercase tracking-widest text-center">
                      Explorer Agent:<br/>Mapping UI Elements
                    </span>
                  </div>
                )}

                <div className="bg-slate-200 px-3 py-1.5 flex items-center space-x-2 border-b border-slate-300 shrink-0">
                  <div className="flex space-x-1 shrink-0">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-white border border-slate-300 text-[9px] text-slate-500 rounded px-2.5 py-0.5 truncate flex-1 font-mono">
                    https://staging.axiom-store.com/checkout
                  </div>
                </div>

                <div className="p-3 overflow-y-auto flex-1 text-[10.5px] space-y-2.5 font-sans leading-tight">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-800 text-[11px]">Staging Checkout</h4>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Order Summary</span>
                    <div className="flex justify-between items-center text-slate-600 mt-1 font-medium text-[9.5px]">
                      <span>Wireless Headphones (Qty 1)</span>
                      <span>$151.98</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Shipping Information</span>
                    <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[9px] text-slate-600">
                      <div>John Doe</div>
                      <div>123 Main St, New York, NY 10001</div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Payment Method</span>
                    <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[9px] text-slate-600 flex justify-between items-center">
                      <span>Visa ending in 4382</span>
                      <span className="text-[8px] font-bold font-mono">12/28</span>
                    </div>
                  </div>

                  <button className={`w-full text-center text-white py-1.5 rounded font-bold transition-all text-[10.5px] ${
                    chaosMode === 'service_shutdown' && !validationRunning
                      ? 'bg-red-500 border border-red-600' 
                      : validationRunning 
                        ? 'bg-purple-600/80 cursor-wait animate-pulse' 
                        : 'bg-purple-600'
                  }`}>
                    {chaosMode === 'service_shutdown' && !validationRunning 
                      ? 'Checkout Service Offline (503)' 
                      : validationRunning 
                        ? 'Validating Gateway...' 
                        : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>

            {/* Execution Steps Checklists */}
            <div className="bg-[#050b18]/90 border border-cyan-500/20 rounded-xl p-3 text-xs shrink-0 select-none">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10 font-mono">Autonomous Execution Steps</span>
              <div className="space-y-2">
                {execSteps.map((step, idx) => (
                  <div key={idx} className="flex justify-between items-center py-0.5">
                    <div className="flex items-center space-x-2 truncate">
                      <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] border ${
                        step.status === 'passed' 
                          ? 'bg-green-500/15 border-green-500 text-green-400' 
                          : step.status === 'failed' 
                            ? 'bg-red-500/15 border-red-500 text-red-500 font-bold' 
                            : step.status === 'running' 
                              ? 'border-purple-400 text-purple-400 animate-pulse' 
                              : 'border-slate-700 text-slate-500'
                      }`}>
                        {step.status === 'passed' ? <Check className="h-3 w-3" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] truncate ${step.status === 'passed' ? 'text-white' : 'text-slate-400'}`}>{step.label}</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">{step.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Diagnostic Telemetry, DB scan, Auto-Triage (Width 4/12) */}
          <div className="col-span-4 flex flex-col space-y-4 min-h-0">
            
            {/* Network Monitor */}
            <div className="bg-[#050b18]/90 border border-cyan-500/20 rounded-xl p-3 flex flex-col min-h-[140px] text-xs select-none">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-1.5 pb-1 border-b border-cyan-500/10 font-mono">Network Monitor</span>
              
              {devPushStatus === 'swarm_running' && (
                <div className="flex items-center justify-center space-x-2 text-[9px] text-purple-400 font-mono py-1 animate-pulse border-b border-cyan-500/5 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
                  <span>API Testing Studio validating concurrently...</span>
                </div>
              )}

              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px] text-slate-500 mb-2 shrink-0">
                <div><span className="block text-[8px] uppercase">Reqs</span><span className="text-white font-bold">{apiCalls.length > 0 ? apiCalls.length + 8 : 128}</span></div>
                <div><span className="block text-[8px] uppercase">Size</span><span className="text-white font-bold">{apiCalls.length > 0 ? '27.5 KB' : '12.4 MB'}</span></div>
                <div><span className="block text-[8px] uppercase">Avg. Latency</span><span className="text-white font-bold">{chaosMode === 'network_throttle' ? '2450ms' : '82ms'}</span></div>
                <div><span className="block text-[8px] uppercase">Errors</span><span className={`${chaosMode === 'service_shutdown' ? 'text-red-400' : 'text-green-400'} font-bold`}>{chaosMode === 'service_shutdown' ? '1' : '0'}</span></div>
              </div>

              {/* Simulated network Requests table list */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-1 font-mono text-[9px]">
                {apiCalls.map((call, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 hover:bg-[#02050b] px-1.5 rounded transition-all border border-transparent hover:border-cyan-500/10">
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`font-bold shrink-0 ${call.status === 200 || call.status === 201 ? 'text-green-400' : 'text-red-400'}`}>
                        {call.method}
                      </span>
                      <span className="text-slate-300 truncate">{call.url}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-500 font-medium shrink-0 ml-1">
                      <span>{call.status}</span>
                      <span className={chaosMode === 'network_throttle' && call.url.includes('payments') ? 'text-yellow-400 font-bold' : ''}>{call.time}ms</span>
                    </div>
                  </div>
                ))}
                {apiCalls.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-500 text-[9.5px]">Awaiting Git Push events to populate.</div>
                )}
              </div>
            </div>

            {/* Compliance Monitor & DB checks */}
            <div className="bg-[#050b18]/90 border border-cyan-500/20 rounded-xl p-3 flex flex-col min-h-[140px] text-xs select-none">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-2 pb-1 border-b border-cyan-500/10 font-mono">Compliance & DB Transactions</span>
              
              <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-cyan-500/5 shrink-0">
                <span className="text-[8px] font-mono text-slate-500">GDPR Payload Masking</span>
                <span className={`font-bold font-mono text-[9px] ${piiLeaksFound > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {piiLeaksFound > 0 ? `PII_LEAK_DETECTED` : 'SECURE (0 LEAKS)'}
                </span>
              </div>

              {/* Transactions log list */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-1 font-mono text-[9px]">
                <div className="flex items-center justify-between text-slate-400 py-0.5 border-b border-cyan-500/5">
                  <span>Inspection Engine:</span>
                  <span className="text-green-400">GDPR + CCPA Guardrails</span>
                </div>
                
                {dbChanges.map((change, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 hover:bg-[#02050b] px-1 rounded transition-all text-[8.5px]">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-slate-500">{change.time}</span>
                      <span className={`font-semibold shrink-0 uppercase ${
                        change.operation === 'INSERT' ? 'text-green-400' : 'text-yellow-400'
                      }`}>{change.operation}</span>
                      <span className="text-slate-300 font-bold truncate">db.{change.table}</span>
                    </div>
                    <span className="text-slate-500 shrink-0 ml-1">Rows: {change.rows}</span>
                  </div>
                ))}

                {dbChanges.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-500 text-[9.5px] pt-4">No active DB queries recorded.</div>
                )}
              </div>
            </div>

            {/* 4. Auto-Triage & Intelligent Routing card */}
            {activeTriage && (
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3.5 flex flex-col min-h-[160px] text-xs shadow-[0_0_15px_rgba(239,68,68,0.05)] animate-fade-in">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold font-mono text-red-400 uppercase tracking-wider">Auto-Triage & Route</span>
                  </div>
                  <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                    ACTIVE_ROUTING
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[9px] text-slate-300 flex-1">
                  <div className="flex justify-between">
                    <span>BREAKING FILE:</span>
                    <span className="text-red-400 font-bold">{activeTriage.file}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COMMIT AUTHOR:</span>
                    <span className="text-cyan-400 font-bold">{activeTriage.assignedTo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>JIRA TICKET:</span>
                    <span className="text-white bg-slate-800 px-1 border border-slate-700 rounded text-[8.5px] flex items-center gap-1 font-semibold leading-tight">
                      <ExternalLink className="h-2.5 w-2.5 inline" /> {activeTriage.jiraTicket}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLACK HANDOFF:</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                      <MessageSquare className="h-2.5 w-2.5 inline" /> {activeTriage.slackChannel}
                    </span>
                  </div>

                  {/* Rich Reproducer Package Info */}
                  <div className="mt-2.5 p-2 bg-[#02050b]/80 border border-red-500/15 rounded text-[8.5px] leading-relaxed">
                    <div className="font-bold text-red-400/95 uppercase mb-1 font-mono tracking-wider">[Rich Handoff Package Sent]</div>
                    <div className="text-slate-400 truncate"><strong className="text-slate-300">Stack:</strong> {activeTriage.stackTrace}</div>
                    <div className="text-slate-400 truncate mt-0.5"><strong className="text-slate-300">Path:</strong> 1. Navigate to /checkout → 2. Place Order → Payment 503</div>
                    <div className="text-green-400/90 font-bold mt-1 text-[8px] font-mono">✓ Screen recording & traces attached to Jira ticket.</div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
