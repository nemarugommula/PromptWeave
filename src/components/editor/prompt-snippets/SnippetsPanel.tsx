import React, { memo } from 'react';
import { Pin, PinOff, Text, Plus, ChevronDown, ChevronUp, Copy, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CategorySnippets, Snippet } from './types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface SnippetsPanelProps {
  categorizedSnippets: CategorySnippets;
  searchQuery: string;
  clearSearch: () => void;
  onInsert: (content: string) => void;
  onTogglePin: (id: string) => void;
  sortBy?: 'recent' | 'alphabetical' | 'category';
}

export const SnippetsPanel = memo(({
  categorizedSnippets,
  searchQuery,
  clearSearch,
  onInsert,
  onTogglePin,
  sortBy = 'category'
}: SnippetsPanelProps) => {
  const isEmpty = Object.keys(categorizedSnippets).length === 0;
  
  if (searchQuery && isEmpty) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
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
      </motion.div>
    );
  }

  if (isEmpty) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Plus className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium">No snippets available</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Snippets you create will appear here
        </p>
      </motion.div>
    );
  }

  // Sort categories based on selected sort option
  let sortedEntries = Object.entries(categorizedSnippets);
  if (sortBy === 'alphabetical') {
    // Flatten and sort all snippets alphabetically
    const allSnippets = sortedEntries.flatMap(([_, snippets]) => snippets);
    allSnippets.sort((a, b) => a.title.localeCompare(b.title));
    
    // Create a single "All" category with sorted snippets
    sortedEntries = [["All Snippets", allSnippets]];
  } else if (sortBy === 'recent') {
    // In a real app, you would sort by timestamp
    // For now, we'll just return the default order
    sortedEntries = Object.entries(categorizedSnippets);
  }
  
  return (
    <div className="py-2">
      {sortedEntries.map(([category, snippets], categoryIndex) => (
        <CategorySection
          key={category}
          category={category}
          snippets={snippets}
          isFirst={categoryIndex === 0}
          isLast={categoryIndex === sortedEntries.length - 1}
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
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={cn("space-y-2", !isFirst && "mt-2 pt-2")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between px-4 group">
          <CollapsibleTrigger asChild>
            <div className="flex items-center cursor-pointer py-1 -mx-1 px-1 rounded-md hover:bg-muted group-hover:bg-muted/80">
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              )}
              <h3 className="text-sm font-medium text-foreground flex items-center">
                {category}
                <Badge variant="outline" className="ml-2 px-1.5 py-0 text-[10px]">
                  {snippets.length}
                </Badge>
              </h3>
            </div>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-2 mt-1 px-3"
            >
              {snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onInsert={onInsert}
                  onTogglePin={onTogglePin}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {!isLast && <Separator className="mt-3" />}
    </div>
  );
});

interface SnippetCardProps {
  snippet: Snippet;
  onInsert: (content: string) => void;
  onTogglePin: (id: string) => void;
}

const SnippetCard = memo(({
  snippet,
  onInsert,
  onTogglePin
}: SnippetCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Get a simplified preview of the content
  const contentPreview = React.useMemo(() => {
    const trimmed = snippet.content.trim();
    const firstLine = trimmed.split('\n')[0].slice(0, 40);
    return firstLine.length < trimmed.length ? `${firstLine}...` : firstLine;
  }, [snippet.content]);

  // Detect if the snippet content is likely to be code
  const isCode = React.useMemo(() => {
    return (
      snippet.content.includes('{') ||
      snippet.content.includes('}') ||
      snippet.content.includes('<') ||
      snippet.content.includes('>') ||
      snippet.content.includes('function') ||
      snippet.content.includes('```')
    );
  }, [snippet.content]);

  // Copy snippet to clipboard
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.content);
  };

  return (
    <motion.div
      className={cn(
        "rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden",
        "transition-all duration-200 group cursor-pointer",
        isHovered ? "border-primary/50 shadow-md" : "border-border/50",
        snippet.isPinned && !isHovered && "border-l-primary border-l-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onInsert(snippet.content)}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium flex-1">{snippet.title}</h4>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs">Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(snippet.id);
                    }}
                  >
                    {snippet.isPinned ? (
                      <PinOff className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Pin className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs">{snippet.isPinned ? 'Unpin' : 'Pin to top'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {snippet.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {snippet.description}
          </p>
        )}

        {/* Code preview with syntax highlighting effect */}
        <div className={cn(
          "text-xs font-mono p-1.5 rounded mt-1 overflow-hidden relative",
          isCode ? "bg-muted" : "bg-muted/50",
          isHovered && isCode && "bg-muted/80"
        )}>
          <motion.div
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            animate={{ 
              x: contentPreview.length > 30 && isHovered ? -Math.min(contentPreview.length * 4, 100) : 0 
            }}
            transition={{ 
              duration: contentPreview.length > 30 ? 5 : 0,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            {contentPreview}
          </motion.div>
        </div>
        
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {snippet.tags.map(tag => (
              <div key={tag} className="flex items-center">
                <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{tag}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});