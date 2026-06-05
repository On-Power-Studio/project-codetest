import React from 'react';
import { useAxiomStore } from './store/axiomStore';
import { TopBar } from './components/TopBar';
import { ActivityBar } from './components/ActivityBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { BottomConsole } from './components/BottomConsole';
import { StatusBar } from './components/StatusBar';
import { AIProviderModal } from './components/AIProviderModal';


// Workspaces
import { Workspace_Explorer } from './workspaces/Workspace_Explorer';
import { Workspace1_ProjectImport } from './workspaces/Workspace1_ProjectImport';
import { Workspace2_AnalysisEngine } from './workspaces/Workspace2_AnalysisEngine';
import { Workspace3_IntelligenceGraph } from './workspaces/Workspace3_IntelligenceGraph';
import { Workspace4_AIWorkspace } from './workspaces/Workspace4_AIWorkspace';
import { Workspace5_TestGeneration } from './workspaces/Workspace5_TestGeneration';
import { Workspace6_ValidationCenter } from './workspaces/Workspace6_ValidationCenter';
import { Workspace7_CoverageIntelligence } from './workspaces/Workspace7_CoverageIntelligence';
import { Workspace8_ImpactAnalysis } from './workspaces/Workspace8_ImpactAnalysis';
import { Workspace9_AutonomousAgents } from './workspaces/Workspace9_AutonomousAgents';
import { Workspace10_DigitalTwin } from './workspaces/Workspace10_DigitalTwin';

function App() {
  const { activeWorkspace } = useAxiomStore();

  const renderActiveWorkspace = () => {
    switch (activeWorkspace) {
      case 'explorer':
        return <Workspace_Explorer />;
      case 'projects':
        return <Workspace1_ProjectImport />;
      case 'analysis':
        return <Workspace2_AnalysisEngine />;
      case 'graph':
        return <Workspace3_IntelligenceGraph />;
      case 'ai':
        return <Workspace4_AIWorkspace />;
      case 'tests':
        return <Workspace5_TestGeneration />;
      case 'validation':
        return <Workspace6_ValidationCenter />;
      case 'coverage':
        return <Workspace7_CoverageIntelligence />;
      case 'impact':
        return <Workspace8_ImpactAnalysis />;
      case 'agents':
        return <Workspace9_AutonomousAgents />;
      case 'twin':
        return <Workspace10_DigitalTwin />;
      default:
        return <Workspace_Explorer />;
    }
  };

  return (
    <div className="h-screen w-screen bg-bg-primary text-text-primary flex flex-col overflow-hidden font-sans">
      {/* 1. Window Header Navbar */}
      <TopBar />

      {/* 2. Main content row */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Leftmost Activity Bar */}
        <ActivityBar />

        {/* Dynamic left explorer/category sidebar */}
        <LeftSidebar />

        {/* Workspace and console center region */}
        <div className="flex-1 flex flex-col min-h-0 bg-bg-primary">
          {/* Active Workspace Viewport */}
          <div className="flex-1 min-h-0 relative">
            {renderActiveWorkspace()}
          </div>

          {/* Bottom Console drawer panel */}
          <BottomConsole />
        </div>

        {/* Right sidebar AI details */}
        <RightSidebar />
      </div>

      {/* 3. Window footer status bar */}
      <StatusBar />
      
      {/* Global settings modal overlay */}
      <AIProviderModal />
    </div>
  );
}

export default App;
