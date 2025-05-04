import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImportDialog } from "@/components/dashboard/ImportDialog";
import { ExportConfirmDialog } from "@/components/dashboard/ExportConfirmDialog";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchField } from "@/components/dashboard/SearchField";
import { DashboardTabsContent } from "@/components/dashboard/DashboardTabsContent";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
// import { useDatabaseInitialization } from "@/hooks/dashboard/useDatabaseInitialization";
import { useSearch } from "@/hooks/dashboard/useSearch";
import { ViewToggle } from "@/components/dashboard/ViewToggle";
import { useLayout } from "@/contexts/LayoutContext";
import { Tabs, TabsList } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { densityMode, viewMode } = useLayout();

  // Database initialization is handled at app root
  
  // Dashboard data
  const {
    categories,
    prompts,
    recentPrompts,
    favoritePrompts,
    archivedPrompts,
    categorizedPrompts,
    pagination,
    loading,
    loadCategories,
    handleCreatePrompt,
    handleDeletePrompt,
    handleFavoriteToggle,
    handleArchiveToggle,
    handleExportPrompt,
    handleExportAll,
    handleImportComplete,
    handlePageChange,
    loadPrompts,
    categoryMap
  } = useDashboardData();

  // Search functionality
  const { searchQuery, handleSearchChange } = useSearch((query) => {
    loadPrompts(1, query);
  });

  const openPromptEditor = (id: string) => {
    navigate(`/editor/${id}`);
  };
  
  // Create a new handler that will create a prompt and navigate to it
  const handleCreateAndNavigate = async (categoryId?: string) => {
    const newPromptId = await handleCreatePrompt(categoryId);
    if (newPromptId) {
      openPromptEditor(newPromptId);
    }
    return newPromptId;
  };

  const containerClass = densityMode === 'compact' 
    ? 'container mx-auto p-2 max-w-7xl' 
    : 'container mx-auto p-4 max-w-7xl';

  return (
    <div className="h-full flex w-full"> 
      {/* Left side nav - Sidebar */}
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-grow h-full overflow-y-auto">
        <div className={containerClass}>
          <DashboardHeader
            onCreatePrompt={handleCreateAndNavigate}
            onImportDialogOpen={() => setImportDialogOpen(true)}
            onExportAll={handleExportAll}
          />
          
          <div className="my-4">
            <div className="flex flex-row justify-between items-center mb-8">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <DashboardTabs />
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-4">
                <ViewToggle />
                <SearchField value={searchQuery} onChange={handleSearchChange} />
              </div>
            </div>

            <DashboardTabsContent
              activeTab={activeTab}
              loading={loading}
              prompts={prompts}
              recentPrompts={recentPrompts}
              favoritePrompts={favoritePrompts}
              archivedPrompts={archivedPrompts}
              categorizedPrompts={categorizedPrompts}
              categories={categories}
              pagination={pagination}
              searchQuery={searchQuery}
              categoryMap={categoryMap}
              viewMode={viewMode}
              onDeletePrompt={handleDeletePrompt}
              onOpenPrompt={openPromptEditor}
              onFavoriteToggle={handleFavoriteToggle}
              onArchiveToggle={handleArchiveToggle}
              onExportPrompt={handleExportPrompt}
              onPageChange={handlePageChange}
              onCreatePrompt={handleCreateAndNavigate}
            />
          </div>
          
          {/* Import Dialog */}
          <ImportDialog 
            open={importDialogOpen} 
            onOpenChange={setImportDialogOpen} 
            onImportComplete={handleImportComplete} 
          />
          
          {/* Export Confirmation Dialog */}
          <ExportConfirmDialog onExport={handleExportAll} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
