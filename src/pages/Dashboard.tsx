import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ImportDialog } from "@/components/dashboard/ImportDialog";
import { ExportConfirmDialog } from "@/components/dashboard/ExportConfirmDialog";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchField } from "@/components/dashboard/SearchField";
import { DashboardTabsContent } from "@/components/dashboard/DashboardTabsContent";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useSearch } from "@/hooks/dashboard/useSearch";
import { ViewToggle } from "@/components/dashboard/ViewToggle";
import { useLayout } from "@/contexts/LayoutContext";
import { Tabs, TabsList } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const { densityMode, viewMode } = useLayout();

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

  const openPromptEditor = useCallback((id: string) => {
    navigate(`/editor/${id}`);
  }, [navigate]);
  
  // Create a new handler that will create a prompt and navigate to it
  const handleCreateAndNavigate = useCallback(async (categoryId?: string) => {
    const newPromptId = await handleCreatePrompt(categoryId);
    if (newPromptId) {
      openPromptEditor(newPromptId);
    }
    return newPromptId;
  }, [handleCreatePrompt, openPromptEditor]);

  // Handle scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Monitor scroll position to show/hide the scroll-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoize container class based on density mode
  const containerClass = useMemo(() => {
    return densityMode === 'compact' 
      ? 'container mx-auto p-2 max-w-7xl' 
      : 'container mx-auto p-4 max-w-7xl';
  }, [densityMode]);

  return (
    <div className="h-full flex w-full"> 
      {/* Left side nav - Sidebar */}
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <motion.div 
        className="flex-grow h-full overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={containerClass}>
          {/* Dashboard header with fluid animation */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <DashboardHeader
              onCreatePrompt={handleCreateAndNavigate}
              onImportDialogOpen={() => setImportDialogOpen(true)}
              onExportAll={() => setShowExportDialog(true)}
            />
          </motion.div>
          
          {/* Quick action floating button for mobile */}
          <div className="fixed bottom-6 right-6 md:hidden z-30">
            <Button 
              onClick={() => handleCreateAndNavigate()} 
              size="lg" 
              className="rounded-full shadow-lg h-14 w-14 flex items-center justify-center"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Scroll to top button */}
          {showScrollTop && (
            <motion.div 
              className="fixed bottom-20 right-6 z-30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button 
                onClick={handleScrollToTop} 
                size="icon" 
                variant="outline"
                className="rounded-full shadow-md h-10 w-10"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
          
          <motion.div 
            className="my-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {/* Tabs and view controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center mb-6">
              <Tabs 
                defaultValue={activeTab} 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="w-full sm:w-auto overflow-x-auto">
                  <DashboardTabs />
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-4 justify-end">
                <ViewToggle />
                <div className="w-full sm:w-auto max-w-xs">
                  <SearchField 
                    value={searchQuery} 
                    onChange={handleSearchChange} 
                  />
                </div>
              </div>
            </div>

            {/* Content area with staggered animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
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
            </motion.div>
          </motion.div>
          
          {/* Import Dialog */}
          <ImportDialog 
            open={importDialogOpen} 
            onOpenChange={setImportDialogOpen} 
            onImportComplete={handleImportComplete} 
          />
          
          {/* Export Confirmation Dialog */}
          <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Export All Prompts</AlertDialogTitle>
                <AlertDialogDescription>
                  This will export all your prompts and categories to a text file that you can later import.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleExportAll}>Export</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
