
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAllPrompts } from "@/lib/db";

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

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

export const usePromptsData = () => {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 1
  });

  // Load prompts with pagination
  const loadPrompts = async (page: number = 1, search: string = "") => {
    setLoading(true);
    try {
      const { prompts: fetchedPrompts, pagination } = await getAllPrompts({
        page,
        pageSize: 12,
        sortBy: 'updated_at',
        sortDirection: 'desc',
        search,
        archived: false // Exclude archived prompts by default
      });
      
      setPrompts(fetchedPrompts);
      setPagination(pagination);
    } catch (error) {
      console.error("Failed to load prompts:", error);
      toast({
        title: "Error",
        description: "Could not load your prompts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadPrompts(newPage);
    }
  };

  return {
    prompts,
    loading,
    pagination,
    loadPrompts,
    handlePageChange,
  };
};
