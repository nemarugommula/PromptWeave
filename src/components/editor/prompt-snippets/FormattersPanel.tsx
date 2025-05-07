import React, { memo } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { FormatterGroup, Formatter } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FormattersPanelProps {
  formatterGroups: FormatterGroup[];
  handleFormatClick: (formatter: Formatter) => void;
}

export const FormattersPanel = memo(({ 
  formatterGroups, 
  handleFormatClick 
}: FormattersPanelProps) => {
  return (
    <div className="space-y-2 py-1">
      <Accordion type="multiple" defaultValue={formatterGroups.map(g => g.name)} className="space-y-2">
        {formatterGroups.map((group) => (
          <FormatterGroupSection 
            key={group.name}
            group={group}
            handleFormatClick={handleFormatClick}
          />
        ))}
      </Accordion>
      
      <div className="pt-2 pb-1 px-2 text-center bg-muted/20 rounded-md mt-4 mx-2">
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
}

const FormatterGroupSection = memo(({
  group,
  handleFormatClick
}: FormatterGroupSectionProps) => {
  // Use grid layout for better visual organization
  const gridCols = group.formatters.length > 6 ? "grid-cols-3" : "grid-cols-2";
  
  return (
    <AccordionItem 
      value={group.name} 
      className="border overflow-hidden rounded-lg shadow-sm bg-card mx-2"
    >
      <AccordionTrigger className="px-3 py-2 hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="capitalize">{group.name}</span>
          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
            {group.formatters.length}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-2 pb-2">
          <div className={`grid ${gridCols} gap-2`}>
            {group.formatters.map(formatter => (
              <FormatterButton
                key={formatter.id}
                formatter={formatter}
                onClick={() => handleFormatClick(formatter)}
              />
            ))}
          </div>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <div className="flex items-center justify-center mt-2 pt-2 border-t border-dashed">
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                    <Info className="h-3 w-3" />
                    <span>Usage information</span>
                  </div>
                </TooltipTrigger>
              </div>
              <TooltipContent side="bottom" className="w-80">
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
      </AccordionContent>
    </AccordionItem>
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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className={cn(
              "h-9 px-3 text-xs font-medium rounded-md border",
              "flex items-center justify-center gap-1.5 transition-colors",
              "bg-card hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "relative overflow-hidden group w-full"
            )}
            onClick={onClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Background hover effect */}
            <motion.div 
              className="absolute inset-0 bg-primary/5 rounded-md"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
            
            {/* Formatter content */}
            <div className="relative flex items-center justify-center w-full gap-1.5">
              {formatter.icon && (
                <motion.span
                  whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0"
                >
                  {formatter.icon}
                </motion.span>
              )}
              <span className="truncate">{formatter.label}</span>
              {formatter.shortcut && (
                <kbd className="ml-auto inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-medium opacity-80 group-hover:opacity-100">
                  {formatter.shortcut}
                </kbd>
              )}
            </div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-xs font-medium">
            {formatter.tooltip || formatter.label}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});