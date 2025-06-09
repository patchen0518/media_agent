import { Request, Response, NextFunction } from 'express';
import { LLMService } from '../services/llm';
import { ApiError } from '../utils/apiError';

export class LLMController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, provider, model } = req.body;
      
      const llmService = new LLMService({
        provider,
        model,
        apiKey: process.env[`${provider.toUpperCase()}_API_KEY`],
      });
      
      const response = await llmService.sendMessage(message);
      
      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(new ApiError(error));
    }
  }
}