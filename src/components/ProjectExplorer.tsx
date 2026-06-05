import React, { useState } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  FileCode, 
  Plus, 
  RefreshCw, 
  Layers, 
  Info,
  ExternalLink
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

export const ProjectExplorer: React.FC = () => {
  const { openFile, selectedFile, setActiveWorkspace } = useAxiomStore();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'root': true,
    'src': true,
    'tests': true,
    'e2e': true,
    'api': false,
    'components': false,
    'unit': false
  });

  const fileTree: FileNode = {
    name: 'ecommerce-platform',
    type: 'folder',
    path: 'root',
    children: [
      { name: 'Intelligence Graph', type: 'file', path: 'intelligence-graph' }, // Specialized action file
      {
        name: 'src',
        type: 'folder',
        path: 'src',
        children: [
          {
            name: 'api',
            type: 'folder',
            path: 'src/api',
            children: [
              { name: 'orders.controller.ts', type: 'file', path: 'orders.controller.ts' },
              { name: 'auth.controller.ts', type: 'file', path: 'auth.controller.ts' }
            ]
          },
          { name: 'schema.prisma', type: 'file', path: 'schema.prisma' }
        ]
      },
      {
        name: 'tests',
        type: 'folder',
        path: 'tests',
        children: [
          {
            name: 'e2e',
            type: 'folder',
            path: 'tests/e2e',
            children: [
              { name: 'checkout.spec.ts', type: 'file', path: 'checkout.spec.ts' },
              { name: 'auth.spec.ts', type: 'file', path: 'auth.spec.ts' },
              { name: 'search.spec.ts', type: 'file', path: 'search.spec.ts' }
            ]
          },
          {
            name: 'api',
            type: 'folder',
            path: 'tests/api',
            children: [
              { name: 'orders.spec.ts', type: 'file', path: 'orders.spec.ts' },
              { name: 'users.spec.ts', type: 'file', path: 'users.spec.ts' }
            ]
          },
          {
            name: 'components',
            type: 'folder',
            path: 'tests/components',
            children: [
              { name: 'button.spec.ts', type: 'file', path: 'button.spec.ts' }
            ]
          },
          {
            name: 'unit',
            type: 'folder',
            path: 'tests/unit',
            children: [
              { name: 'utils.test.ts', type: 'file', path: 'utils.test.ts' }
            ]
          }
        ]
      },
      { name: 'package.json', type: 'file', path: 'package.json' },
      { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json' },
      { name: 'vite.config.ts', type: 'file', path: 'vite.config.ts' }
    ]
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleNodeClick = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.path);
    } else {
      if (node.path === 'intelligence-graph') {
        setActiveWorkspace('graph');
      } else {
        openFile(node.path);
        // Switch workspace to editor workspace if not already
        setActiveWorkspace('explorer');
      }
    }
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.path];
    const isSelected = selectedFile === node.path && !isFolder;
    
    return (
      <div key={node.path} className="select-none">
        <div
          onClick={() => handleNodeClick(node)}
          className={`flex items-center px-2.5 py-1 text-xs transition-colors cursor-pointer border-l-2 ${
            isSelected 
              ? 'bg-surface text-primary-purple border-primary-purple' 
              : 'text-text-secondary hover:text-text-primary hover:bg-surface/30 border-transparent'
          }`}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
        >
          {isFolder ? (
            <span className="mr-1.5 text-text-secondary">
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
          ) : (
            <span className="w-3.5 mr-1.5" />
          )}

          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="h-3.5 w-3.5 text-secondary-blue mr-2 shrink-0" />
            ) : (
              <Folder className="h-3.5 w-3.5 text-secondary-blue mr-2 shrink-0" />
            )
          ) : (
            <FileCode className="h-3.5 w-3.5 text-text-secondary mr-2 shrink-0" />
          )}

          <span className="truncate font-sans font-medium text-[11.5px]">{node.name}</span>
        </div>

        {isFolder && isExpanded && node.children?.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="w-56 bg-bg-secondary border-r border-border-color flex flex-col justify-between select-none">
      {/* File Tree Header */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-color">
          <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Project Explorer</span>
          <div className="flex items-center space-x-1.5 text-text-secondary">
            <button className="p-0.5 hover:text-text-primary transition-colors cursor-pointer" title="New File">
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button className="p-0.5 hover:text-text-primary transition-colors cursor-pointer" title="Refresh Tree">
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Tree Rendering */}
        <div className="py-2 overflow-y-auto flex-1 border-b border-border-color">
          {renderNode(fileTree)}
        </div>
      </div>

      {/* Bottom Context Info Card */}
      <div className="p-3 bg-surface/30 border-t border-border-color text-xs">
        <div className="flex items-center justify-between mb-2 text-[10px] font-bold text-text-secondary tracking-widest uppercase">
          <span>Project Context</span>
          <Info className="h-3 w-3 text-text-secondary" />
        </div>
        
        <div className="space-y-1.5 text-[11px] font-sans">
          <div className="flex justify-between">
            <span className="text-text-secondary">Framework:</span>
            <span className="text-text-primary font-medium">Next.js 14.2.3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Language:</span>
            <span className="text-text-primary font-medium">TypeScript</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Backend:</span>
            <span className="text-text-primary font-medium">Node.js (Express)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Database:</span>
            <span className="text-text-primary font-medium">PostgreSQL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Last Scan:</span>
            <span className="text-success font-medium">2 mins ago</span>
          </div>
          <div className="h-px bg-border-color my-1.5" />
          <div className="flex justify-between">
            <span className="text-text-secondary">Graph Nodes:</span>
            <span className="text-primary-purple font-mono font-medium">1,842</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">APIs Detected:</span>
            <span className="text-secondary-blue font-mono font-medium">128</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Components:</span>
            <span className="text-text-primary font-mono font-medium">642</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Test Suites:</span>
            <span className="text-warning font-mono font-medium">78</span>
          </div>
        </div>

        <button 
          onClick={() => setActiveWorkspace('twin')}
          className="mt-3 w-full bg-surface border border-border-color text-[10px] text-text-primary hover:text-primary-purple py-1 px-2.5 rounded flex items-center justify-center space-x-1 cursor-pointer transition-colors"
        >
          <span>Open Digital Twin</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
};
