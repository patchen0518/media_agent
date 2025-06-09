import { create } from 'zustand';
import { Chat, ChatMessage, LLMConfig, SocialMediaPost, ThemeMode } from '../types';
import { loadConfig, saveConfig } from '../utils/llm';

interface State {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // Chats
  chats: Chat[];
  currentChatId: string | null;
  createChat: () => void;
  setCurrentChat: (id: string) => void;
  addMessage: (chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  deleteChat: (id: string) => void;
  
  // LLM Configuration
  llmConfig: LLMConfig;
  setLLMConfig: (config: Partial<LLMConfig>) => void;
  
  // Social Media Posts
  posts: SocialMediaPost[];
  createPost: (content: string, images?: string[]) => void;
  updatePostStatus: (id: string, status: SocialMediaPost['status']) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

const savedConfig = loadConfig();

export const useStore = create<State>((set) => ({
  // Theme
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  
  // Chats
  chats: [],
  currentChatId: null,
  createChat: () => {
    const id = crypto.randomUUID();
    set((state) => ({
      chats: [
        {
          id,
          title: `New Chat ${state.chats.length + 1}`,
          messages: [],
          lastUpdated: Date.now(),
        },
        ...state.chats,
      ],
      currentChatId: id,
    }));
  },
  setCurrentChat: (id) => set({ currentChatId: id }),
  addMessage: (chatId, message) => {
    set((state) => {
      const chat = state.chats.find((c) => c.id === chatId);
      if (!chat) return state;
      
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...message,
      };
      
      const updatedChat = {
        ...chat,
        messages: [...chat.messages, newMessage],
        lastUpdated: Date.now(),
        title: chat.messages.length === 0 && message.role === 'user'
          ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
          : chat.title,
      };
      
      return {
        chats: state.chats.map((c) => (c.id === chatId ? updatedChat : c)),
      };
    });
  },
  deleteChat: (id) => {
    set((state) => {
      const newChats = state.chats.filter((c) => c.id !== id);
      return {
        chats: newChats,
        currentChatId: state.currentChatId === id
          ? newChats.length > 0 ? newChats[0].id : null
          : state.currentChatId,
      };
    });
  },
  
  // LLM Configuration
  llmConfig: savedConfig || {
    provider: 'openai',
    model: 'gpt-4o-mini',
    isConfigured: false,
  },
  setLLMConfig: (config) => {
    set((state) => {
      const newConfig = { ...state.llmConfig, ...config };
      saveConfig(newConfig);
      return { llmConfig: newConfig };
    });
  },
  
  // Social Media Posts
  posts: [],
  createPost: (content, images) => {
    set((state) => ({
      posts: [
        {
          id: crypto.randomUUID(),
          content,
          platform: 'threads',
          images,
          status: 'draft',
          createdAt: Date.now(),
        },
        ...state.posts,
      ],
    }));
  },
  updatePostStatus: (id, status) => {
    set((state) => ({
      posts: state.posts.map((post) => 
        post.id === id 
          ? { ...post, status, ...(status === 'posted' ? { postedAt: Date.now() } : {}) } 
          : post
      ),
    }));
  },
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  settingsOpen: !savedConfig?.isConfigured,
  setSettingsOpen: (open) => set({ settingsOpen: open }),
}));