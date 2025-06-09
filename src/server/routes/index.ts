import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator';
import { LLMController } from '../controllers/llm';
import DOMPurify from 'isomorphic-dompurify';

export const router = Router();

const sanitizeInput = (value: string) => DOMPurify.sanitize(value);

router.post(
  '/generate',
  [
    body('message')
      .trim()
      .notEmpty()
      .customSanitizer(sanitizeInput)
      .withMessage('Message is required'),
    body('provider')
      .trim()
      .notEmpty()
      .isIn(['openai', 'gemini'])
      .withMessage('Valid provider is required'),
    body('model')
      .trim()
      .notEmpty()
      .withMessage('Model is required'),
  ],
  validateRequest,
  LLMController.generate
);