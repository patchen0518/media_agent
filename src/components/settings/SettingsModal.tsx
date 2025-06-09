import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { LLMProvider } from '../../types';
import { validateConfig } from '../../utils/llm';

export const SettingsModal: React.FC = () => {
  const { settingsOpen, setSettingsOpen, llmConfig, setLLMConfig } = useStore(
    (state) => ({
      settingsOpen: state.settingsOpen,
      setSettingsOpen: state.setSettingsOpen,
      llmConfig: state.llmConfig,
      setLLMConfig: state.setLLMConfig,
    })
  );
  
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  
  const providers: { value: LLMProvider; label: string }[] = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'ollama', label: 'Ollama' },
    { value: 'gemini', label: 'Google Gemini' },
  ];
  
  const models = {
    openai: [
      { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
    ],
    ollama: [
      { value: 'devstral:latest', label: 'devstral:latest' },
      { value: 'gemma3:12b-it-qat', label: 'gemma3:12b-it-qat' },
    ],
    gemini: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash - Maximum capability' },
      { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite - Optimized for speed' },
    ],
  };
  
  const handleClose = () => {
    if (llmConfig.isConfigured) {
      setSettingsOpen(false);
    }
  };
  
  const handleSave = async () => {
    setError(null);
    setTesting(true);
    
    try {
      const result = await validateConfig(llmConfig);
      if (result.isValid) {
        setLLMConfig({ isConfigured: true });
        setSettingsOpen(false);
      } else {
        setError(result.error || 'Configuration validation failed');
      }
    } catch (err) {
      setError('Failed to validate configuration');
    } finally {
      setTesting(false);
    }
  };
  
  if (!settingsOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Settings</h2>
            {llmConfig.isConfigured && (
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium">LLM Configuration</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Provider</label>
                <select
                  value={llmConfig.provider}
                  onChange={(e) => setLLMConfig({ 
                    provider: e.target.value as LLMProvider,
                    model: models[e.target.value as LLMProvider][0].value,
                    isConfigured: false,
                  })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                >
                  {providers.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Model</label>
                <select
                  value={llmConfig.model}
                  onChange={(e) => setLLMConfig({ model: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                >
                  {models[llmConfig.provider].map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {(llmConfig.provider === 'openai' || llmConfig.provider === 'gemini') && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {llmConfig.provider === 'openai' ? 'OpenAI API Key' : 'Google API Key'}
                  </label>
                  <input
                    type="password"
                    value={llmConfig.apiKey || ''}
                    onChange={(e) => setLLMConfig({ apiKey: e.target.value, isConfigured: false })}
                    placeholder={`Enter your ${llmConfig.provider === 'openai' ? 'OpenAI' : 'Google'} API key`}
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
              )}
              
              {llmConfig.provider === 'ollama' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Ollama URL</label>
                  <input
                    type="text"
                    value={llmConfig.baseUrl || 'http://localhost:11434'}
                    onChange={(e) => setLLMConfig({ baseUrl: e.target.value, isConfigured: false })}
                    placeholder="http://localhost:11434"
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
              )}
              
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
            <button
              onClick={handleSave}
              disabled={testing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? 'Testing Connection...' : 'Save'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};