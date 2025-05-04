
import { getDB } from '../core';

/**
 * Handle the deletion of a prompt and its associated versions
 */
export const handlePromptDeletion = async (id: string) => {
  const db = await getDB();
  
  try {
    // Get all versions for this prompt using the index
    const tx = db.transaction('versions', 'readonly');
    const index = tx.store.index('by-prompt');
    const versions = await index.getAll(id);
    await tx.done;
    
    // Use a transaction to ensure all operations complete or none do
    const deleteTx = db.transaction(['versions', 'prompts'], 'readwrite');
    
    // Delete all versions
    const versionsStore = deleteTx.objectStore('versions');
    for (const version of versions) {
      await versionsStore.delete(version.id);
    }
    
    // Delete the prompt itself
    const promptsStore = deleteTx.objectStore('prompts');
    await promptsStore.delete(id);
    
    return deleteTx.done;
  } catch (error) {
    console.error(`Error deleting prompt ${id}:`, error);
    throw error;
  }
};
