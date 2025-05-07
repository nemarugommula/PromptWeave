import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
      <div className="flex flex-col items-center py-2 gap-1">
        {visibleFormatters.map(formatter => (
          <TooltipProvider key={formatter.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleFormatClick(formatter)}
                >
                  {formatter.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="start">
                <div className="flex flex-col">
                  <span className="font-medium">{formatter.label}</span>
                  {formatter.tooltip && (
                    <span className="text-xs text-muted-foreground">{formatter.tooltip}</span>
                  )}
                  {formatter.shortcut && (
                    <kbd className="mt-1 inline-flex h-5 items-center justify-center rounded border bg-muted px-1.5 text-[10px] font-medium">
                      {formatter.shortcut}
                    </kbd>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </motion.aside>
  );
};