
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getAllCategories } from "@/lib/db";
import { Category } from "@/components/dashboard/CategorySelector";

export const useCategoriesData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, Category>>({});

  // Load categories
  const loadCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);

      // Create a mapping of categoryId to category for easier lookup
      const map = fetchedCategories.reduce((map, category) => {
        map[category.id] = category;
        return map;
      }, {} as Record<string, Category>);
      
      setCategoryMap(map);
      
      return fetchedCategories;
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast({
        title: "Error",
        description: "Could not load categories.",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    categories,
    categoryMap,
    loadCategories,
  };
};
