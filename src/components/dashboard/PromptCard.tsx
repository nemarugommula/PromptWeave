
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { togglePromptFavorite, togglePromptArchive } from '@/lib/db';
import { cn } from "@/lib/utils";
import { PromptCardContent } from './prompt-card/PromptCardContent';
import { PromptCardFooter } from './prompt-card/PromptCardFooter';

export interface PromptCardProps {
  id: string;
  name: string;
  content: string;
  category_id?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
  isArchived?: boolean; // Explicit prop for UI state
  created_at: number;
  updated_at: number;
  categoryName?: string;
  categoryColor?: string;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onArchiveToggle?: (id: string) => void;
  onExport?: (id: string, e: React.MouseEvent) => void;
}

export function PromptCard({
  id,
  name,
  content,
  category_id,
  categoryName,
  categoryColor,
  is_favorite,
  is_archived,
  isArchived, // Use this prop first if available
  created_at,
  updated_at,
  onDelete,
  onClick,
  onFavoriteToggle,
  onArchiveToggle,
  onExport
}: PromptCardProps) {
  const { toast } = useToast();
  
  // Use isArchived prop if provided, otherwise use is_archived from the data
  const archived = isArchived !== undefined ? isArchived : is_archived;
  
  const handleFavoriteToggle = async (id: string, isFavorite: boolean) => {
    try {
      await togglePromptFavorite(id, isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(id, isFavorite);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleArchiveToggle = async (id: string) => {
    try {
      if (onArchiveToggle) {
        onArchiveToggle(id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update archive status",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-lg transition-shadow cursor-pointer",
        archived && "bg-muted/30 border-dashed"
      )}
      onClick={() => onClick(id)}
    >
      <CardContent className="p-0">
        <PromptCardContent
          name={name}
          content={content}
          categoryName={categoryName}
          categoryColor={categoryColor}
          archived={archived}
        />
        
        <PromptCardFooter
          id={id}
          updated_at={updated_at}
          is_favorite={is_favorite}
          archived={archived}
          onDelete={onDelete}
          onClick={onClick}
          onFavoriteToggle={handleFavoriteToggle}
          onArchiveToggle={handleArchiveToggle}
          onExport={onExport}
        />
      </CardContent>
    </Card>
  );
}
