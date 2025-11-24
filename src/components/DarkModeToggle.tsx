import React from 'react';
import { Moon, Sun, Clock } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode, isAutoMode, toggleAutoMode } = useDarkMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-2 hover:scale-110 transition-transform"
        >
          {isAutoMode ? (
            <Clock className="h-5 w-5" />
          ) : isDarkMode ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={toggleAutoMode}>
          <Clock className="mr-2 h-4 w-4" />
          <span>Auto (Time-based)</span>
          {isAutoMode && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          if (isDarkMode || isAutoMode) toggleDarkMode();
        }}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light Mode</span>
          {!isDarkMode && !isAutoMode && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          if (!isDarkMode || isAutoMode) toggleDarkMode();
        }}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark Mode</span>
          {isDarkMode && !isAutoMode && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
