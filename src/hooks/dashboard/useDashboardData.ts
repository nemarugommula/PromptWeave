
import { useState, useEffect } from "react";
import { isDatabaseAvailable } from "@/lib/db";
import { usePromptsData } from "./usePromptsData";
import { useCategoriesData } from "./useCategoriesData";
import { useSpecialPromptsData } from "./useSpecialPromptsData";
import { useCategorizedPromptsData } from "./useCategorizedPromptsData";
import { usePromptOperations } from "./usePromptOperations";

export const useDashboardData = () => {
  const [dbAvailable, setDbAvailable] = useState<boolean | null>(null);
  
  // Import functionality from smaller hooks
  const { 
    prompts, 
    loading, 
    pagination, 
    loadPrompts, 
    handlePageChange 
  } = usePromptsData();
  
  const { 
    categories, 
    categoryMap, 
    loadCategories 
  } = useCategoriesData();
  
  const { 
    recentPrompts, 
    favoritePrompts, 
    archivedPrompts, 
    loadRecentPrompts, 
    loadFavoritePrompts, 
    loadArchivedPrompts 
  } = useSpecialPromptsData();
  
  const { 
    categorizedPrompts, 
    loadCategorizedPrompts 
  } = useCategorizedPromptsData();

  // Function to reload all data
  const reloadAllData = async () => {
    const fetchedCategories = await loadCategories();
    await Promise.all([
      loadPrompts(pagination.page),
      loadRecentPrompts(),
      loadFavoritePrompts(),
      loadArchivedPrompts(),
      loadCategorizedPrompts(fetchedCategories)
    ]);
  };
  
  // Get prompt operations with the reload function
  const { 
    handleCreatePrompt, 
    handleDeletePrompt, 
    handleFavoriteToggle, 
    handleArchiveToggle, 
    handleExportPrompt, 
    handleExportAll 
  } = usePromptOperations(reloadAllData);

  // Check database availability
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const isAvailable = await isDatabaseAvailable();
        setDbAvailable(isAvailable);
        if (!isAvailable) {
          console.error("Database is not available");
        }
      } catch (error) {
        console.error("Error checking database availability:", error);
        setDbAvailable(false);
      }
    };
    
    checkDatabase();
  }, []);

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      if (dbAvailable === null) return; // Wait for DB check
      if (dbAvailable === false) {
        return; // Don't try to load data if DB isn't available
      }
      
      await reloadAllData();
    };
    
    initializeData();
  }, [dbAvailable]);

  // Handle import completion
  const handleImportComplete = async () => {
    // Refresh all data, reset to first page
    await loadPrompts(1);
    await reloadAllData();
  };

  return {
    prompts,
    recentPrompts,
    favoritePrompts,
    archivedPrompts,
    categories,
    categorizedPrompts,
    loading,
    pagination,
    categoryMap,
    dbAvailable,
    loadCategories,
    loadPrompts,
    handleCreatePrompt,
    handleDeletePrompt,
    handleFavoriteToggle,
    handleArchiveToggle,
    handleExportPrompt,
    handleExportAll,
    handleImportComplete,
    handlePageChange
  };
};
