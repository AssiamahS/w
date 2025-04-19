import React, { createContext, useContext, useState, useEffect } from 'react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export type Tab = {
  id: string;
  name: string;
  content: string;
  type: 'code' | 'note' | 'html';
  language?: string;
};

export type Project = {
  id: string;
  name: string;
  tabs: Tab[];
};

interface WorkbenchContextType {
  projects: Project[];
  currentProject: Project | null;
  activeTab: Tab | null;
  isLlmPanelOpen: boolean;
  toggleLlmPanel: () => void;
  createProject: (name: string) => void;
  selectProject: (id: string) => void;
  createTab: (projectId: string, tab: Omit<Tab, 'id'>) => void;
  selectTab: (projectId: string, tabId: string) => void;
  updateTabContent: (projectId: string, tabId: string, content: string) => void;
  closeTab: (projectId: string, tabId: string) => void;
}

const WorkbenchContext = createContext<WorkbenchContextType | undefined>(undefined);

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Sample initial data
const initialProjects: Project[] = [
  {
    id: generateId(),
    name: 'My Project',
    tabs: [
      {
        id: generateId(),
        name: 'index.html',
        type: 'code',
        language: 'html',
        content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Project</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'
      },
      {
        id: generateId(),
        name: 'styles.css',
        type: 'code',
        language: 'css',
        content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: navy;\n}'
      },
      {
        id: generateId(),
        name: 'Project Notes',
        type: 'note',
        content: '# Project Notes\n\n- Add responsive design\n- Implement dark mode\n- Fix navigation issues'
      }
    ]
  }
];

export const useWorkbench = () => {
  const context = useContext(WorkbenchContext);
  if (context === undefined) {
    throw new Error('useWorkbench must be used within a WorkbenchProvider');
  }
  return context;
};

export const WorkbenchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('workbench-projects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });
  
  const [currentProject, setCurrentProject] = useState<Project | null>(projects[0] || null);
  const [activeTab, setActiveTab] = useState<Tab | null>(
    currentProject?.tabs[0] || null
  );
  const [isLlmPanelOpen, setIsLlmPanelOpen] = useState(false);

  // Save projects to localStorage when they change
  useEffect(() => {
    localStorage.setItem('workbench-projects', JSON.stringify(projects));
  }, [projects]);

  // Command+Delete shortcut to toggle LLM panel
  useKeyboardShortcut(['Meta', 'Delete'], () => {
    setIsLlmPanelOpen(prev => !prev);
  });

  const toggleLlmPanel = () => {
    setIsLlmPanelOpen(prev => !prev);
  };

  const createProject = (name: string) => {
    const newProject = {
      id: generateId(),
      name,
      tabs: []
    };
    
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setActiveTab(null);
  };

  const selectProject = (id: string) => {
    const project = projects.find(p => p.id === id) || null;
    setCurrentProject(project);
    setActiveTab(project?.tabs[0] || null);
  };

  const createTab = (projectId: string, tab: Omit<Tab, 'id'>) => {
    const newTab = { ...tab, id: generateId() };
    
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tabs: [...project.tabs, newTab]
        };
      }
      return project;
    }));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        tabs: [...prev.tabs, newTab]
      } : null);
      
      setActiveTab(newTab);
    }
  };

  const selectTab = (projectId: string, tabId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const tab = project.tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    setActiveTab(tab);
  };

  const updateTabContent = (projectId: string, tabId: string, content: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tabs: project.tabs.map(tab => {
            if (tab.id === tabId) {
              return { ...tab, content };
            }
            return tab;
          })
        };
      }
      return project;
    }));
    
    if (currentProject?.id === projectId && activeTab?.id === tabId) {
      setActiveTab(prev => prev ? { ...prev, content } : null);
    }
  };

  const closeTab = (projectId: string, tabId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const filteredTabs = project.tabs.filter(tab => tab.id !== tabId);
        return {
          ...project,
          tabs: filteredTabs
        };
      }
      return project;
    }));
    
    if (currentProject?.id === projectId && activeTab?.id === tabId) {
      // If we're closing the active tab, select another one
      const projectIndex = projects.findIndex(p => p.id === projectId);
      const project = projects[projectIndex];
      const tabIndex = project.tabs.findIndex(t => t.id === tabId);
      
      // Try to select the tab to the left, or to the right if we're closing the leftmost tab
      const nextTabIndex = tabIndex > 0 ? tabIndex - 1 : (project.tabs.length > 1 ? tabIndex + 1 : -1);
      
      setActiveTab(nextTabIndex >= 0 ? project.tabs[nextTabIndex] : null);
    }
  };

  const value = {
    projects,
    currentProject,
    activeTab,
    isLlmPanelOpen,
    toggleLlmPanel,
    createProject,
    selectProject,
    createTab,
    selectTab,
    updateTabContent,
    closeTab
  };

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
};