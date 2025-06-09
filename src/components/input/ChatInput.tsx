import React, { useState, useRef, useEffect } from 'react';
import { Image, Send, X } from 'lucide-react';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { LLMService } from '../../services/llm';

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { currentChatId, addMessage, llmConfig } = useStore((state) => ({
    currentChatId: state.currentChatId,
    addMessage: state.addMessage,
    llmConfig: state.llmConfig,
  }));
  
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 200);
    textarea.style.height = `${newHeight}px`;
  };
  
  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !image) return;
    if (!currentChatId || !llmConfig.isConfigured) return;
    
    addMessage(currentChatId, {
      role: 'user',
      content: message,
      images: image ? [image] : undefined,
    });
    
    setMessage('');
    setImage(null);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
    
    setSending(true);
    const llmService = new LLMService(llmConfig);
    
    try {
      const response = await llmService.sendMessage(message);
      addMessage(currentChatId, {
        role: 'assistant',
        content: response,
      });
    } catch (error) {
      addMessage(currentChatId, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should not exceed 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  };
  
  const removeImage = () => {
    setImage(null);
  };
  
  if (!currentChatId) return null;
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 flex-shrink-0">
      <AnimatePresence>
        {image && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative inline-block">
              <img
                src={image}
                alt="Upload preview"
                className="h-20 w-auto rounded-md"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white transition-colors"
                onClick={removeImage}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label className="p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Image size={20} className="text-gray-500 dark:text-gray-400" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            style={{
              minHeight: '44px',
              maxHeight: '200px',
              lineHeight: '1.5',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={(!message.trim() && !image) || sending || !llmConfig.isConfigured}
        >
          <Send size={20} className={sending ? 'animate-pulse' : ''} />
        </button>
      </form>
    </div>
  );
};