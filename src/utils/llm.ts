import { LLMConfig, ValidationResult } from '../types';
import { encrypt, decrypt } from './encryption';
import { GoogleGenerativeAI } from '@google/generative-ai';

const STORAGE_KEY = 'llm-config';

export const validateConfig = async (config: LLMConfig): Promise<ValidationResult> => {
  if (config.provider === 'openai') {
    if (!config.apiKey) {
      return { isValid: false, error: 'OpenAI API key is required' };
    }
    
    if (!config.apiKey.startsWith('sk-')) {
      return { isValid: false, error: 'Invalid OpenAI API key format' };
    }
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });
      
      if (!response.ok) {
        return { isValid: false, error: 'Invalid OpenAI API key' };
      }
    } catch (error) {
      return { isValid: false, error: 'Failed to connect to OpenAI' };
    }
  }
  
  if (config.provider === 'ollama') {
    if (!config.baseUrl) {
      return { isValid: false, error: 'Ollama URL is required' };
    }
    
    try {
      const response = await fetch(`${config.baseUrl}/api/tags`);
      if (!response.ok) {
        return { isValid: false, error: 'Failed to connect to Ollama' };
      }
    } catch (error) {
      return { isValid: false, error: 'Failed to connect to Ollama server' };
    }
  }

  if (config.provider === 'gemini') {
    if (!config.apiKey) {
      return { isValid: false, error: 'Google API key is required' };
    }

    try {
      const genAI = new GoogleGenerativeAI(config.apiKey);
      const model = genAI.getGenerativeModel({ model: config.model });
      await model.generateContent('Test connection');
    } catch (error) {
      return { isValid: false, error: 'Invalid Google API key or model access' };
    }
  }
  
  return { isValid: true };
};

export const saveConfig = (config: LLMConfig): void => {
  const configToSave = {
    ...config,
    apiKey: config.apiKey ? encrypt(config.apiKey) : undefined,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
};

export const loadConfig = (): LLMConfig | null => {
  const savedConfig = localStorage.getItem(STORAGE_KEY);
  if (!savedConfig) return null;
  
  try {
    const config = JSON.parse(savedConfig) as LLMConfig;
    return {
      ...config,
      apiKey: config.apiKey ? decrypt(config.apiKey) : undefined,
    };
  } catch (error) {
    console.error('Failed to load LLM config:', error);
    return null;
  }
};