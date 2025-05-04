
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AllPromptsTab } from './tabs/AllPromptsTab';
import { RecentPromptsTab } from './tabs/RecentPromptsTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { FavoritesTab } from './tabs/FavoritesTab';
import { ArchivesTab } from './tabs/ArchivesTab';
import { Category } from './CategorySelector';
import { ViewMode } from '@/contexts/LayoutContext';

interface PromptItem {
  id: string;
  name: string;
  content: string;
  category_id?: string;
  is_favorite?: boolean;
  is_archived?: boolean;
  created_at: number;
  updated_at: number;
}

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DashboardTabsContentProps {
  activeTab: string;
  loading: boolean;
  prompts: PromptItem[];
  recentPrompts: PromptItem[];
  favoritePrompts: PromptItem[];
  archivedPrompts: PromptItem[];
  categorizedPrompts: Record<string, PromptItem[]>;
  categories: Category[];
  pagination: PaginationData;
  searchQuery: string;
  categoryMap: Record<string, Category>;
  viewMode: ViewMode;
  onDeletePrompt: (id: string, e: React.MouseEvent) => void;
  onOpenPrompt: (id: string) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onArchiveToggle: (id: string, isArchived?: boolean) => void;
  onExportPrompt: (id: string, e: React.MouseEvent) => void;
  onPageChange: (page: number) => void;
  onCreatePrompt: () => Promise<string | null>;
}

export const DashboardTabsContent: React.FC<DashboardTabsContentProps> = ({
  activeTab,
  loading,
  prompts,
  recentPrompts,
  favoritePrompts,
  archivedPrompts,
  categorizedPrompts,
  categories,
  pagination,
  searchQuery,
  categoryMap,
  viewMode,
  onDeletePrompt,
  onOpenPrompt,
  onFavoriteToggle,
  onArchiveToggle,
  onExportPrompt,
  onPageChange,
  onCreatePrompt
}) => {
  // Ensure all arrays are defined to prevent iteration errors
  const safePrompts = prompts || [];
  const safeRecentPrompts = recentPrompts || [];
  const safeFavoritePrompts = favoritePrompts || [];
  const safeArchivedPrompts = archivedPrompts || [];
  const safeCategorizedPrompts = categorizedPrompts || {};
  const safeCategories = categories || [];

  return (
    <Tabs value={activeTab} defaultValue={activeTab}>
      {/* All Prompts Tab */}
      <TabsContent value="all">
        <AllPromptsTab
          loading={loading}
          prompts={safePrompts}
          pagination={pagination}
          searchQuery={searchQuery}
          viewMode={viewMode}
          categoryMap={categoryMap || {}}
          onDeletePrompt={onDeletePrompt}
          onOpenPrompt={onOpenPrompt}
          onFavoriteToggle={onFavoriteToggle}
          onArchiveToggle={(id) => onArchiveToggle(id, true)}
          onExportPrompt={onExportPrompt}
          onPageChange={onPageChange}
          onCreatePrompt={onCreatePrompt}
        />
      </TabsContent>
      
      {/* Recent Tab */}
      <TabsContent value="recent">
        <RecentPromptsTab
          loading={loading}
          recentPrompts={safeRecentPrompts}
          viewMode={viewMode}
          categoryMap={categoryMap || {}}
          onDeletePrompt={onDeletePrompt}
          onOpenPrompt={onOpenPrompt}
          onFavoriteToggle={onFavoriteToggle}
          onArchiveToggle={(id) => onArchiveToggle(id, true)}
          onExportPrompt={onExportPrompt}
          onCreatePrompt={onCreatePrompt}
        />
      </TabsContent>
      
      {/* Categories Tab */}
      <TabsContent value="categories">
        <CategoriesTab
          loading={loading}
          categorizedPrompts={safeCategorizedPrompts}
          categories={safeCategories}
          viewMode={viewMode}
          onDeletePrompt={onDeletePrompt}
          onOpenPrompt={onOpenPrompt}
          onFavoriteToggle={onFavoriteToggle}
          onArchiveToggle={(id) => onArchiveToggle(id, true)}
          onExportPrompt={onExportPrompt}
          onCreatePrompt={onCreatePrompt}
        />
      </TabsContent>
      
      {/* Favorites Tab */}
      <TabsContent value="favorites">
        <FavoritesTab
          loading={loading}
          favoritePrompts={safeFavoritePrompts}
          viewMode={viewMode}
          categoryMap={categoryMap || {}}
          onDeletePrompt={onDeletePrompt}
          onOpenPrompt={onOpenPrompt}
          onFavoriteToggle={onFavoriteToggle}
          onArchiveToggle={(id) => onArchiveToggle(id, true)}
          onExportPrompt={onExportPrompt}
          onCreatePrompt={onCreatePrompt}
        />
      </TabsContent>
      
      {/* Archives Tab */}
      <TabsContent value="archives">
        <ArchivesTab
          loading={loading}
          archivedPrompts={safeArchivedPrompts}
          viewMode={viewMode}
          categoryMap={categoryMap || {}}
          onDeletePrompt={onDeletePrompt}
          onOpenPrompt={onOpenPrompt}
          onFavoriteToggle={onFavoriteToggle}
          onArchiveToggle={(id) => onArchiveToggle(id, false)}
          onExportPrompt={onExportPrompt}
          onCreatePrompt={onCreatePrompt}
        />
      </TabsContent>
    </Tabs>
  );
};
