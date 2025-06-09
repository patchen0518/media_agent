import React from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme, mounted } = useTheme();
  
  // Prevent hydration mismatch by not rendering the toggle until mounted
  if (!mounted) return null;
  
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-full transition-colors',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' && <Moon size={20} />}
      {theme === 'light' && <Sun size={20} />}
      {theme === 'system' && <SunMoon size={20} />}
    </button>
  );
};