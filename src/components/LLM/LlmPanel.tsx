import { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowUp, ArrowDown } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

const LlmPanel = () => {
  const { toggleLlmPanel } = useWorkbench();
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'I am your local LLM assistant. How can I help you with your project today?' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  
  // Focus input field when panel opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSendMessage = () => {
    if (!prompt.trim() || isGenerating) return;
    
    // Add user message to history
    setHistory(prev => [...prev, { role: 'user', content: prompt }]);
    setPrompt('');
    setIsGenerating(true);
    
    // Simulate LLM response with a delay
    setTimeout(() => {
      setHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `This is a simulated response from a local LLM. In a real implementation, this would process your query: "${prompt}" and provide appropriate assistance.`
        }
      ]);
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col shadow-lg border-t border-gray-200 dark:border-gray-700 z-10 animate-slideUp">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium">Local LLM Assistant</h3>
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={toggleLlmPanel}
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 resize-none"
              placeholder="Send a message..."
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute right-2 bottom-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <ArrowUp size={12} className="mr-1" />
                <ArrowDown size={12} />
                <span className="ml-1">navigate</span>
              </div>
            </div>
          </div>
          <button
            className={`p-3 rounded-full ${
              prompt.trim() && !isGenerating
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSendMessage}
            disabled={!prompt.trim() || isGenerating}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LlmPanel;