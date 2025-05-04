
import { getDB } from '../core';
import { PromptSchema } from '../schema';
import { getPromptsByFilter } from './prompt-filters';
import { handlePromptDeletion } from './prompt-deletion';

/**
 * Save a prompt to the database
 */
export const savePrompt = async (prompt: PromptSchema) => {
  const db = await getDB();
  const now = Date.now();
  const promptToSave = {
    ...prompt,
    created_at: prompt.created_at || now,
    updated_at: now,
    is_archived: prompt.is_archived || false,
  };
  return db.put('prompts', promptToSave);
};

/**
 * Retrieve a prompt by ID
 */
export const getPrompt = async (id: string) => {
  const db = await getDB();
  return db.get('prompts', id);
};

/**
 * Get prompts with pagination, sorting and filtering
 */
export const getAllPrompts = async (
  options: {
    page?: number;
    pageSize?: number;
    sortBy?: 'updated_at' | 'created_at' | 'name';
    sortDirection?: 'asc' | 'desc';
    search?: string;
    categoryId?: string;
    favorites?: boolean;
    archived?: boolean;
  } = {}
) => {
  const db = await getDB();
  const {
    page = 1,
    pageSize = 12,
    sortBy = 'updated_at',
    sortDirection = 'desc',
    search = '',
    categoryId,
    favorites,
    archived = false,
  } = options;

  let allPrompts = await db.getAll('prompts');
  
  // Filter by archived status first
  allPrompts = allPrompts.filter(prompt => 
    archived ? prompt.is_archived === true : prompt.is_archived !== true
  );
  
  // Filter by category if specified
  if (categoryId) {
    allPrompts = allPrompts.filter(prompt => prompt.category_id === categoryId);
  }
  
  // Filter by favorites if specified
  if (favorites) {
    allPrompts = allPrompts.filter(prompt => prompt.is_favorite);
  }
  
  // Sort the prompts
  allPrompts = allPrompts.sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else {
      const aValue = a[sortBy as keyof typeof a] as number;
      const bValue = b[sortBy as keyof typeof b] as number;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });

  // Filter by search term if provided
  if (search) {
    const searchLower = search.toLowerCase();
    allPrompts = allPrompts.filter(prompt => 
      prompt.name.toLowerCase().includes(searchLower) || 
      prompt.content.toLowerCase().includes(searchLower)
    );
  }

  // Get total count
  const total = allPrompts.length;
  
  // Apply pagination
  const start = (page - 1) * pageSize;
  const paginatedPrompts = allPrompts.slice(start, start + pageSize);

  return {
    prompts: paginatedPrompts,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

/**
 * Get recent prompts
 */
export const getRecentPrompts = async (options: { hours?: number; count?: number; includeArchived?: boolean } = {}) => {
  const { hours = 24, count = 5, includeArchived = false } = options;
  return getPromptsByFilter({ 
    filterType: 'recent', 
    hours, 
    count, 
    includeArchived 
  });
};

/**
 * Count all prompts
 */
export const countPrompts = async (options: { includeArchived?: boolean } = {}) => {
  const { includeArchived = false } = options;
  const db = await getDB();
  const prompts = await db.getAll('prompts');
  if (!includeArchived) {
    return prompts.filter(p => !p.is_archived).length;
  }
  return prompts.length;
};

/**
 * Get prompts by category
 */
export const getPromptsByCategory = async (categoryId: string, includeArchived = false) => {
  return getPromptsByFilter({ 
    filterType: 'category', 
    categoryId, 
    includeArchived 
  });
};

/**
 * Get favorite prompts
 */
export const getFavoritePrompts = async (includeArchived = false) => {
  return getPromptsByFilter({ 
    filterType: 'favorite', 
    includeArchived 
  });
};

/**
 * Get archived prompts
 */
export const getArchivedPrompts = async () => {
  return getPromptsByFilter({ filterType: 'archived' });
};

/**
 * Toggle a prompt's favorite status
 */
export const togglePromptFavorite = async (id: string, isFavorite: boolean) => {
  const db = await getDB();
  const prompt = await db.get('prompts', id);
  if (prompt) {
    prompt.is_favorite = isFavorite;
    prompt.updated_at = Date.now();
    return db.put('prompts', prompt);
  }
  return null;
};

/**
 * Toggle a prompt's archive status
 */
export const togglePromptArchive = async (id: string, isArchived: boolean) => {
  const db = await getDB();
  const prompt = await db.get('prompts', id);
  if (prompt) {
    prompt.is_archived = isArchived;
    prompt.updated_at = Date.now();
    return db.put('prompts', prompt);
  }
  return null;
};

/**
 * Delete a prompt and its associated versions
 */
export const deletePrompt = async (id: string) => {
  return handlePromptDeletion(id);
};
