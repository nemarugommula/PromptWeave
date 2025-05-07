import React, { memo } from 'react';
import { Pin, PinOff, Text, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CategorySnippets, Snippet } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SnippetsPanelProps {
  categorizedSnippets: CategorySnippets;
  searchQuery: string;
  clearSearch: () => void;
  onInsert: (content: string) => void;
  onTogglePin: (id: string) => void;
}

export const SnippetsPanel = memo(({
  categorizedSnippets,
  searchQuery,
  clearSearch,
  onInsert,
  onTogglePin
}: SnippetsPanelProps) => {
  const isEmpty = Object.keys(categorizedSnippets).length === 0;
  
  if (searchQuery && isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Text className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium">No matching snippets</h3>
        <p className="text-xs text-muted-foreground mt-1">
          No snippets match your search for "{searchQuery}"
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={clearSearch}
        >
          Clear Search
        </Button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Plus className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium">No snippets available</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Snippets you create will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {Object.entries(categorizedSnippets).map(([category, snippets], categoryIndex) => (
        <CategorySection
          key={category}
          category={category}
          snippets={snippets}
          isFirst={categoryIndex === 0}
          isLast={categoryIndex === Object.keys(categorizedSnippets).length - 1}
          onInsert={onInsert}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
});

interface CategorySectionProps {
  category: string;
  snippets: Snippet[];
  isFirst: boolean;
  isLast: boolean;
  onInsert: (content: string) => void;
  onTogglePin: (id: string) => void;
}

const CategorySection = memo(({
  category,
  snippets,
  isFirst,
  isLast,
  onInsert,
  onTogglePin
}: CategorySectionProps) => {
  return (
    <div className={cn("space-y-2", !isFirst && "mt-3")}>
      <h3 className="px-4 text-xs font-medium text-muted-foreground">
        {category}
      </h3>
      
      {snippets.map((snippet, index) => (
        <SnippetItem 
          key={snippet.id}
          snippet={snippet}
          onInsert={onInsert}
          onTogglePin={onTogglePin}
        />
      ))}

      {!isLast && <Separator className="mt-3" />}
    </div>
  );
});

interface SnippetItemProps {
  snippet: Snippet;
  onInsert: (content: string) => void;
  onTogglePin: (id: string) => void;
}

const SnippetItem = memo(({
  snippet,
  onInsert,
  onTogglePin
}: SnippetItemProps) => {
  return (
    <div className="px-2 group">
      <div
        className={cn(
          "rounded-md px-2 py-1.5 relative",
          "hover:bg-accent cursor-pointer transition-colors",
          "flex items-start justify-between group/item"
        )}
        onClick={() => onInsert(snippet.content)}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-none">{snippet.title}</span>
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex gap-1">
                {snippet.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="px-1 py-0 text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {snippet.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {snippet.description}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(snippet.id);
          }}
          aria-label={snippet.isPinned ? "Unpin snippet" : "Pin snippet"}
        >
          {snippet.isPinned ? (
            <PinOff className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Pin className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
});