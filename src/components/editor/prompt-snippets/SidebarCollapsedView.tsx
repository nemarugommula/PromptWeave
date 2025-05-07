import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { Formatter } from './types';

interface SidebarCollapsedViewProps {
  toggleCollapsed: () => void;
  formatters: Formatter[];
  handleFormatClick: (formatter: Formatter) => void;
}

export const SidebarCollapsedView: React.FC<SidebarCollapsedViewProps> = ({ 
  toggleCollapsed, 
  formatters, 
  handleFormatClick 
}) => {
  // Show only the most important formatters in collapsed view
  const visibleFormatters = formatters.filter(f => 
    ['bold', 'italic', 'heading1', 'bullet-list', 'code'].includes(f.id)
  );

  return (
    <motion.aside 
      initial={{ width: 256 }}
      animate={{ width: 48 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col bg-background border-r h-full relative overflow-hidden"
    >
      {/* Header with animated sparkle */}
      <div className="flex justify-center py-3 border-b">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </motion.div>
      </div>
      
      <div className="flex flex-col items-center py-2 gap-2">
        {visibleFormatters.map(formatter => (
          <TooltipProvider key={formatter.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-md",
                      "transition-all duration-200 hover:bg-accent"
                    )}
                    onClick={() => handleFormatClick(formatter)}
                  >
                    {formatter.icon}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right" align="start" className="flex flex-col gap-1 p-2 max-w-[180px]">
                <span className="font-medium">{formatter.label}</span>
                {formatter.tooltip && (
                  <span className="text-xs text-muted-foreground">{formatter.tooltip}</span>
                )}
                {formatter.shortcut && (
                  <kbd className="mt-1 inline-flex h-5 items-center justify-center rounded border bg-muted px-1.5 text-[10px] font-medium">
                    {formatter.shortcut}
                  </kbd>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        
        <Separator className="my-1 w-4/5" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleCollapsed}
                >
                  <motion.div
                    animate={{ x: [0, 2, 0, 2, 0] }}
                    transition={{ 
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity, 
                      repeatDelay: 3
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Expand sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.aside>
  );
};

// Separator component for clean code organization
const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px bg-border", className)} />
);

// Import necessary icons
import { ChevronRight } from 'lucide-react';