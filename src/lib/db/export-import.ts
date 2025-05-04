import { getDB } from './core';
import { getPrompt, savePrompt } from './prompts';
import { getCategory, saveCategory } from './categories';

/**
 * Export prompts as a JSON string
 */
export const exportPrompts = async (promptIds?: string[]) => {
  const db = await getDB();
  
  let promptsToExport;
  if (promptIds && promptIds.length > 0) {
    // Export only specific prompts
    promptsToExport = await Promise.all(
      promptIds.map(id => getPrompt(id))
    );
    // Filter out any undefined results (prompts not found)
    promptsToExport = promptsToExport.filter(p => p !== undefined);
  } else {
    // Export all prompts
    promptsToExport = await db.getAll('prompts');
  }
  
  // Get all categories for these prompts
  const uniqueCategoryIds = new Set<string>();
  promptsToExport.forEach(prompt => {
    if (prompt.category_id) {
      uniqueCategoryIds.add(prompt.category_id);
    }
  });
  
  const categoryIds = Array.from(uniqueCategoryIds);
  const categories = await Promise.all(
    categoryIds.map(id => getCategory(id))
  );
  
  // Create the export object
  const exportData = {
    prompts: promptsToExport,
    categories: categories.filter(c => c !== undefined), // Filter out any undefined results
    version: 1, // Export format version
    exportedAt: new Date().toISOString()
  };
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Import prompts from a JSON string
 */
export const importPrompts = async (jsonData: string): Promise<{ prompts: number, categories: number, errors: string[] }> => {
  const result = { prompts: 0, categories: 0, errors: [] as string[] };
  
  try {
    const data = JSON.parse(jsonData);
    
    // Validate the data format
    if (!data.prompts || !Array.isArray(data.prompts)) {
      result.errors.push('Invalid import format: prompts array is missing');
      return result;
    }
    
    // Import categories first to maintain relationships
    if (data.categories && Array.isArray(data.categories)) {
      for (const category of data.categories) {
        // Basic validation
        if (!category.id || !category.name || !category.color) {
          result.errors.push(`Skipped invalid category: ${category.name || 'Unknown'}`);
          continue;
        }
        
        try {
          // Check if category already exists
          const existingCategory = await getCategory(category.id);
          if (!existingCategory) {
            await saveCategory(category);
            result.categories++;
          }
        } catch (error) {
          result.errors.push(`Failed to import category ${category.name}: ${error}`);
        }
      }
    }
    
    // Import prompts
    for (const prompt of data.prompts) {
      // Basic validation
      if (!prompt.id || !prompt.name || !prompt.content) {
        result.errors.push(`Skipped invalid prompt: ${prompt.name || 'Unknown'}`);
        continue;
      }
      
      try {
        // Check if prompt already exists
        const existingPrompt = await getPrompt(prompt.id);
        if (!existingPrompt) {
          // For new prompts, keep the original ID but update timestamps
          await savePrompt({
            ...prompt,
            created_at: Date.now(),
            updated_at: Date.now()
          });
        } else {
          // For existing prompts, confirm before overwriting or skip
          // In this implementation we'll create a new prompt with a modified name
          const newPrompt = {
            ...prompt,
            id: prompt.id + '-' + Date.now().toString().slice(-4), // Append timestamp to make unique ID
            name: prompt.name + ' (Imported)',
            created_at: Date.now(),
            updated_at: Date.now()
          };
          await savePrompt(newPrompt);
        }
        result.prompts++;
      } catch (error) {
        result.errors.push(`Failed to import prompt ${prompt.name}: ${error}`);
      }
    }
    
    return result;
  } catch (error) {
    result.errors.push(`Import failed: ${error}`);
    return result;
  }
};
