
import React from 'react';
import { PromptCard } from '@/components/dashboard/PromptCard';

interface PromptGridViewProps {
  prompts: any[];
  categoryMap: Record<string, any>;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
}

export const PromptGridView: React.FC<PromptGridViewProps> = ({
  prompts,
  categoryMap,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onArchiveToggle,
  onExportPrompt
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {prompts.map((prompt) => (
        <PromptCard 
          key={prompt.id}
          {...prompt}
          categoryName={prompt.category_id ? categoryMap[prompt.category_id]?.name : undefined}
          categoryColor={prompt.category_id ? categoryMap[prompt.category_id]?.color : undefined}
          onDelete={onDeletePrompt}
          onClick={onOpenPrompt}
          onFavoriteToggle={onFavoriteToggle}
          onArchiveToggle={onArchiveToggle}
          onExport={onExportPrompt}
        />
      ))}
    </div>
  );
};
