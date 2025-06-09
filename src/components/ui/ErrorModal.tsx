import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LLMError } from '../../types';

interface ErrorModalProps {
  error: LLMError;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-title"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-red-500 text-white">
            <h2 id="error-title" className="text-lg font-semibold">{error.title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-red-600 transition-colors"
              aria-label="Close error modal"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{error.message}</p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <code className="font-mono text-sm">
                Error Code: {error.code}
                <br />
                Timestamp: {new Date(error.timestamp).toLocaleString()}
              </code>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Resolution Steps:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {error.resolution.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};