
import React from "react";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptGridView } from "@/components/dashboard/views/PromptGridView";
import { PromptListView } from "@/components/dashboard/views/PromptListView";
import { PromptFolderView } from "@/components/dashboard/views/PromptFolderView";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ViewMode } from "@/contexts/LayoutContext";

interface FavoritesTabProps {
  loading: boolean;
  favoritePrompts: any[];
  viewMode: ViewMode;
  categoryMap: Record<string, any>;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  onCreatePrompt: () => Promise<string | null>;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  loading,
  favoritePrompts,
  viewMode,
  categoryMap,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onArchiveToggle,
  onExportPrompt,
  onCreatePrompt,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (favoritePrompts.length === 0) {
    return (
      <EmptyState
        onCreatePrompt={onCreatePrompt}
        searchQuery=""
        icon={<Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
        title="No favorite prompts yet"
        description="Mark prompts as favorites to see them here."
      />
    );
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <PromptListView
            prompts={favoritePrompts}
            categoryMap={categoryMap}
            onDeletePrompt={onDeletePrompt}
            onOpenPrompt={onOpenPrompt}
            onFavoriteToggle={onFavoriteToggle}
            onArchiveToggle={onArchiveToggle}
            onExportPrompt={onExportPrompt}
          />
        );
      case 'folder':
        return (
          <PromptFolderView
            prompts={favoritePrompts}
            categories={Object.values(categoryMap)}
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
            prompts={favoritePrompts}
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

  return renderContent();
};
