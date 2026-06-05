import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { PlayCircle, Eye, AlertTriangle, ArrowRight, Layers, HelpCircle } from 'lucide-react';

export const Workspace8_ImpactAnalysis: React.FC = () => {
  const { modifiedCodePath } = useAxiomStore();

  const paths = [
    { flow: 'POST /api/orders → OrderService → PaymentService → payments', score: '9.8', col: 'text-danger' },
    { flow: 'POST /api/orders → Checkout → OrderSummary → OrderService', score: '9.2', col: 'text-danger' },
    { flow: 'POST /api/orders → InventoryService → inventory → order_items', score: '8.9', col: 'text-warning' },
    { flow: 'POST /api/orders → PricingService → OrderForm → /checkout', score: '7.8', col: 'text-warning' },
    { flow: 'POST /api/orders → NotificationService → emails → users', score: '6.9', col: 'text-text-secondary' }
  ];

  const timeline = [
    { time: '10:24:31', event: 'Change detected in POST /api/orders', diff: '31s ago' },
    { time: '10:24:32', event: 'Analyzing dependencies', diff: '30s ago' },
    { time: '10:24:35', event: 'Building impact graph', diff: '26s ago' },
    { time: '10:24:41', event: 'Calculating risk scores', diff: '20s ago' },
    { time: '10:24:47', event: 'AI analysis complete', diff: '14s ago' },
    { time: '10:24:51', event: 'Impact analysis ready', diff: '10s ago' }
  ];

  return (
    <div className="flex-1 bg-bg-primary p-4 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="border-b border-border-color pb-3">
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide">Impact Analysis</h2>
          <span className="text-[11px] text-text-secondary">Predict the ripple effect of code changes across UI components, APIs, databases, and tests.</span>
        </div>

        {/* Top Section: Change details (Left) & Impact Dependency Graph (Right) */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          
          {/* Left Column: Change details & Risk matrix (Width 3/12) */}
          <div className="col-span-3 space-y-4">
            
            {/* Change Detected Card */}
            <div className="bg-surface/30 border border-border-color rounded-xl p-3 text-xs">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2.5">Change Detected</span>
              <div className="bg-bg-primary/50 border border-border-color/60 p-2.5 rounded-lg mb-3">
                <div className="flex justify-between items-center"><span className="text-success font-bold font-mono">POST</span><span className="text-text-secondary text-[10px]">31s ago</span></div>
                <div className="text-text-primary font-bold mt-1">POST /api/orders</div>
                <div className="text-text-secondary text-[9px] font-mono mt-0.5 truncate">{modifiedCodePath}</div>
              </div>
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between"><span>Type:</span><span className="text-text-primary">API Endpoint</span></div>
                <div className="flex justify-between"><span>Change Type:</span><span className="text-text-primary">Modified</span></div>
                <div className="flex justify-between">
                  <span>Impact Scope:</span>
                  <span className="text-danger font-bold uppercase tracking-wider">High</span>
                </div>
                <div className="flex justify-between"><span>Lines Changed:</span><span className="text-success font-bold font-mono">+24 -8</span></div>
              </div>
              <button className="w-full text-center bg-surface border border-border-color text-[10px] text-text-primary hover:text-primary-purple py-1 px-2.5 rounded mt-3.5 flex items-center justify-center space-x-1.5 cursor-pointer">
                <Eye className="h-3.5 w-3.5" />
                <span>View Change Diff</span>
              </button>
            </div>

            {/* Affected Summary Card */}
            <div className="bg-surface/30 border border-border-color rounded-xl p-3 text-xs">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2.5">Affected Summary</span>
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between"><span>Pages:</span><span className="text-text-primary font-mono font-medium">156 <span className="text-danger font-bold text-[9px] ml-1">↑ 23</span></span></div>
                <div className="flex justify-between"><span>Components:</span><span className="text-text-primary font-mono font-medium">342 <span className="text-danger font-bold text-[9px] ml-1">↑ 45</span></span></div>
                <div className="flex justify-between"><span>Services:</span><span className="text-text-primary font-mono font-medium">28 <span className="text-danger font-bold text-[9px] ml-1">↑ 8</span></span></div>
                <div className="flex justify-between"><span>Database Tables:</span><span className="text-text-primary font-mono font-medium">42 <span className="text-danger font-bold text-[9px] ml-1">↑ 12</span></span></div>
                <div className="flex justify-between"><span>Tests:</span><span className="text-text-primary font-mono font-medium">312 <span className="text-danger font-bold text-[9px] ml-1">↑ 67</span></span></div>
                <div className="h-px bg-border-color my-1" />
                <div className="flex justify-between font-bold"><span>Total Affected:</span><span className="text-danger font-mono">4,782</span></div>
              </div>
            </div>

            {/* Risk matrix Card */}
            <div className="bg-surface/30 border border-border-color rounded-xl p-3 text-xs">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Risk Visualization</span>
              
              {/* Risk matrix grid */}
              <div className="grid grid-cols-4 gap-1 mt-2 text-center text-[8px] font-bold uppercase tracking-wider relative h-16">
                {/* Visual colored grids */}
                <div className="bg-danger/25 border border-danger/30 rounded flex items-center justify-center text-danger">Critical</div>
                <div className="bg-danger/20 border border-danger/20 rounded flex items-center justify-center text-danger">High</div>
                <div className="bg-warning/20 border border-warning/30 rounded flex items-center justify-center text-warning">Medium</div>
                <div className="bg-success/20 border border-success/30 rounded flex items-center justify-center text-success">Low</div>

                {/* Target icon on High */}
                <div className="absolute top-[20%] left-[35%] bg-danger h-3 w-3 rounded-full border border-text-primary animate-ping" />
                <div className="absolute top-[22%] left-[37%] bg-danger h-2 w-2 rounded-full border border-text-primary" />
              </div>
              <div className="flex justify-between text-[8px] text-text-secondary mt-1 font-mono">
                <span>Low Likelihood</span>
                <span>High Likelihood</span>
              </div>
            </div>

          </div>

          {/* Right Column: Impact Dependency Graph Flow (Width 9/12) */}
          <div className="col-span-9 bg-surface/30 border border-border-color rounded-xl p-3.5 flex flex-col justify-between min-h-[400px]">
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-border-color/30">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Impact Dependency Graph</span>
              <div className="flex items-center space-x-4 font-mono text-[9px] text-text-secondary">
                <div>Total Affected: <span className="text-text-primary font-bold">4,782</span></div>
                <div>Direct: <span className="text-text-primary font-bold">1,246</span></div>
                <div>Indirect: <span className="text-text-primary font-bold">3,536</span></div>
              </div>
            </div>

            {/* Simulated Horizontal Columns Network */}
            <div className="flex-1 relative flex items-center justify-between px-3 text-[10px] space-x-6 min-h-[260px]">
              
              {/* Column 1: Pages */}
              <div className="flex-1 space-y-2.5">
                <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Pages (156)</span>
                {['/checkout', '/cart', '/orders', '/order-confirmation'].map(n => (
                  <div key={n} className="bg-surface/50 border border-border-color rounded px-2.5 py-1.5 text-center truncate text-[10px]">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 2: Components */}
              <div className="flex-1 space-y-2.5">
                <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Components (342)</span>
                {['OrderForm', 'OrderSummary', 'PaymentMethod', 'AddressForm'].map(n => (
                  <div key={n} className="bg-surface/50 border border-border-color rounded px-2.5 py-1.5 text-center truncate text-[10px]">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 3: Services */}
              <div className="flex-1 space-y-2.5">
                <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Services (28)</span>
                {['OrderService', 'PaymentService', 'InventoryService', 'NotificationService'].map(n => (
                  <div key={n} className="bg-surface border border-primary-purple/50 rounded px-2.5 py-1.5 text-center truncate text-[10px] glow-purple text-text-primary font-semibold">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 4: Databases */}
              <div className="flex-1 space-y-2.5">
                <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Database (42)</span>
                {['orders', 'order_items', 'payments', 'inventory'].map(n => (
                  <div key={n} className="bg-surface border border-danger/60 rounded px-2.5 py-1.5 text-center truncate text-[10px] glow-red text-text-primary">
                    {n}
                  </div>
                ))}
              </div>

              {/* Column 5: Tests */}
              <div className="flex-1 space-y-2.5">
                <span className="text-[8px] font-bold text-text-secondary block mb-1 text-center tracking-wider uppercase">Tests (312)</span>
                {['order.api.spec.ts', 'order.service.spec.ts', 'checkout.e2e.spec.ts', 'payment.spec.ts'].map(n => (
                  <div key={n} className="bg-surface/50 border border-border-color rounded px-2.5 py-1.5 text-center truncate text-[10px] font-mono">
                    {n}
                  </div>
                ))}
              </div>

              {/* Dotted paths SVG overlay */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20">
                <path d="M 120 70 C 160 70, 180 120, 220 120 M 220 120 C 260 120, 280 90, 320 90 M 320 90 C 360 90, 380 150, 420 150" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3" />
                <path d="M 120 120 C 160 120, 180 70, 220 70 M 220 70 C 260 70, 280 180, 320 180 M 320 180 C 360 180, 380 70, 420 70" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Section details row */}
        <div className="grid grid-cols-12 gap-4 min-h-0 select-none">
          
          {/* Bottom Left: Dependency Paths (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Dependency Paths (Top 5)</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 text-[10px] font-mono leading-tight">
              {paths.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 hover:bg-surface/30 px-1 rounded transition-all">
                  <span className="text-text-secondary truncate max-w-[200px]">{p.flow}</span>
                  <span className={`font-bold font-mono ml-2 shrink-0 ${p.col}`}>{p.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Middle: Timeline Logs (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Impact Timeline</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 font-mono text-[9.5px] text-text-secondary leading-normal">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div className="flex space-x-2">
                    <span className="text-text-secondary shrink-0">{item.time}</span>
                    <span className="text-text-primary">{item.event}</span>
                  </div>
                  <span className="text-text-secondary shrink-0 font-medium">{item.diff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right: Top Risky Nodes (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Top Risky Nodes</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 font-mono text-[10px]">
              {[
                { name: 'PaymentService', type: 'Service', risk: 9.8, col: 'text-danger' },
                { name: 'payments', type: 'Table', risk: 9.6, col: 'text-danger' },
                { name: 'OrderService', type: 'Service', risk: 9.2, col: 'text-danger' },
                { name: 'checkout.e2e.spec.ts', type: 'Test', risk: 9.1, col: 'text-danger' },
                { name: 'order.service.spec.ts', type: 'Test', risk: 8.9, col: 'text-warning' }
              ].map(node => (
                <div key={node.name} className="flex justify-between items-center py-1 hover:bg-surface/30 px-1 rounded transition-all">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-text-primary font-bold truncate">{node.name}</span>
                    <span className="text-[8px] uppercase font-bold text-text-secondary bg-surface border border-border-color px-1 rounded shrink-0">{node.type}</span>
                  </div>
                  <span className={`font-bold font-mono ml-2 shrink-0 ${node.col}`}>{node.risk}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
