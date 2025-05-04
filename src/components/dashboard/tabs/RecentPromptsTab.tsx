
import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptGridView } from "@/components/dashboard/views/PromptGridView";
import { PromptListView } from "@/components/dashboard/views/PromptListView";
import { PromptFolderView } from "@/components/dashboard/views/PromptFolderView";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ViewMode } from "@/contexts/LayoutContext";

interface RecentPromptsTabProps {
  loading: boolean;
  recentPrompts: any[];
  viewMode: ViewMode;
  categoryMap: Record<string, any>;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  onCreatePrompt: () => Promise<string | null>;
}

export const RecentPromptsTab: React.FC<RecentPromptsTabProps> = ({
  loading,
  recentPrompts,
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

  if (recentPrompts.length === 0) {
    return (
      <EmptyState
        onCreatePrompt={onCreatePrompt}
        searchQuery=""
        icon={<Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
        title="No recent prompts found"
        description="Create or update some prompts to see them here."
      />
    );
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <PromptListView
            prompts={recentPrompts}
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
            prompts={recentPrompts}
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
            prompts={recentPrompts}
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

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> 
            Recently Updated
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};
