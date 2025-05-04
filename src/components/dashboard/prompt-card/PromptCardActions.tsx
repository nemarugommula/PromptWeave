
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Star, Archive, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PromptCardActionsProps {
  id: string;
  is_favorite?: boolean;
  archived?: boolean;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onArchiveToggle?: (id: string) => void;
  onExport?: (id: string, e: React.MouseEvent) => void;
}

export function PromptCardActions({
  id,
  is_favorite,
  archived,
  onDelete,
  onClick,
  onFavoriteToggle,
  onArchiveToggle,
  onExport
}: PromptCardActionsProps) {
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onFavoriteToggle) return;
    onFavoriteToggle(id, !is_favorite);
  };

  const handleArchiveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onArchiveToggle) return;
    onArchiveToggle(id);
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className={cn(
          "h-8 w-8 p-0",
          is_favorite ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"
        )} 
        onClick={handleFavoriteToggle}
      >
        <Star className="h-4 w-4" fill={is_favorite ? "currentColor" : "none"} />
        <span className="sr-only">Favorite</span>
      </Button>
      
      {onArchiveToggle && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" 
          onClick={handleArchiveToggle}
        >
          <Archive className="h-4 w-4" />
          <span className="sr-only">{archived ? "Unarchive" : "Archive"}</span>
        </Button>
      )}
      
      {onExport && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" 
          onClick={(e) => {
            e.stopPropagation();
            onExport(id, e);
          }}
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Export</span>
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={(e) => {
          e.stopPropagation();
          onClick(id);
        }}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
        onClick={(e) => onDelete(id, e)}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
