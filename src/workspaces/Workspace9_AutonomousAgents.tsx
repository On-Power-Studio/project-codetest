import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Bot, Cpu, Radio, Network, Wifi, Activity, Terminal, Shield } from 'lucide-react';

export const Workspace9_AutonomousAgents: React.FC = () => {
  const { agents, agentLogs } = useAxiomStore();

  // Coordinates for the 6 agent circles in the topology ring
  const circleRadius = 100;
  const centerX = 200;
  const centerY = 120;
  
  const getAgentCoords = (idx: number) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2; // Offset by 90deg to start top
    return {
      x: centerX + circleRadius * Math.cos(angle),
      y: centerY + circleRadius * Math.sin(angle)
    };
  };

  return (
    <div className="flex-1 bg-bg-primary p-4 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="border-b border-border-color pb-3">
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide">Autonomous QA Agent Control Room</h2>
          <span className="text-[11px] text-text-secondary">Orchestrate a swarm of autonomous software intelligence agents working concurrently to analyze and validate code changes.</span>
        </div>

        {/* Top Section: Agent Network Topology Ring (Left) & Network Stats (Right) */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          
          {/* Topology Canvas (Width 8/12) */}
          <div className="col-span-8 bg-surface/30 border border-border-color rounded-xl p-4 flex flex-col justify-between relative min-h-[300px]">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1 border-b border-border-color/30">Agent Network Topology</span>
            
            {/* Visual Topology Map */}
            <div className="flex-1 relative flex items-center justify-center h-[240px]">
              
              {/* Central Core Orchestrator */}
              <div className="absolute h-16 w-16 bg-primary-purple/20 border-2 border-primary-purple rounded-full flex flex-col items-center justify-center font-bold text-[9px] text-text-primary z-20 glow-purple select-none cursor-pointer">
                <Bot className="h-5 w-5 text-primary-purple mb-0.5" />
                <span>Orchestrator</span>
              </div>

              {/* Connecting Ring SVGs */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-45">
                {agents.map((_, idx) => {
                  const coords = getAgentCoords(idx);
                  return (
                    <g key={idx}>
                      {/* Lines from orchestrator to agents */}
                      <line 
                        x1="50%" 
                        y1="50%" 
                        x2={`${(coords.x / 400) * 100}%`} 
                        y2={`${(coords.y / 240) * 100}%`} 
                        stroke="rgba(139,92,246,0.6)" 
                        strokeWidth="1.5" 
                      />
                      {/* Interactive ring linking agents together */}
                      {idx < agents.length - 1 && (
                        <line
                          x1={`${(coords.x / 400) * 100}%`}
                          y1={`${(coords.y / 240) * 100}%`}
                          x2={`${(getAgentCoords(idx + 1).x / 400) * 100}%`}
                          y2={`${(getAgentCoords(idx + 1).y / 240) * 100}%`}
                          stroke="rgba(59,130,246,0.3)"
                          strokeWidth="1"
                          strokeDasharray="3"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Surrounding Agent Nodes */}
              {agents.map((agent, idx) => {
                const coords = getAgentCoords(idx);
                // Adjust position slightly to center the node elements
                return (
                  <div
                    key={agent.name}
                    className="absolute bg-surface border border-border-color rounded-lg px-2 py-1 flex items-center space-x-2 text-[9px] text-text-secondary hover:border-primary-purple transition-all duration-200 z-10 hover:text-text-primary cursor-pointer w-32"
                    style={{ 
                      left: `calc(${(coords.x / 400) * 100}% - 64px)`, 
                      top: `calc(${(coords.y / 240) * 100}% - 20px)` 
                    }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-text-primary leading-tight truncate">{agent.name}</div>
                      <div className="text-[7.5px] opacity-75 mt-0.5 truncate">{agent.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network Channels Stats (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-4 flex flex-col justify-between text-xs min-h-0">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1 border-b border-border-color/30">Channel Quality</span>
            
            <div className="space-y-3.5 flex-1 flex flex-col justify-center font-sans">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center space-x-1.5"><Wifi className="h-4 w-4" /><span>Active Links</span></span>
                <span className="font-bold font-mono text-text-primary">15 / 20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center space-x-1.5"><Network className="h-4 w-4" /><span>Messages/sec</span></span>
                <span className="font-bold font-mono text-text-primary">2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center space-x-1.5"><Activity className="h-4 w-4" /><span>Data Transferred</span></span>
                <span className="font-bold font-mono text-primary-purple">1.2 GB/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center space-x-1.5"><Shield className="h-4 w-4 text-danger" /><span>Link Error Rate</span></span>
                <span className="font-bold font-mono text-danger">0.01%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center space-x-1.5"><Cpu className="h-4 w-4 text-secondary-blue" /><span>Link Latency</span></span>
                <span className="font-bold font-mono text-secondary-blue">12.4ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Operations, Communication Logs, and Local Knowledge Graph */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          
          {/* Operations lists (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Live Agent Operations</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2">
              {agents.map(agent => (
                <div key={agent.name} className="p-1.5 bg-surface/40 hover:bg-surface border border-border-color/20 rounded flex items-center justify-between text-[9.5px]">
                  <div className="truncate">
                    <span className="font-bold text-text-primary block leading-tight truncate">{agent.name}</span>
                    <span className="text-text-secondary text-[8.5px] truncate block mt-0.5">{agent.operation}</span>
                  </div>
                  <span className="font-mono font-bold text-success text-[10px] shrink-0 ml-2">{agent.cpu}% CPU</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comm logs (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Agent Communication Log</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 font-mono text-[9px] text-text-secondary leading-normal">
              {agentLogs.map((log, idx) => (
                <div key={idx} className="border-b border-border-color/10 pb-1.5 leading-snug">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Mini Knowledge graph (Width 4/12) */}
          <div className="col-span-4 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 text-xs select-none">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1.5 border-b border-border-color/30">Knowledge Graph</span>
            
            {/* Miniature node connections representation */}
            <div className="flex-1 relative flex items-center justify-center min-h-[100px]">
              <div className="absolute h-10 w-10 bg-primary-purple/20 border border-primary-purple rounded-full flex items-center justify-center text-[7px] text-text-primary z-20">platform</div>
              <div className="absolute text-[7px] font-mono text-text-secondary bg-surface border border-border-color px-1 rounded -translate-y-8 -translate-x-10">api-gateway</div>
              <div className="absolute text-[7px] font-mono text-text-secondary bg-surface border border-border-color px-1 rounded translate-y-8 -translate-x-10">auth</div>
              <div className="absolute text-[7px] font-mono text-text-secondary bg-surface border border-border-color px-1 rounded translate-y-8 translate-x-10">payments</div>
              <div className="absolute text-[7px] font-mono text-text-secondary bg-surface border border-border-color px-1 rounded -translate-y-8 translate-x-10">db_users</div>
              
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20">
                <line x1="50%" y1="50%" x2="25%" y2="20%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="25%" y2="80%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="white" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="75%" y2="20%" stroke="white" strokeWidth="1" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
