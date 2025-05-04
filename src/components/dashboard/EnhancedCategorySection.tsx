
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { PromptGridView } from './views/PromptGridView';
import { PromptListView } from './views/PromptListView';
import { ViewMode } from '@/contexts/LayoutContext';

interface EnhancedCategorySectionProps {
  title: string;
  color?: string;
  prompts: any[];
  viewMode: ViewMode;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  defaultOpen?: boolean;
}

export const EnhancedCategorySection: React.FC<EnhancedCategorySectionProps> = ({
  title,
  color,
  prompts,
  viewMode,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onArchiveToggle,
  onExportPrompt,
  defaultOpen = false
}) => {
  // Create a simple category map for this section
  const categoryMap = {
    category: {
      id: 'category',
      name: title,
      color: color
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <PromptListView
            prompts={prompts.map(p => ({ ...p, categoryName: title, categoryColor: color }))}
            categoryMap={categoryMap}
            onDeletePrompt={onDeletePrompt}
            onOpenPrompt={onOpenPrompt}
            onFavoriteToggle={onFavoriteToggle}
            onArchiveToggle={onArchiveToggle}
            onExportPrompt={onExportPrompt}
          />
        );
      case 'grid':
      default:
        return (
          <PromptGridView
            prompts={prompts.map(p => ({ ...p, categoryName: title, categoryColor: color }))}
            categoryMap={categoryMap}
            onDeletePrompt={onDeletePrompt}
            onOpenPrompt={onOpenPrompt}
            onFavoriteToggle={onFavoriteToggle}
            onArchiveToggle={onArchiveToggle}
            onExportPrompt={onExportPrompt}
          />
        );
    }
  };

  return (
    <Accordion 
      type="single" 
      collapsible 
      defaultValue={defaultOpen ? title : undefined}
      className="mb-6"
    >
      <AccordionItem value={title}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            {color && (
              <Badge className="h-2 w-2 rounded-full p-0" style={{ backgroundColor: color }}>&nbsp;</Badge>
            )}
            <span className="text-lg font-medium">{title}</span>
            <Badge variant="outline" className="ml-2">{prompts.length}</Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-4">
            {renderContent()}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
