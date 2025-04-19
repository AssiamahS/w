import { useEffect, useRef } from 'react';

type KeyCombination = string[];

export const useKeyboardShortcut = (
  keys: KeyCombination,
  callback: () => void,
  node: HTMLElement | Document = document
) => {
  // Keep track of pressed keys
  const pressedKeys = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      // Add the key to pressedKeys
      pressedKeys.current.add(event.key);
      
      // Normalize key names (Meta = Command on Mac)
      if (event.metaKey) pressedKeys.current.add('Meta');
      
      // Check if all required keys are pressed
      const allKeysPressed = keys.every(key => 
        pressedKeys.current.has(key) || 
        // Handle special cases like Delete/Backspace
        (key === 'Delete' && pressedKeys.current.has('Backspace'))
      );
      
      if (allKeysPressed) {
        event.preventDefault();
        callback();
      }
    };
    
    const upHandler = (event: KeyboardEvent) => {
      // Remove the key from pressedKeys
      pressedKeys.current.delete(event.key);
      
      // Remove Meta if meta key is released
      if (event.key === 'Meta') {
        pressedKeys.current.delete('Meta');
      }
    };
    
    // The blur event helps to clear the pressed keys if the window loses focus
    const clearKeys = () => {
      pressedKeys.current.clear();
    };
    
    node.addEventListener('keydown', downHandler);
    node.addEventListener('keyup', upHandler);
    window.addEventListener('blur', clearKeys);
    
    return () => {
      node.removeEventListener('keydown', downHandler);
      node.removeEventListener('keyup', upHandler);
      window.removeEventListener('blur', clearKeys);
    };
  }, [keys, callback, node]);
};