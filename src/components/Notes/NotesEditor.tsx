import { useEffect, useState } from 'react';
import { useWorkbench } from '../../context/WorkbenchContext';

const NotesEditor = () => {
  const { activeTab, currentProject, updateTabContent } = useWorkbench();
  const [content, setContent] = useState('');
  
  useEffect(() => {
    if (activeTab) {
      setContent(activeTab.content);
    }
  }, [activeTab]);
  
  if (!activeTab || !currentProject) {
    return <div className="h-full flex items-center justify-center">No note selected</div>;
  }
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateTabContent(currentProject.id, activeTab.id, newContent);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">{activeTab.name}</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        <textarea
          className="w-full h-full p-4 resize-none focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your notes here..."
        />
      </div>
    </div>
  );
};

export default NotesEditor;