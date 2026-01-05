import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { resetTheme, loadSavedTheme } from '@/utils/themeManager';
import { useState, useEffect } from 'react';

export const ResetThemeButton = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  useEffect(() => {
    // Check current theme
    const saved = loadSavedTheme();
    setCurrentTheme(saved);
    
    // Listen for theme changes (if needed for future updates)
    const checkTheme = () => {
      const theme = loadSavedTheme();
      setCurrentTheme(theme);
    };
    
    // Check periodically (every 2 seconds) for theme changes
    const interval = setInterval(checkTheme, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    resetTheme();
    setCurrentTheme('default');
  };

  // Only show button if a custom theme is active
  if (currentTheme === 'default') {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full w-12 h-12 p-0 bg-card/80 backdrop-blur-sm border border-border hover:bg-card"
          title="Reset Theme"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Theme?</AlertDialogTitle>
          <AlertDialogDescription>
            This will return the interface to the default theme. You can always apply a new theme based on your emotions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>
            Reset to Default
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

