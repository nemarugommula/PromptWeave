
// Main entry point for database operations
// Re-exports all the functionality from the individual modules

// Core database functions
export { 
  initDB, 
  getDB, 
  isDatabaseAvailable, 
  getDatabaseError,
  resetDatabaseService
} from './db-init';

// Prompt operations
export { 
  savePrompt, 
  getPrompt, 
  getAllPrompts, 
  getRecentPrompts,
  countPrompts,
  getPromptsByCategory,
  getFavoritePrompts,
  getArchivedPrompts,
  togglePromptFavorite,
  togglePromptArchive,
  deletePrompt
} from './prompts';

// Category operations
export {
  saveCategory,
  getAllCategories,
  getCategory,
  deleteCategory
} from './categories';

// Version operations
export {
  saveVersion,
  getVersionsByPromptId
} from './versions';

// Settings operations
export {
  saveSetting,
  getSetting,
  deleteSetting
} from './settings';

// Export/Import operations
export {
  exportPrompts,
  importPrompts
} from './export-import';

// Export types for external use
export type { PromptSchema, CategorySchema, VersionSchema } from './schema';
