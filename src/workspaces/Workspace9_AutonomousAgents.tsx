import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Bot, Cpu, Radio, Network, Wifi, Activity, Terminal as TerminalIcon, Shield } from 'lucide-react';

export const Workspace9_AutonomousAgents: React.FC = () => {
  const { agents, agentLogs } = useAxiomStore();

  const circleRadius = 95;
  const centerX = 200;
  const centerY = 120;
  
  const getAgentCoords = (idx: number) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    return {
      x: centerX + circleRadius * Math.cos(angle),
      y: centerY + circleRadius * Math.sin(angle)
    };
  };

  return (
    <div className="flex-1 bg-[#02050b] p-4 overflow-y-auto flex flex-col justify-between font-sans h-full min-h-0 select-none relative">
      {/* Scanline pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      <div className="space-y-4 flex-1 flex flex-col min-h-0 z-20">
        {/* Header */}
        <div className="border-b border-cyan-500/20 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-400 animate-pulse" /> Autonomous QA Agent Room
            </h2>
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mt-0.5">Orchestrate a swarm of concurrent machine-agent intelligence networks validating codebase changes.</span>
          </div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          
          {/* Topology Canvas (Width 8/12) */}
          <div className="col-span-8 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-4 flex flex-col justify-between relative min-h-[300px] shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1 border-b border-cyan-500/10">Agent Swarm Network Topology</span>
            
            {/* Visual Topology Map */}
            <div className="flex-1 relative flex items-center justify-center h-[240px]">
              
              {/* Outer compass ring */}
              <div className="absolute h-[210px] w-[210px] rounded-full border border-cyan-500/10 border-dashed animate-spin opacity-30" style={{ animationDuration: '40s' }} />

              {/* Central Core Orchestrator */}
              <div className="absolute h-16 w-16 bg-[#050b18] border-2 border-cyan-400 rounded-full flex flex-col items-center justify-center font-mono font-bold text-[8.5px] text-white z-20 shadow-[0_0_15px_rgba(6,182,212,0.4)] select-none cursor-pointer">
                <Radio className="h-5 w-5 text-cyan-400 mb-0.5 animate-pulse" />
                <span>CORE_HUB</span>
              </div>

              {/* Connecting Ring SVGs */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-60">
                {agents.map((_, idx) => {
                  const coords = getAgentCoords(idx);
                  return (
                    <g key={idx}>
                      <line 
                        x1="50%" 
                        y1="50%" 
                        x2={`${(coords.x / 400) * 100}%`} 
                        y2={`${(coords.y / 240) * 100}%`} 
                        stroke="#06b6d4" 
                        strokeWidth="1.5" 
                      />
                      {idx < agents.length - 1 && (
                        <line
                          x1={`${(coords.x / 400) * 100}%`}
                          y1={`${(coords.y / 240) * 100}%`}
                          x2={`${(getAgentCoords(idx + 1).x / 400) * 100}%`}
                          y2={`${(getAgentCoords(idx + 1).y / 240) * 100}%`}
                          stroke="rgba(6,182,212,0.2)"
                          strokeWidth="1"
                          strokeDasharray="4 3"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Surrounding Agent Nodes */}
              {agents.map((agent, idx) => {
                const coords = getAgentCoords(idx);
                return (
                  <div
                    key={agent.name}
                    className="absolute bg-[#050b18]/95 border border-cyan-500/20 rounded px-2.5 py-1.5 flex items-center space-x-2 text-[9px] text-slate-400 hover:border-cyan-500 transition-all duration-200 z-10 hover:text-white cursor-pointer w-32 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                    style={{ 
                      left: `calc(${(coords.x / 400) * 100}% - 64px)`, 
                      top: `calc(${(coords.y / 240) * 100}% - 20px)` 
                    }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    <div className="truncate">
                      <div className="font-bold font-mono text-slate-200 leading-tight truncate">{agent.name}</div>
                      <div className="text-[7.5px] font-mono text-slate-500 truncate mt-0.5">{agent.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Network Channels Stats (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-4 flex flex-col justify-between text-xs min-h-0 shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1 border-b border-cyan-500/10">Swarm Telemetry Stats</span>
            
            <div className="space-y-3.5 flex-1 flex flex-col justify-center font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Wifi className="h-4 w-4" /><span>ACTIVE_LINKS</span></span>
                <span className="font-bold text-white">15 / 20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Network className="h-4 w-4" /><span>MSG_RATE</span></span>
                <span className="font-bold text-white">2,847/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Activity className="h-4 w-4" /><span>BANDWIDTH</span></span>
                <span className="font-bold text-cyan-400">1.2 GB/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Shield className="h-4 w-4 text-red-400" /><span>ERROR_RATE</span></span>
                <span className="font-bold text-red-400">0.01%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Cpu className="h-4 w-4 text-purple-400" /><span>LATENCY</span></span>
                <span className="font-bold text-purple-400">12.4ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          
          {/* Operations lists (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10">Live Agent Operations</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2">
              {agents.map(agent => (
                <div key={agent.name} className="p-2 bg-[#020409] hover:bg-cyan-500/5 border border-cyan-500/10 rounded flex items-center justify-between text-[9.5px]">
                  <div className="truncate">
                    <span className="font-bold font-mono text-slate-200 block leading-tight truncate">{agent.name}</span>
                    <span className="text-slate-500 text-[8.5px] font-mono truncate block mt-0.5">{agent.operation}</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-[10px] shrink-0 ml-2">{agent.cpu}% CPU</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comm logs (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10">Agent Comm logs</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2 font-mono text-[9px] text-slate-400 leading-normal">
              {agentLogs.map((log, idx) => (
                <div key={idx} className="border-b border-cyan-500/5 pb-1.5 leading-snug">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Mini Knowledge graph (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10">Active Knowledge Matrix</span>
            
            <div className="flex-1 relative flex items-center justify-center min-h-[100px]">
              <div className="absolute h-10 w-10 bg-cyan-500/15 border border-cyan-400 rounded-full flex items-center justify-center text-[7.5px] font-mono text-white z-20 shadow-[0_0_8px_rgba(6,182,212,0.2)]">platform</div>
              <div className="absolute text-[7px] font-mono text-slate-400 bg-[#050b18] border border-cyan-500/25 px-1.5 py-0.5 rounded -translate-y-8 -translate-x-10">api-gateway</div>
              <div className="absolute text-[7px] font-mono text-slate-400 bg-[#050b18] border border-cyan-500/25 px-1.5 py-0.5 rounded translate-y-8 -translate-x-10">auth</div>
              <div className="absolute text-[7px] font-mono text-slate-400 bg-[#050b18] border border-cyan-500/25 px-1.5 py-0.5 rounded translate-y-8 translate-x-10">payments</div>
              <div className="absolute text-[7px] font-mono text-slate-400 bg-[#050b18] border border-cyan-500/25 px-1.5 py-0.5 rounded -translate-y-8 translate-x-10">db_users</div>
              
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-30 animate-pulse">
                <line x1="50%" y1="50%" x2="25%" y2="20%" stroke="#06b6d4" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="25%" y2="80%" stroke="#06b6d4" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="#06b6d4" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="75%" y2="20%" stroke="#06b6d4" strokeWidth="1" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
