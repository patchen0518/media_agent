export type LLMProvider = 'openai' | 'ollama' | 'gemini';

export type LLMModel = string;

export interface LLMConfig {
  provider: LLMProvider;
  model: LLMModel;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  isConfigured?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  images?: string[];
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
  context?: string;
  llmConfig?: LLMConfig;
}

export interface SocialMediaPost {
  id: string;
  content: string;
  platform: 'threads' | 'other';
  images?: string[];
  status: 'draft' | 'ready' | 'posted';
  createdAt: number;
  postedAt?: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface LLMError {
  title: string;
  message: string;
  code: string;
  timestamp: number;
  resolution: string[];
}