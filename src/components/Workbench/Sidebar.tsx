import { useState } from 'react';
import { PlusCircle, Folder, FileCode, FileText, FileJson, Settings, ChevronRight, ChevronDown } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { projects, currentProject, selectProject, createProject } = useWorkbench();
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleCreateProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      createProject(name);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.html')) return <FileCode size={16} />;
    if (fileName.endsWith('.css')) return <FileCode size={16} />;
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return <FileCode size={16} />;
    if (fileName.endsWith('.json')) return <FileJson size={16} />;
    return <FileText size={16} />;
  };

  if (collapsed) {
    return (
      <div className="w-12 h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-4">
        <button 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="New Project"
          onClick={handleCreateProject}
        >
          <PlusCircle size={20} />
        </button>
        
        <div className="flex-1 w-full flex flex-col items-center space-y-4 overflow-y-auto">
          {projects.map(project => (
            <button
              key={project.id}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                currentProject?.id === project.id 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              title={project.name}
              onClick={() => selectProject(project.id)}
            >
              <Folder size={20} />
            </button>
          ))}
        </div>
        
        <button 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-60 h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">EXPLORER</h2>
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            onClick={handleCreateProject}
          >
            <PlusCircle size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {projects.map(project => (
          <div key={project.id} className="mb-1">
            <div 
              className={`flex items-center px-3 py-1.5 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                currentProject?.id === project.id ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              onClick={() => toggleProjectExpand(project.id)}
            >
              {expandedProjects[project.id] ? (
                <ChevronDown size={16} className="mr-1 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight size={16} className="mr-1 text-gray-500 dark:text-gray-400" />
              )}
              <Folder size={16} className="mr-2 text-blue-500" />
              <span className="text-sm truncate">{project.name}</span>
            </div>
            
            {expandedProjects[project.id] && (
              <div className="ml-4 pl-2 border-l border-gray-300 dark:border-gray-600">
                {project.tabs.map(tab => (
                  <div 
                    key={tab.id}
                    className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 truncate"
                    onClick={() => selectProject(project.id)}
                  >
                    {getFileIcon(tab.name)}
                    <span className="ml-2 text-sm truncate">{tab.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button className="flex items-center w-full px-3 py-1.5 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <Settings size={16} className="mr-2" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;