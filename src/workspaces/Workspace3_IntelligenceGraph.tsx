import React, { useState, useRef, useEffect } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Search, ZoomIn, ZoomOut, Maximize, Move, HelpCircle } from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'ui' | 'component' | 'api' | 'service' | 'db' | 'external';
  col: number; // 0: UI, 1: Component, 2: API, 3: Service, 4: DB, 5: External
  connections: string[]; // Connected node IDs
}

export const Workspace3_IntelligenceGraph: React.FC = () => {
  const { selectedGraphNode, setSelectedGraphNode, graphViewMode, setGraphViewMode } = useAxiomStore();
  
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

  // Defining high fidelity graph node layout
  const nodes: GraphNode[] = [
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

  // Mouse drag handles
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking canvas, not node
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

  // Node position helper metrics (X coords for columns)
  const getColX = (col: number) => {
    return col * 200 + 40;
  };

  // Node position helper metrics (Y coords for list indices)
  const getNodeY = (nodeId: string) => {
    const colNodes = nodes.filter(n => n.col === nodes.find(x => x.id === nodeId)?.col);
    const idx = colNodes.findIndex(n => n.id === nodeId);
    const spacing = 65;
    const startY = 60;
    return idx * spacing + startY;
  };

  // Connections renderer
  const renderConnections = () => {
    return nodes.flatMap(sourceNode => 
      sourceNode.connections.map(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (!targetNode) return null;

        const x1 = getColX(sourceNode.col) + 130; // Right side of source card
        const y1 = getNodeY(sourceNode.id) + 20;  // Vertical center of source
        const x2 = getColX(targetNode.col);       // Left side of target card
        const y2 = getNodeY(targetNode.id) + 20;  // Vertical center of target

        // Draw bezier path
        const dx = (x2 - x1) * 0.5;
        const dStr = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        // Highlight if source or target is selected
        const isHighlighted = selectedGraphNode === sourceNode.id || selectedGraphNode === targetNode.id;

        return (
          <g key={`${sourceNode.id}-${targetId}`}>
            {/* Background glowing path */}
            <path
              d={dStr}
              fill="none"
              stroke={
                isHighlighted 
                  ? 'rgba(139, 92, 246, 0.4)' 
                  : 'rgba(255, 255, 255, 0.03)'
              }
              strokeWidth={isHighlighted ? 3 : 1}
              className="transition-all duration-200"
            />
            {/* Animated flow dots on highlighted lines */}
            {isHighlighted && (
              <circle r="2.5" fill="#8B5CF6" className="glow-purple">
                <animateMotion dur="2.5s" repeatCount="indefinite" path={dStr} />
              </circle>
            )}
          </g>
        );
      })
    );
  };

  return (
    <div className="flex-1 bg-bg-primary flex flex-col justify-between font-sans h-full min-h-0 relative select-none">
      {/* Top Controls Row */}
      <div className="h-11 border-b border-border-color bg-surface/20 flex items-center justify-between px-4 z-10">
        {/* View Flow Selector */}
        <div className="flex space-x-1.5">
          {viewTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setGraphViewMode(tab.id as any)}
              className={`px-3 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer ${
                graphViewMode === tab.id
                  ? 'bg-primary-purple text-text-primary glow-purple'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs flex-1 mx-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-text-secondary" />
          <input
            type="text"
            placeholder="Search nodes, files, APIs, DB..."
            className="w-full bg-surface border border-border-color rounded pl-7 pr-3 py-1 text-[10px] text-text-primary focus:outline-none focus:border-primary-purple/40"
          />
        </div>

        {/* Zoom scale / tools */}
        <div className="flex items-center space-x-1">
          <span className="text-[10px] font-mono text-text-secondary mr-2">{Math.round(scale * 100)}%</span>
          <button onClick={() => handleZoom(true)} className="p-1 hover:bg-surface rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Zoom In"><ZoomIn className="h-3.5 w-3.5" /></button>
          <button onClick={() => handleZoom(false)} className="p-1 hover:bg-surface rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Zoom Out"><ZoomOut className="h-3.5 w-3.5" /></button>
          <button onClick={handleResetPan} className="p-1 hover:bg-surface rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Reset View"><Maximize className="h-3.5 w-3.5" /></button>
          <div className="h-4 w-px bg-border-color mx-1" />
          <button className="p-1 hover:bg-surface rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Help Guide"><HelpCircle className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {/* Infinite Canvas Panel */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 min-h-0 overflow-hidden relative cursor-grab active:cursor-grabbing bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px]`}
      >
        <div 
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          {/* Column Header Titles */}
          <div className="absolute top-0 left-0 flex text-[9px] font-black text-text-secondary uppercase tracking-widest pointer-events-none pb-4">
            <span style={{ left: `${getColX(0)}px`, position: 'absolute', width: '130px', textAlign: 'center' }}>User Interface</span>
            <span style={{ left: `${getColX(1)}px`, position: 'absolute', width: '130px', textAlign: 'center' }}>Components</span>
            <span style={{ left: `${getColX(2)}px`, position: 'absolute', width: '130px', textAlign: 'center' }}>API Endpoints</span>
            <span style={{ left: `${getColX(3)}px`, position: 'absolute', width: '130px', textAlign: 'center' }}>Services</span>
            <span style={{ left: `${getColX(4)}px`, position: 'absolute', width: '130px', textAlign: 'center' }}>Database (Postgres)</span>
            <span style={{ left: `${getColX(5)}px`, position: 'absolute', width: '130px', textAlign: 'center' }}>External Services</span>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '1500px', height: '800px' }}>
            {renderConnections()}
          </svg>

          {/* Render Graph Nodes */}
          {nodes.map(node => {
            const isSelected = selectedGraphNode === node.id;
            const x = getColX(node.col);
            const y = getNodeY(node.id);

            return (
              <div
                key={node.id}
                onClick={() => setSelectedGraphNode(node.id)}
                className={`graph-node absolute w-[130px] p-2 rounded-md border text-center transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-surface border-primary-purple text-text-primary glow-purple font-bold z-30' 
                    : 'bg-surface/50 border-border-color hover:border-text-secondary text-text-secondary hover:text-text-primary z-20'
                }`}
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className="text-[10px] truncate leading-tight">{node.name}</div>
                {node.type === 'api' && (
                  <div className="text-[7.5px] uppercase tracking-wider font-mono text-secondary-blue font-bold mt-0.5">API Layer</div>
                )}
                {node.type === 'service' && (
                  <div className="text-[7.5px] uppercase tracking-wider font-mono text-warning font-bold mt-0.5">Service</div>
                )}
                {node.type === 'db' && (
                  <div className="text-[7.5px] uppercase tracking-wider font-mono text-success font-bold mt-0.5">Database</div>
                )}
                {node.type === 'component' && (
                  <div className="text-[7.5px] uppercase tracking-wider font-mono text-primary-purple font-bold mt-0.5">Component</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas Tip */}
      <div className="absolute bottom-3 left-3 bg-surface/85 backdrop-blur border border-border-color text-[8px] uppercase tracking-widest text-text-secondary px-2 py-1 rounded flex items-center space-x-1">
        <Move className="h-3 w-3 mr-1" />
        <span>Drag canvas to Pan • Scroll wheel to Zoom</span>
      </div>
    </div>
  );
};
