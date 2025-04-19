import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import CodeEditor from '../Editor/CodeEditor';
import NotesEditor from '../Notes/NotesEditor';
import HtmlPreview from '../Preview/HtmlPreview';
import LlmPanel from '../LLM/LlmPanel';

const Workbench = () => {
  const { theme, toggleTheme } = useTheme();
  const { activeTab, isLlmPanelOpen } = useWorkbench();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const renderMainContent = () => {
    if (!activeTab) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <p>No tab selected. Create or select a tab to get started.</p>
        </div>
      );
    }

    switch (activeTab.type) {
      case 'code':
        return <CodeEditor />;
      case 'note':
        return <NotesEditor />;
      case 'html':
        return <HtmlPreview />;
      default:
        return <CodeEditor />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-200">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSidebarCollapsed(prev => !prev)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="text-lg font-medium">Developer Workbench</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.34961 17.65L5.64961 18.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.3496 5.65L17.6496 6.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.34961 6.35L5.64961 5.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.3496 18.35L17.6496 17.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41102 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.589 3.25393 13.9205C2.88192 12.252 2.99274 10.5121 3.57348 8.9043C4.15423 7.29651 5.18085 5.88737 6.53324 4.84175C7.88562 3.79614 9.50782 3.15731 11.21 3C10.2134 4.34827 9.73385 6.00945 9.85857 7.68141C9.98329 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0167 16.3186 14.1414C17.9906 14.2662 19.6517 13.7866 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} />
        
        {/* Main editor area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tab bar */}
          <TabBar />
          
          {/* Editor content */}
          <div className="flex-1 overflow-hidden relative">
            {renderMainContent()}
            
            {/* LLM Panel */}
            {isLlmPanelOpen && <LlmPanel />}
          </div>
        </div>
      </div>
      
      {/* Status bar */}
      <footer className="h-6 px-4 flex items-center justify-between text-xs border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div>
          {activeTab && (
            <>
              <span className="mr-2">{activeTab.name}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {activeTab.language || activeTab.type}
              </span>
            </>
          )}
        </div>
        <div>
          <span>Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">⌘ + Delete</kbd> to trigger LLM</span>
        </div>
      </footer>
    </div>
  );
};

export default Workbench;