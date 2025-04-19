import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WorkbenchProvider } from './context/WorkbenchContext';
import Workbench from './components/Workbench/Workbench';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <WorkbenchProvider>
        <Workbench />
      </WorkbenchProvider>
    </ThemeProvider>
  );
}

export default App;