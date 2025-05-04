
import React from "react";
import { Archive } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptGridView } from "@/components/dashboard/views/PromptGridView";
import { PromptListView } from "@/components/dashboard/views/PromptListView";
import { PromptFolderView } from "@/components/dashboard/views/PromptFolderView";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ViewMode } from "@/contexts/LayoutContext";

interface ArchivesTabProps {
  loading: boolean;
  archivedPrompts: any[];
  viewMode: ViewMode;
  categoryMap: Record<string, any>;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string, isArchived: boolean) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  onCreatePrompt: () => Promise<string | null>;
}

export const ArchivesTab: React.FC<ArchivesTabProps> = ({
  loading,
  archivedPrompts,
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

  if (archivedPrompts.length === 0) {
    return (
      <EmptyState
        onCreatePrompt={onCreatePrompt}
        searchQuery=""
        icon={<Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
        title="No archived prompts"
        description="Archived prompts will appear here."
      />
    );
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <PromptListView
            prompts={archivedPrompts.map(p => ({ ...p, is_archived: true }))}
            categoryMap={categoryMap}
            onDeletePrompt={onDeletePrompt}
            onOpenPrompt={onOpenPrompt}
            onFavoriteToggle={onFavoriteToggle}
            onArchiveToggle={(id) => onArchiveToggle(id, false)}
            onExportPrompt={onExportPrompt}
          />
        );
      case 'folder':
        return (
          <PromptFolderView
            prompts={archivedPrompts.map(p => ({ ...p, is_archived: true }))}
            categories={Object.values(categoryMap)}
            onDeletePrompt={onDeletePrompt}
            onOpenPrompt={onOpenPrompt}
            onFavoriteToggle={onFavoriteToggle}
            onArchiveToggle={(id) => onArchiveToggle(id, false)}
            onExportPrompt={onExportPrompt}
          />
        );
      case 'grid':
      default:
        return (
          <PromptGridView
            prompts={archivedPrompts.map(p => ({ ...p, is_archived: true }))}
            categoryMap={categoryMap}
            onDeletePrompt={onDeletePrompt}
            onOpenPrompt={onOpenPrompt}
            onFavoriteToggle={onFavoriteToggle}
            onArchiveToggle={(id) => onArchiveToggle(id, false)}
            onExportPrompt={onExportPrompt}
          />
        );
    }
  };

  return renderContent();
};
