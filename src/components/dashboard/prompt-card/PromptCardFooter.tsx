
import React from 'react';
import { PromptCardDate } from './PromptCardDate';
import { PromptCardActions } from './PromptCardActions';

interface PromptCardFooterProps {
  id: string;
  updated_at: number;
  is_favorite?: boolean;
  archived?: boolean;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onArchiveToggle?: (id: string) => void;
  onExport?: (id: string, e: React.MouseEvent) => void;
}

export function PromptCardFooter({
  id,
  updated_at,
  is_favorite,
  archived,
  onDelete,
  onClick,
  onFavoriteToggle,
  onArchiveToggle,
  onExport
}: PromptCardFooterProps) {
  return (
    <div className="bg-muted/50 p-4 flex justify-between items-center">
      <PromptCardDate timestamp={updated_at} />
      
      <PromptCardActions 
        id={id}
        is_favorite={is_favorite}
        archived={archived}
        onDelete={onDelete}
        onClick={onClick}
        onFavoriteToggle={onFavoriteToggle}
        onArchiveToggle={onArchiveToggle}
        onExport={onExport}
      />
    </div>
  );
}
