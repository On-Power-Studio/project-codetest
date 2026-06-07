import React from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  Bot, Cpu, Radio, Network, Wifi, Activity, 
  Terminal as TerminalIcon, Shield, Zap, Flame, GitPullRequest
} from 'lucide-react';

export const Workspace9_AutonomousAgents: React.FC = () => {
  const { 
    agents, 
    agentLogs, 
    chaosMode, 
    resilienceScore, 
    devPushStatus, 
    triggerDevPush 
  } = useAxiomStore();

  const circleRadius = 95;
  const centerX = 200;
  const centerY = 120;
  
  const getAgentCoords = (idx: number) => {
    // Dynamically align nodes depending on agents count
    const count = agents.length || 6;
    const angle = (idx * 2 * Math.PI) / count - Math.PI / 2;
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
            <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mt-0.5">
              Orchestrate a swarm of concurrent machine-agent intelligence networks validating codebase changes.
            </span>
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
              <div className="absolute h-[210px] w-[210px] rounded-full border border-cyan-500/10 border-dashed animate-spin opacity-30" style={{ animationDuration: '45s' }} />

              {/* Central Core Orchestrator */}
              <div className="absolute h-16 w-16 bg-[#050b18] border-2 border-cyan-400 rounded-full flex flex-col items-center justify-center font-mono font-bold text-[8.5px] text-white z-20 shadow-[0_0_15px_rgba(6,182,212,0.4)] select-none cursor-pointer">
                <Radio className="h-5 w-5 text-cyan-400 mb-0.5 animate-pulse" />
                <span>CORE_HUB</span>
              </div>

              {/* Connecting Ring SVGs */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-60">
                {agents.map((_, idx) => {
                  const coords = getAgentCoords(idx);
                  const nextIdx = (idx + 1) % agents.length;
                  const nextCoords = getAgentCoords(nextIdx);
                  return (
                    <g key={idx}>
                      {/* Connection to Core Hub */}
                      <line 
                        x1="50%" 
                        y1="50%" 
                        x2={`${(coords.x / 400) * 100}%`} 
                        y2={`${(coords.y / 240) * 100}%`} 
                        stroke="#06b6d4" 
                        strokeWidth="1.5" 
                      />
                      {/* Ring path connection */}
                      <line
                        x1={`${(coords.x / 400) * 100}%`}
                        y1={`${(coords.y / 240) * 100}%`}
                        x2={`${(nextCoords.x / 400) * 100}%`}
                        y2={`${(nextCoords.y / 240) * 100}%`}
                        stroke="rgba(6,182,212,0.25)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Surrounding Agent Nodes */}
              {agents.map((agent, idx) => {
                const coords = getAgentCoords(idx);
                const isChaos = agent.name === 'Chaos Engineering';
                const isExplorer = agent.name === 'Explorer Agent';
                const isApi = agent.name === 'API Test Agent';
                
                return (
                  <div
                    key={agent.name}
                    className={`absolute bg-[#050b18]/95 border rounded px-2.5 py-1.5 flex items-center space-x-2 text-[9px] text-slate-400 hover:text-white cursor-pointer w-32 shadow-[0_0_10px_rgba(6,182,212,0.05)] transition-all duration-200 ${
                      isChaos 
                        ? 'border-red-500/30 hover:border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.1)]' 
                        : isExplorer || isApi
                          ? 'border-purple-500/30 hover:border-purple-500'
                          : 'border-cyan-500/20 hover:border-cyan-500'
                    }`}
                    style={{ 
                      left: `calc(${(coords.x / 400) * 100}% - 64px)`, 
                      top: `calc(${(coords.y / 240) * 100}% - 20px)` 
                    }}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full animate-ping shrink-0 ${
                      isChaos ? 'bg-red-500' : isExplorer || isApi ? 'bg-purple-400' : 'bg-cyan-400'
                    }`} />
                    <div className="truncate">
                      <div className={`font-bold font-mono leading-tight truncate ${
                        isChaos ? 'text-red-400' : isExplorer || isApi ? 'text-purple-400' : 'text-slate-200'
                      }`}>
                        {agent.name}
                      </div>
                      <div className="text-[7.5px] font-mono text-slate-500 truncate mt-0.5">{agent.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swarm Telemetry & Simulator Control (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-4 flex flex-col justify-between text-xs min-h-0 shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1 border-b border-cyan-500/10">Swarm Telemetry Stats</span>
            
            <div className="space-y-3 flex-1 flex flex-col justify-center font-mono py-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Wifi className="h-4 w-4" /><span>ACTIVE_LINKS</span></span>
                <span className="font-bold text-white">{agents.length} / 12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Network className="h-4 w-4" /><span>MSG_RATE</span></span>
                <span className="font-bold text-white">3,248/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Activity className="h-4 w-4" /><span>BANDWIDTH</span></span>
                <span className="font-bold text-cyan-400">1.6 GB/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Shield className="h-4 w-4 text-red-400" /><span>CHAOS_STATE</span></span>
                <span className={`font-bold ${chaosMode !== 'none' ? 'text-red-400' : 'text-slate-400'}`}>
                  {chaosMode.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center space-x-2"><Flame className="h-4 w-4 text-orange-400 animate-pulse" /><span>RESILIENCE</span></span>
                <span className={`font-bold ${resilienceScore >= 80 ? 'text-green-400' : 'text-red-500'}`}>{resilienceScore}%</span>
              </div>
            </div>

            {/* Quick git push simulation */}
            <div className="border-t border-cyan-500/15 pt-3 mt-1.5">
              <button
                onClick={triggerDevPush}
                disabled={devPushStatus === 'pushing' || devPushStatus === 'swarm_running'}
                className="w-full py-2 bg-gradient-to-r from-cyan-600/30 to-purple-600/30 hover:from-cyan-600/55 hover:to-purple-600/55 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-bold uppercase rounded tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <GitPullRequest className="h-3.5 w-3.5" />
                <span>
                  {devPushStatus === 'pushing' 
                    ? 'Pushing Code...' 
                    : devPushStatus === 'swarm_running' 
                      ? 'Swarm Validating...' 
                      : 'Simulate Code Push'}
                </span>
              </button>
              {devPushStatus !== 'idle' && (
                <div className="text-center text-[7.5px] font-mono text-cyan-500 mt-1 animate-pulse">
                  SWARM STATE: {devPushStatus.toUpperCase()}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          
          {/* Operations lists (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10 font-mono">Live Agent Operations</span>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2">
              {agents.map(agent => {
                const isChaos = agent.name === 'Chaos Engineering';
                return (
                  <div key={agent.name} className="p-2 bg-[#020409] hover:bg-cyan-500/5 border border-cyan-500/10 rounded flex items-center justify-between text-[9.5px]">
                    <div className="truncate">
                      <span className={`font-bold font-mono block leading-tight truncate ${isChaos ? 'text-red-400' : 'text-slate-200'}`}>{agent.name}</span>
                      <span className="text-slate-500 text-[8.5px] font-mono truncate block mt-0.5">{agent.operation}</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-400 text-[10px] shrink-0 ml-2">{agent.cpu}% CPU</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comm logs (Width 4/12) */}
          <div className="col-span-4 bg-[#050b18]/80 border border-cyan-500/20 rounded-lg p-3 flex flex-col min-h-0 text-xs shadow-[0_0_15px_rgba(6,182,212,0.03)]">
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10 font-mono">Agent Comm logs</span>
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
            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-widest block mb-2 pb-1.5 border-b border-cyan-500/10 font-mono">Active Knowledge Matrix</span>
            
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
