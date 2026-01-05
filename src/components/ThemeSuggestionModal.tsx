import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { themePresets, EmotionTheme, applyTheme } from '@/utils/themeManager';

interface ThemeSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeName: EmotionTheme;
  emotion: string;
}

export const ThemeSuggestionModal = ({
  isOpen,
  onClose,
  themeName,
  emotion,
}: ThemeSuggestionModalProps) => {
  const theme = themePresets[themeName];

  const handleApply = () => {
    applyTheme(themeName);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <DialogTitle className="text-xl">Theme Suggestion</DialogTitle>
                </div>
                <DialogDescription className="text-base pt-2">
                  I noticed you're feeling <span className="font-medium text-foreground">{emotion}</span>.
                  I have a theme designed to improve your mood. Would you like to try it?
                </DialogDescription>
              </DialogHeader>

              {/* Theme Preview */}
              <div className="my-4 p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, hsl(${theme.colors.primary}), hsl(${theme.colors.secondary}))`,
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-foreground">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                </div>
                
                {/* Color Swatches */}
                <div className="flex gap-2 mt-3">
                  <div
                    className="w-8 h-8 rounded-full border border-border/50"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded-full border border-border/50"
                    style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                    title="Secondary"
                  />
                  <div
                    className="w-8 h-8 rounded-full border border-border/50"
                    style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    title="Accent"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-initial"
                >
                  No Thanks
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 sm:flex-initial"
                  style={{
                    backgroundColor: `hsl(${theme.colors.primary})`,
                    color: `hsl(${theme.colors.primaryForeground})`,
                  }}
                >
                  Apply Theme
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

