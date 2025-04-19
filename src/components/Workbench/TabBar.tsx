import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useWorkbench, Tab } from '../../context/WorkbenchContext';

const TabBar = () => {
  const { currentProject, activeTab, selectTab, closeTab, createTab } = useWorkbench();
  const [showNewTabMenu, setShowNewTabMenu] = useState(false);

  if (!currentProject) {
    return (
      <div className="h-9 bg-gray-200 dark:bg-gray-750 border-b border-gray-300 dark:border-gray-600 flex items-center px-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">No project selected</span>
      </div>
    );
  }

  const handleCreateTab = (type: Tab['type']) => {
    if (!currentProject) return;
    
    let name = '';
    let language = '';
    let content = '';
    
    if (type === 'code') {
      name = prompt('Enter file name (e.g., example.js):') || '';
      if (!name) return;
      
      // Determine language based on file extension
      const extension = name.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'js':
          language = 'javascript';
          content = '// JavaScript file\n\n';
          break;
        case 'ts':
          language = 'typescript';
          content = '// TypeScript file\n\n';
          break;
        case 'jsx':
        case 'tsx':
          language = extension;
          content = '// React component\n\nimport React from "react";\n\nfunction Component() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default Component;';
          break;
        case 'html':
          language = 'html';
          content = '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
          break;
        case 'css':
          language = 'css';
          content = '/* CSS styles */\n\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: navy;\n}';
          break;
        case 'json':
          language = 'json';
          content = '{\n  "name": "example",\n  "version": "1.0.0"\n}';
          break;
        default:
          language = 'plaintext';
          content = '';
      }
    } else if (type === 'note') {
      name = prompt('Enter note title:') || 'Untitled Note';
      content = `# ${name}\n\nStart writing your notes here...\n`;
    } else if (type === 'html') {
      name = 'Preview';
      content = '';
    }
    
    createTab(currentProject.id, { name, type, content, language });
    setShowNewTabMenu(false);
  };

  return (
    <div className="h-9 bg-gray-200 dark:bg-gray-750 border-b border-gray-300 dark:border-gray-600 flex items-center">
      <div className="flex-1 overflow-x-auto whitespace-nowrap px-1 flex items-center">
        {currentProject.tabs.map(tab => (
          <div 
            key={tab.id} 
            className={`
              inline-flex items-center h-7 px-3 mx-0.5 text-xs rounded-t-md cursor-pointer 
              ${activeTab?.id === tab.id 
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-t border-l border-r border-gray-300 dark:border-gray-600' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-650'}
            `}
            onClick={() => selectTab(currentProject.id, tab.id)}
          >
            <span className="truncate max-w-[140px]">{tab.name}</span>
            <button 
              className="ml-2 p-0.5 opacity-60 hover:opacity-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(currentProject.id, tab.id);
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative px-2">
        <button
          className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setShowNewTabMenu(!showNewTabMenu)}
        >
          <Plus size={16} />
        </button>
        
        {showNewTabMenu && (
          <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 shadow-lg rounded border border-gray-300 dark:border-gray-600 z-10">
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleCreateTab('code')}
              >
                New File
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleCreateTab('note')}
              >
                New Note
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleCreateTab('html')}
              >
                HTML Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabBar;