import { getDB } from '../core';
import { PromptSchema } from '../schema';

type FilterType = 'recent' | 'favorite' | 'archived' | 'category';

interface FilterOptions {
  filterType: FilterType;
  hours?: number;
  count?: number;
  categoryId?: string;
  includeArchived?: boolean;
}

/**
 * Get prompts based on different filter criteria
 */
export const getPromptsByFilter = async (options: FilterOptions): Promise<PromptSchema[]> => {
  const { filterType, hours, count, categoryId, includeArchived = false } = options;
  const db = await getDB();
  
  try {
    // Get all prompts
    const allPrompts = await db.getAll('prompts');
    
    // Apply filters based on filterType
    switch (filterType) {
      case 'recent': {
        // Sort by updated_at
        const sortedPrompts = allPrompts.sort((a, b) => b.updated_at - a.updated_at);
        
        // Filter out archived prompts unless specifically requested
        const filteredPrompts = includeArchived 
          ? sortedPrompts 
          : sortedPrompts.filter(prompt => !prompt.is_archived);
        
        if (hours) {
          // Filter prompts updated in the last X hours
          const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
          return filteredPrompts
            .filter(prompt => prompt.updated_at >= cutoffTime)
            .slice(0, count || filteredPrompts.length);
        }
        
        // Otherwise just return the most recent prompts by count
        return filteredPrompts.slice(0, count || filteredPrompts.length);
      }
      
      case 'favorite': {
        const favoritePrompts = allPrompts.filter(prompt => prompt.is_favorite);
        return includeArchived 
          ? favoritePrompts 
          : favoritePrompts.filter(p => !p.is_archived);
      }
      
      case 'archived': {
        return allPrompts.filter(prompt => prompt.is_archived === true);
      }
      
      case 'category': {
        if (!categoryId) return [];
        
        // Filter by category
        const filteredPrompts = allPrompts.filter(p => p.category_id === categoryId);
        
        // Further filter by archive status if needed
        return includeArchived ? filteredPrompts : filteredPrompts.filter(p => !p.is_archived);
      }
      
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error filtering prompts (${filterType}):`, error);
    return [];
  }
};
