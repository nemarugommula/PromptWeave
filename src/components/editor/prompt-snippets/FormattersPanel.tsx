import React, { memo } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { FormatterGroup, Formatter } from './types';

interface FormattersPanelProps {
  formatterGroups: FormatterGroup[];
  handleFormatClick: (formatter: Formatter) => void;
}

export const FormattersPanel = memo(({ 
  formatterGroups, 
  handleFormatClick 
}: FormattersPanelProps) => {
  return (
    <div className="p-2 space-y-4">
      {formatterGroups.map((group, index) => (
        <div key={group.name} className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-medium capitalize text-muted-foreground">
              {group.name}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="w-80">
                  <div className="space-y-2 text-xs">
                    <p>Formatters allow you to quickly structure your prompt content.</p>
                    <p>Click any formatter to apply it to the current selection.</p>
                    {group.formatters.some(f => f.shortcut) && (
                      <p className="text-muted-foreground">Some formatters have keyboard shortcuts displayed next to them.</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap gap-1">
            {group.formatters.map(formatter => (
              <TooltipProvider key={formatter.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-7 px-2.5 text-xs font-medium",
                        "flex items-center gap-1.5"
                      )}
                      onClick={() => handleFormatClick(formatter)}
                    >
                      {formatter.icon && <span>{formatter.icon}</span>}
                      <span>{formatter.label}</span>
                      {formatter.shortcut && (
                        <kbd className="ml-1 inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium opacity-100 sm:opacity-60">
                          {formatter.shortcut}
                        </kbd>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    {formatter.tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {index < formatterGroups.length - 1 && (
            <Separator className="my-2" />
          )}
        </div>
      ))}
      
      <div className="pt-2 pb-1 px-1.5 text-center">
        <span className="text-xs text-muted-foreground">
          Keyboard shortcuts work when editor is focused
        </span>
      </div>
    </div>
  );
});