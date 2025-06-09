import React from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from '../input/ChatInput';
import { SettingsModal } from '../settings/SettingsModal';
import { useStore } from '../../store';

export const MainLayout: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    setSidebarOpen: state.setSidebarOpen,
  }));
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
          >
            <Menu size={24} />
          </button>
        )}
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ChatWindow />
          <ChatInput />
        </div>
      </div>
      
      <SettingsModal />
    </div>
  );
};