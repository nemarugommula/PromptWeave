
import React from "react";
import { BookmarkPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ViewMode } from "@/contexts/LayoutContext";

interface CategoriesTabProps {
  loading: boolean;
  categorizedPrompts: Record<string, any[]>;
  categories: any[];
  viewMode: ViewMode;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  onCreatePrompt: () => Promise<string | null>;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  loading,
  onCreatePrompt,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <EmptyState
      onCreatePrompt={onCreatePrompt}
      searchQuery=""
      icon={<BookmarkPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
      title="Categories are disabled"
      description="This feature has been removed from the application."
    />
  );
};
