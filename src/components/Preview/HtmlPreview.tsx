import { useEffect, useState } from 'react';
import { useWorkbench } from '../../context/WorkbenchContext';

const HtmlPreview = () => {
  const { projects, currentProject } = useWorkbench();
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setcssContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (!currentProject) return;
    
    // Find HTML files
    const htmlFile = currentProject.tabs.find(tab => 
      tab.name.endsWith('.html') && tab.type === 'code'
    );
    
    // Find CSS files
    const cssFile = currentProject.tabs.find(tab => 
      tab.name.endsWith('.css') && tab.type === 'code'
    );
    
    if (htmlFile) {
      setHtmlContent(htmlFile.content);
      setErrorMessage(null);
    } else {
      setHtmlContent('');
      setErrorMessage('No HTML file found in current project');
    }
    
    if (cssFile) {
      setcssContent(cssFile.content);
    } else {
      setcssContent('');
    }
  }, [currentProject, projects]);
  
  const getCombinedHtml = () => {
    if (!htmlContent) return '';
    
    // Insert CSS into HTML if available
    if (cssContent) {
      // Find where to insert the CSS (in the head or create a head)
      if (htmlContent.includes('</head>')) {
        return htmlContent.replace('</head>', `<style>${cssContent}</style></head>`);
      } else if (htmlContent.includes('<body')) {
        const bodyIndex = htmlContent.indexOf('<body');
        return htmlContent.slice(0, bodyIndex) + 
               `<head><style>${cssContent}</style></head>` + 
               htmlContent.slice(bodyIndex);
      } else {
        return `<head><style>${cssContent}</style></head>${htmlContent}`;
      }
    }
    
    return htmlContent;
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm font-medium">HTML Preview</span>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {errorMessage ? (
            <span className="text-red-500">{errorMessage}</span>
          ) : (
            <span>Showing preview of project files</span>
          )}
        </div>
      </div>
      
      <div className="flex-1 bg-white">
        {errorMessage ? (
          <div className="h-full flex items-center justify-center p-4 text-center text-gray-500">
            <div>
              <p className="mb-2">{errorMessage}</p>
              <p className="text-sm">Create an HTML file in your project to see a preview here.</p>
            </div>
          </div>
        ) : (
          <iframe
            title="HTML Preview"
            srcDoc={getCombinedHtml()}
            className="w-full h-full border-none"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  );
};

export default HtmlPreview;