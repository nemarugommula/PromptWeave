import React, { memo } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { FormatterGroup, Formatter } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

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
        <FormatterGroupSection 
          key={group.name}
          group={group}
          handleFormatClick={handleFormatClick}
          isLast={index === formatterGroups.length - 1}
        />
      ))}
      
      <div className="pt-2 pb-1 px-1.5 text-center bg-muted/20 rounded-md mt-4">
        <span className="text-xs text-muted-foreground">
          Keyboard shortcuts work when editor is focused
        </span>
      </div>
    </div>
  );
});

interface FormatterGroupSectionProps {
  group: FormatterGroup;
  handleFormatClick: (formatter: Formatter) => void;
  isLast: boolean;
}

const FormatterGroupSection = memo(({
  group,
  handleFormatClick,
  isLast
}: FormatterGroupSectionProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  // Group formatters into rows for better visual layout
  const formatterRows = React.useMemo(() => {
    const rows: Formatter[][] = [];
    let currentRow: Formatter[] = [];
    
    group.formatters.forEach((formatter, i) => {
      currentRow.push(formatter);
      
      // Create rows of 3 formatters for better visual balance
      if (currentRow.length === 3 || i === group.formatters.length - 1) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    });
    
    return rows;
  }, [group.formatters]);
  
  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between px-2 group">
          <CollapsibleTrigger asChild>
            <div className="flex items-center cursor-pointer py-1 -mx-1 px-1 rounded-md hover:bg-muted group-hover:bg-muted/80">
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              )}
              <h3 className="text-sm font-medium capitalize text-foreground flex items-center">
                {group.name}
                <Badge variant="outline" className="ml-2 px-1.5 py-0 text-[10px]">
                  {group.formatters.length}
                </Badge>
              </h3>
            </div>
          </CollapsibleTrigger>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
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
        
        <CollapsibleContent>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1"
            >
              {formatterRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap gap-1 mb-1 px-1">
                  {row.map(formatter => (
                    <FormatterButton
                      key={formatter.id}
                      formatter={formatter}
                      onClick={() => handleFormatClick(formatter)}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {!isLast && <Separator className="my-3" />}
    </div>
  );
});

interface FormatterButtonProps {
  formatter: Formatter;
  onClick: () => void;
}

const FormatterButton = memo(({
  formatter,
  onClick
}: FormatterButtonProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className={cn(
              "h-8 px-2.5 text-xs font-medium rounded-md border",
              "flex items-center gap-1.5 transition-colors",
              "bg-card hover:bg-accent",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {formatter.icon && (
              <motion.span
                animate={{ 
                  rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                  scale: isHovered ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 0.5 }}
              >
                {formatter.icon}
              </motion.span>
            )}
            <span>{formatter.label}</span>
            {formatter.shortcut && (
              <kbd className="ml-1 inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium opacity-100 sm:opacity-70 group-hover:opacity-100">
                {formatter.shortcut}
              </kbd>
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          {formatter.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});