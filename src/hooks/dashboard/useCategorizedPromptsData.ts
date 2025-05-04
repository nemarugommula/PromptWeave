
import { useState } from "react";
import { getAllPrompts, getPromptsByCategory } from "@/lib/db";
import { Category } from "@/components/dashboard/CategorySelector";

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

export const useCategorizedPromptsData = () => {
  const [categorizedPrompts, setCategorizedPrompts] = useState<Record<string, PromptItem[]>>({});

  // Load categorized prompts
  const loadCategorizedPrompts = async (categories: Category[]) => {
    try {
      const categorizedData: Record<string, PromptItem[]> = {};
      
      // Add uncategorized prompts
      const allPrompts = await getAllPrompts({
        archived: false // Explicitly exclude archived prompts
      });
      const uncategorizedPrompts = allPrompts.prompts.filter(p => !p.category_id);
      if (uncategorizedPrompts.length > 0) {
        categorizedData["uncategorized"] = uncategorizedPrompts;
      }
      
      // Add prompts for each category
      for (const category of categories) {
        const promptsInCategory = await getPromptsByCategory(category.id);
        // Filter out archived prompts
        const nonArchivedPrompts = promptsInCategory.filter(p => !p.is_archived);
        if (nonArchivedPrompts.length > 0) {
          categorizedData[category.id] = nonArchivedPrompts;
        }
      }
      
      setCategorizedPrompts(categorizedData);
    } catch (error) {
      console.error("Failed to load categorized prompts:", error);
    }
  };

  return {
    categorizedPrompts,
    loadCategorizedPrompts,
  };
};
