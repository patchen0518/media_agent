import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMConfig, LLMError } from '../types';

export class LLMService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    if (config.provider === 'openai' && config.apiKey) {
      this.openai = new OpenAI({ 
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true 
      });
    } else if (config.provider === 'gemini' && config.apiKey) {
      this.gemini = new GoogleGenerativeAI(config.apiKey);
    }
  }

  private handleError(error: any): never {
    const llmError: LLMError = {
      title: 'LLM Request Failed',
      message: error.message || 'An unexpected error occurred',
      code: error.status || 'UNKNOWN',
      timestamp: Date.now(),
      resolution: this.getResolutionSteps(error),
    };
    throw llmError;
  }

  private getResolutionSteps(error: any): string[] {
    const commonSteps = [
      'Check your internet connection',
      'Verify your API key is correct',
    ];

    if (error.status === 401) {
      return [
        'Your API key appears to be invalid',
        'Generate a new API key from the provider\'s dashboard',
        'Update the API key in the settings',
      ];
    }

    if (error.status === 429) {
      return [
        'You have exceeded your rate limit',
        'Wait a few minutes before trying again',
        'Consider upgrading your API plan if this happens frequently',
      ];
    }

    if (error.status === 403) {
      return [
        'You don\'t have permission to use this model',
        'Check if your API key has the necessary permissions',
        'Verify your account has access to the selected model',
      ];
    }

    return commonSteps;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      if (this.config.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: this.config.model,
          messages: [{ role: 'user', content: message }],
        });
        return response.choices[0]?.message?.content || 'No response generated';
      } else if (this.config.provider === 'gemini' && this.gemini) {
        const model = this.gemini.getGenerativeModel({ model: this.config.model });
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
      } else if (this.config.provider === 'ollama') {
        const response = await fetch(`${this.config.baseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.config.model,
            prompt: message,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from Ollama');
        }

        const data = await response.json();
        return data.response;
      }
      throw new Error('LLM provider not configured');
    } catch (error) {
      console.error('LLM request failed:', error);
      this.handleError(error);
    }
  }
}