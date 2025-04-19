import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { useTheme } from '../../context/ThemeContext';

const CodeEditor = () => {
  const { theme } = useTheme();
  const { activeTab, currentProject, updateTabContent } = useWorkbench();
  const [editorContent, setEditorContent] = useState('');
  
  useEffect(() => {
    if (activeTab) {
      setEditorContent(activeTab.content);
    }
  }, [activeTab]);
  
  if (!activeTab || !currentProject) {
    return <div className="h-full flex items-center justify-center">No file selected</div>;
  }
  
  const handleEditorChange = (value: string = '') => {
    setEditorContent(value);
    updateTabContent(currentProject.id, activeTab.id, value);
  };
  
  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={activeTab.language || 'plaintext'}
        value={editorContent}
        onChange={handleEditorChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;