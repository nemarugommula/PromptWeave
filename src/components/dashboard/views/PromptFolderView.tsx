
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Folder } from 'lucide-react';
import { PromptListView } from './PromptListView';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface PromptFolderViewProps {
  prompts: any[];
  categories: Category[];
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
}

export const PromptFolderView: React.FC<PromptFolderViewProps> = ({
  prompts,
  categories,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onArchiveToggle,
  onExportPrompt
}) => {
  // Group prompts by category
  const groupedPrompts: Record<string, any[]> = {};
  
  // Initialize uncategorized group
  groupedPrompts['uncategorized'] = [];
  
  // Group prompts by category
  prompts.forEach(prompt => {
    if (prompt.category_id) {
      if (!groupedPrompts[prompt.category_id]) {
        groupedPrompts[prompt.category_id] = [];
      }
      groupedPrompts[prompt.category_id].push(prompt);
    } else {
      groupedPrompts['uncategorized'].push(prompt);
    }
  });
  
  // Create a map of category IDs to categories
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {} as Record<string, Category>);
  
  // Sort categories by name
  const sortedCategoryIds = Object.keys(groupedPrompts)
    .filter(id => id !== 'uncategorized')
    .sort((a, b) => {
      const nameA = categoryMap[a]?.name || '';
      const nameB = categoryMap[b]?.name || '';
      return nameA.localeCompare(nameB);
    });
  
  // Add uncategorized at the end if it has prompts
  if (groupedPrompts['uncategorized'].length > 0) {
    sortedCategoryIds.push('uncategorized');
  }
  
  return (
    <div className="animate-fade-in">
      <Accordion type="multiple" defaultValue={sortedCategoryIds} className="space-y-4">
        {sortedCategoryIds.map((categoryId) => {
          const category = categoryId === 'uncategorized' 
            ? { id: 'uncategorized', name: 'Uncategorized' } 
            : categoryMap[categoryId];
          
          const categoryPrompts = groupedPrompts[categoryId] || [];
          
          if (!category || categoryPrompts.length === 0) return null;
          
          return (
            <AccordionItem key={categoryId} value={categoryId} className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  {categoryId === 'uncategorized' ? (
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    category.color && (
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                    )
                  )}
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="outline">{categoryPrompts.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <PromptListView
                  prompts={categoryPrompts}
                  categoryMap={categoryMap}
                  onDeletePrompt={onDeletePrompt}
                  onOpenPrompt={onOpenPrompt}
                  onFavoriteToggle={onFavoriteToggle}
                  onArchiveToggle={onArchiveToggle}
                  onExportPrompt={onExportPrompt}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
