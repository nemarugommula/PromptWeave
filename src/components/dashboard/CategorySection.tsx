
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PromptCard, PromptCardProps } from './PromptCard';

interface CategorySectionProps {
  title: string;
  prompts: Omit<PromptCardProps, 'onDelete' | 'onClick' | 'onExport'>[];
  color?: string; 
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  defaultOpen?: boolean;
}

export function CategorySection({
  title,
  prompts,
  color,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onExportPrompt,
  defaultOpen = false
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);
  
  const displayPrompts = showAll ? prompts : prompts.slice(0, 3);
  const hasMore = prompts.length > 3;
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleShowMoreToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAll(!showAll);
  };
  
  // If there are no prompts, don't render the section
  if (prompts.length === 0) return null;
  
  return (
    <div className="mb-8">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? title : undefined}
        className="border rounded-md"
      >
        <AccordionItem value={title} className="border-none">
          <AccordionTrigger 
            className="px-4 py-2 hover:no-underline" 
            onClick={handleToggle}
          >
            <div className="flex items-center gap-2">
              {color && (
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
              )}
              <h2 className="text-xl font-semibold">{title}</h2>
              <div className="text-sm text-muted-foreground ml-2">
                ({prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'})
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-2 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPrompts.map(prompt => (
                <PromptCard 
                  key={prompt.id} 
                  {...prompt} 
                  onDelete={onDeletePrompt} 
                  onClick={onOpenPrompt}
                  onFavoriteToggle={onFavoriteToggle}
                  onExport={onExportPrompt}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-4 text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShowMoreToggle}
                >
                  {showAll ? 'Show less' : `Show all (${prompts.length})`}
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
