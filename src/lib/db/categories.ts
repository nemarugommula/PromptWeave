
import { getDB } from './core';
import { CategorySchema } from './schema';

/**
 * Save a category to the database
 */
export const saveCategory = async (category: CategorySchema) => {
  const db = await getDB();
  const now = Date.now();
  const categoryToSave = {
    ...category,
    created_at: category.created_at || now,
  };
  return db.put('categories', categoryToSave);
};

/**
 * Get all categories
 */
export const getAllCategories = async () => {
  const db = await getDB();
  return db.getAll('categories');
};

/**
 * Get a category by ID
 */
export const getCategory = async (id: string) => {
  const db = await getDB();
  return db.get('categories', id);
};

/**
 * Delete a category and update prompts that use it
 */
export const deleteCategory = async (id: string) => {
  const db = await getDB();
  
  // Get prompts using this category
  const index = db.transaction('prompts').store.index('by-category');
  const promptsWithCategory = await index.getAll(id);
  
  // Use a transaction to ensure all operations complete or none do
  const tx = db.transaction(['prompts', 'categories'], 'readwrite');
  
  // Remove category from prompts
  const promptsStore = tx.objectStore('prompts');
  for (const prompt of promptsWithCategory) {
    prompt.category_id = undefined;
    await promptsStore.put(prompt);
  }
  
  // Delete the category
  await tx.objectStore('categories').delete(id);
  return tx.done;
};
