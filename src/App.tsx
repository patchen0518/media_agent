import React, { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { useStore } from './store';

function App() {
  const createChat = useStore((state) => state.createChat);
  const chats = useStore((state) => state.chats);
  
  // Create an initial chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createChat();
    }
  }, [chats.length, createChat]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <MainLayout />
    </div>
  );
}

export default App;