
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Star, Archive, MoreVertical, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PromptListViewProps {
  prompts: any[];
  categoryMap: Record<string, any>;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
}

export const PromptListView: React.FC<PromptListViewProps> = ({
  prompts,
  categoryMap,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onArchiveToggle,
  onExportPrompt
}) => {
  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      {prompts.map((prompt) => {
        const categoryName = prompt.category_id ? categoryMap[prompt.category_id]?.name : undefined;
        const categoryColor = prompt.category_id ? categoryMap[prompt.category_id]?.color : undefined;
        
        return (
          <Card 
            key={prompt.id}
            className={cn(
              "flex items-center justify-between p-3 hover:bg-accent transition-colors cursor-pointer",
              prompt.is_archived && "bg-muted/30 border-dashed"
            )}
            onClick={() => onOpenPrompt(prompt.id)}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 overflow-hidden">
              <h3 className="font-medium truncate max-w-[200px] sm:max-w-none">
                {prompt.name || "Untitled Prompt"}
              </h3>
              
              {categoryName && (
                <Badge 
                  variant="outline" 
                  className="truncate max-w-[100px]"
                  style={categoryColor ? { borderColor: categoryColor, color: categoryColor } : {}}
                >
                  {categoryName}
                </Badge>
              )}
              
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(prompt.updated_at, { addSuffix: true })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", prompt.is_favorite && "text-yellow-500")}
                onClick={() => onFavoriteToggle(prompt.id, !prompt.is_favorite)}
              >
                <Star className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onArchiveToggle(prompt.id)}
              >
                <Archive className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => onExportPrompt(prompt.id, e)}>
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={(e) => onDeletePrompt(prompt.id, e)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
