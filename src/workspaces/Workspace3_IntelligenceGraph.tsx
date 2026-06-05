import React, { useState, useRef } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Search, ZoomIn, ZoomOut, Maximize, Move, HelpCircle, Activity, Radio, Cpu } from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'ui' | 'component' | 'api' | 'service' | 'db' | 'external';
  col: number; // 0: UI, 1: Component, 2: API, 3: Service, 4: DB, 5: External
  connections: string[]; // Connected node IDs
}

export const Workspace3_IntelligenceGraph: React.FC = () => {
  const { selectedGraphNode, setSelectedGraphNode, graphViewMode, setGraphViewMode, analysisResult } = useAxiomStore();
  
  // Pan and Zoom States
  const [scale, setScale] = useState(0.85);
  const [pan, setPan] = useState({ x: 50, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const viewTabs = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'data', label: 'Data Flow' },
    { id: 'request', label: 'Request Flow' },
    { id: 'coverage', label: 'Coverage Flow' },
    { id: 'risk', label: 'Risk Flow' }
  ];

  const defaultNodes: GraphNode[] = [
    // Column 0: Pages
    { id: 'HomePage', name: 'HomePage', type: 'ui', col: 0, connections: ['CheckoutForm'] },
    { id: 'ProductPage', name: 'ProductPage', type: 'ui', col: 0, connections: ['OrderSummary'] },
    { id: 'CartPage', name: 'CartPage', type: 'ui', col: 0, connections: ['CheckoutForm'] },
    { id: 'CheckoutPage', name: '/checkout', type: 'ui', col: 0, connections: ['CheckoutForm', 'OrderSummary', 'PaymentMethod', 'AddressForm', 'CouponInput'] },
    { id: 'LoginPage', name: 'LoginPage', type: 'ui', col: 0, connections: ['PaymentMethod'] },
    { id: 'ProfilePage', name: 'ProfilePage', type: 'ui', col: 0, connections: ['PlaceOrderButton'] },

    // Column 1: Components
    { id: 'CheckoutForm', name: 'CheckoutForm', type: 'component', col: 1, connections: ['POST_orders', 'GET_cart'] },
    { id: 'OrderSummary', name: 'OrderSummary', type: 'component', col: 1, connections: ['POST_orders'] },
    { id: 'PaymentMethod', name: 'PaymentMethod', type: 'component', col: 1, connections: ['POST_payments'] },
    { id: 'AddressForm', name: 'AddressForm', type: 'component', col: 1, connections: ['POST_orders'] },
    { id: 'CouponInput', name: 'CouponInput', type: 'component', col: 1, connections: ['GET_coupons'] },
    { id: 'PlaceOrderButton', name: 'PlaceOrderButton', type: 'component', col: 1, connections: ['POST_orders'] },

    // Column 2: APIs
    { id: 'POST_orders', name: 'POST /api/orders', type: 'api', col: 2, connections: ['OrderService'] },
    { id: 'GET_cart', name: 'GET /api/cart', type: 'api', col: 2, connections: ['OrderService'] },
    { id: 'POST_payments', name: 'POST /api/payments', type: 'api', col: 2, connections: ['PaymentService'] },
    { id: 'GET_coupons', name: 'GET /api/coupons', type: 'api', col: 2, connections: ['CouponService'] },
    { id: 'GET_users', name: 'GET /api/users/me', type: 'api', col: 2, connections: ['UserService'] },

    // Column 3: Services
    { id: 'OrderService', name: 'OrderService', type: 'service', col: 3, connections: ['db_orders', 'db_order_items'] },
    { id: 'PaymentService', name: 'PaymentService', type: 'service', col: 3, connections: ['db_payments', 'ext_stripe'] },
    { id: 'InventoryService', name: 'InventoryService', type: 'service', col: 3, connections: ['db_inventory'] },
    { id: 'CouponService', name: 'CouponService', type: 'service', col: 3, connections: ['db_coupons'] },
    { id: 'UserService', name: 'UserService', type: 'service', col: 3, connections: ['db_users', 'ext_sendgrid'] },

    // Column 4: DB
    { id: 'db_orders', name: 'orders', type: 'db', col: 4, connections: [] },
    { id: 'db_order_items', name: 'order_items', type: 'db', col: 4, connections: [] },
    { id: 'db_payments', name: 'payments', type: 'db', col: 4, connections: [] },
    { id: 'db_inventory', name: 'inventory', type: 'db', col: 4, connections: [] },
    { id: 'db_coupons', name: 'coupons', type: 'db', col: 4, connections: [] },
    { id: 'db_users', name: 'users', type: 'db', col: 4, connections: [] },

    // Column 5: External Services
    { id: 'ext_stripe', name: 'Stripe API', type: 'external', col: 5, connections: [] },
    { id: 'ext_sendgrid', name: 'SendGrid API', type: 'external', col: 5, connections: [] },
    { id: 'ext_s3', name: 'S3 Storage', type: 'external', col: 5, connections: [] }
  ];

  const nodes: GraphNode[] = (analysisResult && analysisResult.nodes && analysisResult.nodes.length > 0) ? analysisResult.nodes : defaultNodes;

  // Mouse drag handles
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (zoomIn: boolean) => {
    setScale(prev => {
      const next = zoomIn ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(next, 0.3), 2.0);
    });
  };

  const handleResetPan = () => {
    setScale(0.85);
    setPan({ x: 50, y: 30 });
  };

  const getColX = (col: number) => {
    return col * 220 + 50;
  };

  const getNodeY = (nodeId: string) => {
    const colNodes = nodes.filter(n => n.col === nodes.find(x => x.id === nodeId)?.col);
    const idx = colNodes.findIndex(n => n.id === nodeId);
    const spacing = 70;
    const startY = 80;
    return idx * spacing + startY;
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'ui': return '#3B82F6';
      case 'component': return '#8B5CF6';
      case 'api': return '#06B6D4';
      case 'service': return '#F59E0B';
      case 'db': return '#EF4444';
      default: return '#10B981';
    }
  };

  // Connections renderer
  const renderConnections = () => {
    return nodes.flatMap(sourceNode => 
      sourceNode.connections.map(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (!targetNode) return null;

        const x1 = getColX(sourceNode.col) + 140; // Right side of source card
        const y1 = getNodeY(sourceNode.id) + 22;  // Vertical center of source
        const x2 = getColX(targetNode.col);       // Left side of target card
        const y2 = getNodeY(targetNode.id) + 22;  // Vertical center of target

        const dx = (x2 - x1) * 0.5;
        const dStr = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        const isHighlighted = selectedGraphNode === sourceNode.id || selectedGraphNode === targetNode.id;
        const colVal = getNodeColor(sourceNode.type);

        return (
          <g key={`${sourceNode.id}-${targetId}`}>
            {/* Background glowing path */}
            <path
              d={dStr}
              fill="none"
              stroke={isHighlighted ? colVal : 'rgba(6, 182, 212, 0.08)'}
              strokeWidth={isHighlighted ? 2.5 : 1.2}
              strokeDasharray={isHighlighted ? '0' : '4 3'}
              className="transition-all duration-200"
            />
            {/* Animated flow dots on active paths */}
            {isHighlighted && (
              <circle r="3" fill="#ffffff">
                <animateMotion dur="2s" repeatCount="indefinite" path={dStr} />
              </circle>
            )}
            {isHighlighted && (
              <circle r="5" fill={colVal} opacity="0.6">
                <animateMotion dur="2s" repeatCount="indefinite" path={dStr} />
              </circle>
            )}
          </g>
        );
      })
    );
  };

  return (
    <div className="flex-1 bg-[#02050b] flex flex-col justify-between font-sans h-full min-h-0 relative select-none">
      {/* Decorative scanning grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      {/* Top Controls Row */}
      <div className="h-12 border-b border-cyan-500/20 bg-[#060c18]/80 flex items-center justify-between px-4 z-10 shadow-[0_4px_20px_rgba(6,182,212,0.05)]">
        {/* View Flow Selector */}
        <div className="flex space-x-1.5">
          {viewTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setGraphViewMode(tab.id as any)}
              className={`px-3 py-1 rounded-sm text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer uppercase ${
                graphViewMode === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs flex-1 mx-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cyan-500/50" />
          <input
            type="text"
            placeholder="FILTER NODES, SERVICES, DATABASE ENTITIES..."
            className="w-full bg-[#030712] border border-cyan-500/20 rounded-sm pl-8 pr-3 py-1 text-[9px] text-cyan-400 placeholder-cyan-500/40 font-mono focus:outline-none focus:border-cyan-500/55 shadow-[inset_0_0_10px_rgba(6,182,212,0.03)]"
          />
        </div>

        {/* Zoom scale / tools */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1 bg-cyan-500/5 border border-cyan-500/20 rounded-sm px-2 py-0.5 mr-2 font-mono text-[9px] text-cyan-400">
            <Activity size={10} className="text-cyan-400 animate-pulse" />
            <span>SCALE: {Math.round(scale * 100)}%</span>
          </div>
          <button onClick={() => handleZoom(true)} className="p-1 hover:bg-cyan-500/10 rounded text-cyan-400 hover:text-white transition-colors cursor-pointer" title="Zoom In"><ZoomIn className="h-3.5 w-3.5" /></button>
          <button onClick={() => handleZoom(false)} className="p-1 hover:bg-cyan-500/10 rounded text-cyan-400 hover:text-white transition-colors cursor-pointer" title="Zoom Out"><ZoomOut className="h-3.5 w-3.5" /></button>
          <button onClick={handleResetPan} className="p-1 hover:bg-cyan-500/10 rounded text-cyan-400 hover:text-white transition-colors cursor-pointer" title="Reset View"><Maximize className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {/* Infinite Canvas Panel */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 min-h-0 overflow-hidden relative cursor-grab active:cursor-grabbing bg-[radial-gradient(rgba(6,182,212,0.06)_1.2px,transparent_1.2px)] bg-[size:24px_24px] shadow-[inset_0_0_40px_rgba(6,182,212,0.03)]"
      >
        {/* Radar scope rings decorations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full border border-cyan-500/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-cyan-500/5 pointer-events-none" />

        <div 
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          {/* Column Header Titles */}
          <div className="absolute top-0 left-0 flex text-[8.5px] font-black text-cyan-500/40 uppercase tracking-widest font-mono pointer-events-none pb-4">
            <span style={{ left: `${getColX(0)}px`, position: 'absolute', width: '140px', textAlign: 'center' }}>[01] USER_INTERFACES</span>
            <span style={{ left: `${getColX(1)}px`, position: 'absolute', width: '140px', textAlign: 'center' }}>[02] REACT_COMPONENTS</span>
            <span style={{ left: `${getColX(2)}px`, position: 'absolute', width: '140px', textAlign: 'center' }}>[03] API_ENDPOINTS</span>
            <span style={{ left: `${getColX(3)}px`, position: 'absolute', width: '140px', textAlign: 'center' }}>[04] ROUTER_SERVICES</span>
            <span style={{ left: `${getColX(4)}px`, position: 'absolute', width: '140px', textAlign: 'center' }}>[05] DATABASE_RELATIONS</span>
            <span style={{ left: `${getColX(5)}px`, position: 'absolute', width: '140px', textAlign: 'center' }}>[06] EXTERNAL_SYSTEMS</span>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '1600px', height: '850px' }}>
            {renderConnections()}
          </svg>

          {/* Render Graph Nodes */}
          {nodes.map(node => {
            const isSelected = selectedGraphNode === node.id;
            const x = getColX(node.col);
            const y = getNodeY(node.id);
            const nodeCol = getNodeColor(node.type);

            return (
              <div
                key={node.id}
                onClick={() => setSelectedGraphNode(node.id)}
                className={`graph-node absolute w-[140px] p-2.5 rounded-sm border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-[#050b18]/95 text-white shadow-2xl z-30 font-bold' 
                    : 'bg-[#050b18]/60 border-cyan-500/20 hover:border-cyan-500/50 text-slate-400 hover:text-white z-20'
                }`}
                style={{ 
                  left: `${x}px`, 
                  top: `${y}px`,
                  borderColor: isSelected ? nodeCol : 'rgba(6, 182, 212, 0.2)',
                  boxShadow: isSelected ? `0 0 15px ${nodeCol}40` : 'none',
                  borderLeft: `3px solid ${nodeCol}`
                }}
              >
                <div className="text-[10px] font-mono tracking-wide truncate leading-tight flex justify-between items-center">
                  <span className="truncate">{node.name}</span>
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping shrink-0 ml-1.5" />}
                </div>
                <div className="text-[7.5px] uppercase tracking-widest font-mono font-bold mt-1.5 text-slate-500 flex justify-between items-center">
                  <span>{node.type}</span>
                  <span style={{ color: nodeCol }}>●</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas Tip */}
      <div className="absolute bottom-3 left-3 bg-[#050b18]/90 backdrop-blur border border-cyan-500/30 text-[8px] font-mono tracking-widest text-cyan-400 px-3 py-1.5 rounded-sm flex items-center space-x-1.5 z-20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <Move className="h-3 w-3 mr-1 animate-pulse" />
        <span>DRAG_PAN // SCROLL_ZOOM</span>
      </div>
    </div>
  );
};
