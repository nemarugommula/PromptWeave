
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "@/components/dashboard/PromptCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PromptListView } from "@/components/dashboard/views/PromptListView";
import { PromptGridView } from "@/components/dashboard/views/PromptGridView";
import { PromptFolderView } from "@/components/dashboard/views/PromptFolderView";
import { ViewMode } from "@/contexts/LayoutContext";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AllPromptsTabProps {
  loading: boolean;
  prompts: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
  viewMode: ViewMode;
  categoryMap: Record<string, any>;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  onPageChange: (page: number) => void;
  onCreatePrompt: () => Promise<string | null>;
}

export const AllPromptsTab: React.FC<AllPromptsTabProps> = ({
  loading,
  prompts,
  pagination,
  searchQuery,
  viewMode,
  categoryMap,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onArchiveToggle,
  onExportPrompt,
  onPageChange,
  onCreatePrompt,
}) => {
  // Generate pagination items
  const renderPaginationItems = () => {
    const { page, totalPages } = pagination;
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={page === 1} 
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages as they're added separately
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={page === i} 
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (page < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={page === totalPages} 
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <EmptyState
        onCreatePrompt={onCreatePrompt}
        searchQuery={searchQuery}
      />
    );
  }

  const renderPrompts = () => {
    switch (viewMode) {
      case 'list':
        return (
          <PromptListView
            prompts={prompts}
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
            prompts={prompts}
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
            prompts={prompts}
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
    <>
      {renderPrompts()}
      
      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <Pagination className="my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(pagination.page - 1)}
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(pagination.page + 1)}
                className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {((pagination.page - 1) * pagination.pageSize) + 1} - {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} prompts
      </div>
    </>
  );
};
