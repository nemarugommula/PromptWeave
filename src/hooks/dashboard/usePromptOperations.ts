
import { toast } from "@/components/ui/use-toast";
import { 
  savePrompt, 
  deletePrompt, 
  togglePromptFavorite, 
  togglePromptArchive, 
  exportPrompts,
  getPrompt
} from "@/lib/db";
import { v4 as uuidv4 } from "@/lib/utils/uuid";

export const usePromptOperations = (onDataChanged: () => Promise<void>) => {
  // Handle create prompt
  const handleCreatePrompt = async (categoryId?: string) => {
    try {
      const newPrompt = {
        id: uuidv4(),
        name: "Untitled Prompt",
        content: "Write your system prompt here...",
        category_id: categoryId,
        is_archived: false,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      
      await savePrompt(newPrompt);
      toast({
        title: "Prompt Created",
        description: "Your new prompt has been created successfully.",
      });
      
      // Reload all data
      await onDataChanged();
      
      return newPrompt.id;
    } catch (error) {
      console.error("Failed to create prompt:", error);
      toast({
        title: "Error",
        description: "Could not create a new prompt.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Handle delete prompt
  const handleDeletePrompt = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deletePrompt(id);
      
      // Refresh all data
      await onDataChanged();
      
      toast({
        title: "Prompt Deleted",
        description: "Your prompt has been deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete prompt:", error);
      toast({
        title: "Error",
        description: "Could not delete the prompt.",
        variant: "destructive",
      });
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (id: string, isFavorite: boolean) => {
    try {
      await togglePromptFavorite(id, isFavorite);
      
      // Refresh data
      await onDataChanged();
      
      toast({
        title: isFavorite ? "Added to Favorites" : "Removed from Favorites",
        description: `Prompt ${isFavorite ? "added to" : "removed from"} your favorites.`,
      });
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      toast({
        title: "Error",
        description: "Could not update favorite status.",
        variant: "destructive",
      });
    }
  };

  // Handle archive toggle
  const handleArchiveToggle = async (id: string, isArchived: boolean) => {
    try {
      await togglePromptArchive(id, isArchived);
      
      // Refresh data
      await onDataChanged();
      
      toast({
        title: isArchived ? "Archived" : "Unarchived",
        description: `Prompt has been ${isArchived ? "archived" : "restored from archive"}.`,
      });
    } catch (error) {
      console.error("Failed to update archive status:", error);
      toast({
        title: "Error",
        description: "Could not update archive status.",
        variant: "destructive",
      });
    }
  };

  // Handle export prompt
  const handleExportPrompt = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const exportData = await exportPrompts([id]);
      
      // Create a downloadable file
      const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // Get the prompt name for the filename
      const prompt = await getPrompt(id);
      const filename = prompt ? `${prompt.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt` : 'prompt_export.txt';
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Your prompt has been exported to a text file.",
      });
    } catch (error) {
      console.error("Failed to export prompt:", error);
      toast({
        title: "Export Failed",
        description: "Could not export the prompt.",
        variant: "destructive",
      });
    }
  };

  // Handle export all prompts
  const handleExportAll = async () => {
    try {
      const exportData = await exportPrompts();
      
      // Create a downloadable file
      const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // Create a filename with the current date
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `promptweave_export_${date}.txt`;
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "All your prompts have been exported to a text file.",
      });
    } catch (error) {
      console.error("Failed to export prompts:", error);
      toast({
        title: "Export Failed",
        description: "Could not export prompts.",
        variant: "destructive",
      });
    }
  };

  return {
    handleCreatePrompt,
    handleDeletePrompt,
    handleFavoriteToggle,
    handleArchiveToggle,
    handleExportPrompt,
    handleExportAll
  };
};
