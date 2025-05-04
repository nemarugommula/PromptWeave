
import { useState } from "react";
import { getRecentPrompts, getFavoritePrompts, getArchivedPrompts } from "@/lib/db";

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

export const useSpecialPromptsData = () => {
  const [recentPrompts, setRecentPrompts] = useState<PromptItem[]>([]);
  const [favoritePrompts, setFavoritePrompts] = useState<PromptItem[]>([]);
  const [archivedPrompts, setArchivedPrompts] = useState<PromptItem[]>([]);

  // Load recent prompts
  const loadRecentPrompts = async () => {
    try {
      const recent = await getRecentPrompts({ count: 6 });
      setRecentPrompts(recent);
    } catch (error) {
      console.error("Failed to load recent prompts:", error);
    }
  };

  // Load favorite prompts
  const loadFavoritePrompts = async () => {
    try {
      const favorites = await getFavoritePrompts();
      setFavoritePrompts(favorites);
    } catch (error) {
      console.error("Failed to load favorite prompts:", error);
    }
  };

  // Load archived prompts
  const loadArchivedPrompts = async () => {
    try {
      const archived = await getArchivedPrompts();
      setArchivedPrompts(archived);
    } catch (error) {
      console.error("Failed to load archived prompts:", error);
    }
  };

  return {
    recentPrompts,
    favoritePrompts,
    archivedPrompts,
    loadRecentPrompts,
    loadFavoritePrompts,
    loadArchivedPrompts,
  };
};
