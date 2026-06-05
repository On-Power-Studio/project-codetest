import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  Play, ShieldAlert, Cpu, CheckCircle, HelpCircle, 
  ChevronRight, RefreshCw, Globe, ChevronDown, Check 
} from 'lucide-react';

export const Workspace6_ValidationCenter: React.FC = () => {
  const { 
    validationRunning, 
    validationProgress, 
    activeValidationStep, 
    validationRunStatus, 
    dbChanges, 
    apiCalls, 
    runValidation 
  } = useAxiomStore();

  const execSteps = [
    { num: 1, label: 'Navigate to /checkout', time: '1.2s', status: activeValidationStep > 1 ? 'passed' : activeValidationStep === 1 && validationRunning ? 'running' : 'idle' },
    { num: 2, label: 'Validate cart items', time: '0.8s', status: activeValidationStep > 2 ? 'passed' : activeValidationStep === 2 && validationRunning ? 'running' : 'idle' },
    { num: 3, label: 'Enter shipping information', time: '2.1s', status: activeValidationStep > 3 ? 'passed' : activeValidationStep === 3 && validationRunning ? 'running' : 'idle' },
    { num: 4, label: 'Select payment method', time: '1.1s', status: activeValidationStep > 4 ? 'passed' : activeValidationStep === 4 && validationRunning ? 'running' : 'idle' },
    { num: 5, label: 'Submit order', time: '4.2s', status: validationRunStatus === 'Failed' ? 'failed' : activeValidationStep === 5 && validationRunning ? 'running' : 'idle' },
    { num: 6, label: 'Validate order confirmation', time: '--', status: 'idle' },
    { num: 7, label: 'Check email notification', time: '--', status: 'idle' }
  ];

  return (
    <div className="flex-1 bg-bg-primary p-4 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        
        {/* Top Validation Trigger Actions Header */}
        <div className="flex items-center justify-between border-b border-border-color pb-3">
          <div className="flex space-x-3.5 flex-1 max-w-4xl">
            {/* Action 1 */}
            <div 
              onClick={() => runValidation('full')}
              className="flex-1 bg-surface/40 hover:bg-surface border border-border-color/60 hover:border-primary-purple p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-wide">Run Validation</span>
                <span className="text-[8px] text-text-secondary block mt-0.5">Full validation suite</span>
              </div>
              <Play className="h-4.5 w-4.5 text-primary-purple fill-primary-purple/10" />
            </div>

            {/* Action 2 */}
            <div 
              onClick={() => runValidation('impacted')}
              className="flex-1 bg-surface/45 hover:bg-surface border border-border-color/60 hover:border-warning p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-wide">Run Impacted Tests</span>
                <span className="text-[8px] text-text-secondary block mt-0.5">Smart impact analysis</span>
              </div>
              <Play className="h-4.5 w-4.5 text-warning fill-warning/10" />
            </div>

            {/* Action 3 */}
            <div 
              onClick={() => runValidation('critical')}
              className="flex-1 bg-surface/45 hover:bg-surface border border-border-color/60 hover:border-danger p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-wide">Run Critical Tests</span>
                <span className="text-[8px] text-text-secondary block mt-0.5">Business critical paths</span>
              </div>
              <Play className="h-4.5 w-4.5 text-danger fill-danger/10" />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-5 text-right pl-4">
            <div className="text-xs">
              <span className="text-text-secondary text-[8.5px] block font-semibold uppercase tracking-wider">Total Tests</span>
              <span className="font-bold text-text-primary font-mono text-[14px]">1,342</span>
            </div>
            <div className="text-xs">
              <span className="text-text-secondary text-[8.5px] block font-semibold uppercase tracking-wider">Passed</span>
              <span className="font-bold text-success font-mono text-[14px]">1,152</span>
            </div>
            <div className="text-xs">
              <span className="text-text-secondary text-[8.5px] block font-semibold uppercase tracking-wider">Failed</span>
              <span className="font-bold text-danger font-mono text-[14px]">82</span>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-success border-t-transparent flex items-center justify-center">
              <span className="text-[9.5px] font-bold text-text-primary font-mono">78%</span>
            </div>
          </div>
        </div>

        {/* Central Dashboard grid layout */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          
          {/* Column 1: Live Browser Preview (Width 4/12) */}
          <div className="col-span-4 flex flex-col space-y-4 min-h-0">
            {/* Live Browser Card */}
            <div className="bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 flex-1">
              <div className="flex justify-between items-center text-[10px] text-text-secondary mb-2 shrink-0 border-b border-border-color/30 pb-1.5">
                <span className="font-bold uppercase tracking-wider">Live Browser</span>
                <div className="flex items-center space-x-1 hover:text-text-primary cursor-pointer">
                  <Globe className="h-3 w-3" />
                  <span>Axiom Store</span>
                </div>
              </div>

              {/* Browser Shell Frame */}
              <div className="flex-1 bg-white border border-border-color rounded-lg flex flex-col overflow-hidden text-black min-h-[160px] text-left select-text">
                <div className="bg-gray-100 px-3 py-1.5 flex items-center space-x-2 border-b border-gray-200 shrink-0">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-white border border-gray-300 text-[9px] text-gray-500 rounded px-2.5 py-0.5 truncate flex-1 font-mono">
                    https://app.axiom-store.com/checkout
                  </div>
                </div>

                <div className="p-3 overflow-y-auto flex-1 text-[10.5px] space-y-2.5 font-sans leading-tight">
                  <div className="border-b border-gray-200 pb-2">
                    <h4 className="font-bold text-gray-800 text-[11px]">Checkout</h4>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Order Summary</span>
                    <div className="flex justify-between items-center text-gray-600 mt-1 font-medium text-[9.5px]">
                      <span>Wireless Headphones (Qty 1)</span>
                      <span>$151.98</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Shipping Information</span>
                    <div className="bg-gray-50 border border-gray-200 rounded p-1.5 text-[9px] text-gray-600">
                      <div>John Doe</div>
                      <div>123 Main St, New York, NY 10001</div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Payment Method</span>
                    <div className="bg-gray-50 border border-gray-200 rounded p-1.5 text-[9px] text-gray-600 flex justify-between items-center">
                      <span>Visa ending in 4382</span>
                      <span className="text-[8px] font-bold font-mono">12/28</span>
                    </div>
                  </div>

                  <button className={`w-full text-center text-white py-1.5 rounded font-bold transition-all text-[10.5px] ${
                    validationRunStatus === 'Failed' 
                      ? 'bg-red-500 border border-red-600 animate-pulse' 
                      : validationRunning 
                        ? 'bg-primary-purple/80 cursor-wait animate-pulse' 
                        : 'bg-primary-purple'
                  }`}>
                    {validationRunStatus === 'Failed' ? 'Payment Failed' : validationRunning ? 'Processing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>

            {/* Execution Steps Checklists */}
            <div className="bg-surface/30 border border-border-color rounded-xl p-3 text-xs shrink-0 select-none">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Execution Steps</span>
              <div className="space-y-2">
                {execSteps.map(step => (
                  <div key={step.num} className="flex justify-between items-center py-0.5">
                    <div className="flex items-center space-x-2 truncate">
                      <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] border ${
                        step.status === 'passed' 
                          ? 'bg-success/15 border-success text-success' 
                          : step.status === 'failed' 
                            ? 'bg-danger/15 border-danger text-danger font-bold' 
                            : step.status === 'running' 
                              ? 'border-primary-purple text-primary-purple animate-pulse' 
                              : 'border-border-color text-text-secondary'
                      }`}>
                        {step.status === 'passed' ? <Check className="h-3 w-3" /> : step.num}
                      </div>
                      <span className={`text-[11px] truncate ${step.status === 'passed' ? 'text-text-primary' : 'text-text-secondary'}`}>{step.label}</span>
                    </div>
                    <span className="font-mono text-[9px] text-text-secondary">{step.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Diagnostic Timelines & Changes (Width 8/12) */}
          <div className="col-span-8 grid grid-rows-2 gap-4 min-h-0">
            
            {/* Top row: Network Monitor + API Timeline */}
            <div className="grid grid-cols-2 gap-4 min-h-0">
              {/* Network Monitor */}
              <div className="bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs select-none">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Network Monitor</span>
                <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9.5px] text-text-secondary mb-2 shrink-0">
                  <div><span className="block text-[8px] uppercase">Reqs</span><span className="text-text-primary font-bold">128</span></div>
                  <div><span className="block text-[8px] uppercase">Size</span><span className="text-text-primary font-bold">12.4 MB</span></div>
                  <div><span className="block text-[8px] uppercase">Avg. Time</span><span className="text-text-primary font-bold">892ms</span></div>
                  <div><span className="block text-[8px] uppercase">Errors</span><span className="text-danger font-bold">2</span></div>
                </div>

                {/* Simulated network Requests table list */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-1 font-mono text-[9.5px]">
                  {apiCalls.map((call, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 hover:bg-surface/30 px-1.5 rounded transition-all">
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`font-bold shrink-0 ${call.status === 200 || call.status === 201 ? 'text-success' : 'text-danger'}`}>
                          {call.method}
                        </span>
                        <span className="text-text-primary truncate">{call.url}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-text-secondary font-medium">
                        <span>{call.status}</span>
                        <span>{call.time}ms</span>
                        <span>{call.size}</span>
                      </div>
                    </div>
                  ))}
                  {apiCalls.length === 0 && (
                    <div className="h-full flex items-center justify-center text-text-secondary text-[10px]">No active requests running.</div>
                  )}
                </div>
              </div>

              {/* API Timeline Gantt */}
              <div className="bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs select-none">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">API Timeline</span>
                
                {/* Simulated Timeline Bars */}
                <div className="flex-1 flex flex-col justify-center space-y-2.5 pr-2 font-mono text-[9px] relative min-h-[100px]">
                  {apiCalls.map((call, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="w-24 text-text-secondary truncate shrink-0 text-right pr-2">{call.url}</span>
                      <div className="flex-1 h-2 relative bg-surface border border-border-color/20 rounded-full overflow-hidden">
                        <div 
                          className={`absolute h-full rounded-full transition-all duration-300 ${
                            call.color === 'danger' ? 'bg-danger' : call.color === 'warning' ? 'bg-warning' : 'bg-primary-purple'
                          }`}
                          style={{ left: `${call.offset}%`, width: `${call.duration}%` }}
                        />
                      </div>
                      <span className="w-10 text-text-primary text-right pl-2 font-bold shrink-0">{call.time}ms</span>
                    </div>
                  ))}
                  {apiCalls.length === 0 && (
                    <div className="h-full flex items-center justify-center text-text-secondary text-[10px]">Timeline empty. Run validations.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom row: Database Changes */}
            <div className="bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs select-none">
              <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-border-color/30 shrink-0">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Database Transactions</span>
                <div className="flex space-x-4 font-mono text-[9px] text-text-secondary">
                  <div>Inserts: <span className="text-text-primary font-bold">14</span></div>
                  <div>Updates: <span className="text-text-primary font-bold">2</span></div>
                  <div>Deletes: <span className="text-text-primary font-bold">0</span></div>
                </div>
              </div>

              {/* Transactions log list */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-1 font-mono text-[10px]">
                {dbChanges.map((change, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 hover:bg-surface/30 px-1.5 rounded transition-all">
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="text-text-secondary">{change.time}</span>
                      <span className={`font-semibold shrink-0 uppercase ${
                        change.operation === 'INSERT' ? 'text-success' : 'text-warning'
                      }`}>{change.operation}</span>
                      <span className="text-text-primary font-bold">db.{change.table}</span>
                    </div>
                    <span className="text-text-secondary font-medium">Affected: {change.rows} row(s)</span>
                  </div>
                ))}
                {dbChanges.length === 0 && (
                  <div className="h-full flex items-center justify-center text-text-secondary text-[10px]">No DB transactions recorded.</div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
