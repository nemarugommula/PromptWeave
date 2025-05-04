
// Re-export all prompt-related functionality from the individual files
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
} from './prompt-operations';
