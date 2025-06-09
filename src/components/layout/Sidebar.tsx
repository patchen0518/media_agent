import React from 'react';
import { Plus, Trash2, MessageSquare, Settings } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Sidebar: React.FC = () => {
  const { 
    chats, 
    currentChatId, 
    createChat, 
    setCurrentChat, 
    deleteChat,
    sidebarOpen,
    setSettingsOpen
  } = useStore((state) => ({
    chats: state.chats,
    currentChatId: state.currentChatId,
    createChat: state.createChat,
    setCurrentChat: state.setCurrentChat,
    deleteChat: state.deleteChat,
    sidebarOpen: state.sidebarOpen,
    setSettingsOpen: state.setSettingsOpen
  }));
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  if (!sidebarOpen) return null;
  
  return (
    <motion.div 
      className="w-72 h-screen flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold">Media Agent</h1>
        <ThemeToggle />
      </div>
      
      <div className="p-4">
        <button
          onClick={createChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'group p-3 mx-2 my-1 rounded-lg cursor-pointer flex items-center gap-3',
                'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                chat.id === currentChatId && 'bg-gray-100 dark:bg-gray-800'
              )}
              onClick={() => setCurrentChat(chat.id)}
            >
              <MessageSquare 
                size={18} 
                className={cn(
                  'text-gray-500 dark:text-gray-400',
                  chat.id === currentChatId && 'text-blue-500 dark:text-blue-400'
                )}
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate">{chat.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(chat.lastUpdated)}
                </p>
              </div>
              <button
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                aria-label="Delete chat"
              >
                <Trash2 size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </motion.div>
  );
};