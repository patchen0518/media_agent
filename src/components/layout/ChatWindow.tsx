import React from 'react';
import { useStore } from '../../store';
import { cn } from '../../utils/cn';
import { ArrowRight, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ChatWindow: React.FC = () => {
  const { chats, currentChatId } = useStore((state) => ({
    chats: state.chats,
    currentChatId: state.currentChatId,
  }));
  
  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);
  
  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
        <ArrowRight className="mb-4\" size={32} />
        <h2 className="text-xl font-medium mb-2">Select a chat or create a new one</h2>
        <p>Start generating social media content with the power of AI</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex-shrink-0">
        <h2 className="font-medium">{currentChat.title}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {currentChat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <UserCircle className="mb-4\" size={32} />
            <h3 className="text-lg font-medium mb-2">Start a new conversation</h3>
            <p>Your messages will appear here</p>
          </div>
        ) : (
          <>
            {currentChat.messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'max-w-3xl rounded-lg p-4',
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white ml-auto' 
                    : 'bg-gray-100 dark:bg-gray-800 mr-auto'
                )}
              >
                {message.images && message.images.length > 0 && (
                  <div className="mb-3">
                    <img
                      src={message.images[0]}
                      alt="Message content"
                      className="max-w-full h-auto rounded-md"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};