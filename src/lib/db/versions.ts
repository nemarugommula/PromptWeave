
import { getDB } from './core';
import { VersionSchema } from './schema';

export async function getVersion(id: string) {
  try {
    const db = await getDB();
    if (!db) {
      throw new Error('Failed to open database');
    }

    const version = await db.get('versions', id);
    return version || null;
  } catch (error) {
    console.error('Error getting version:', error);
    return null;
  }
}

export async function getVersionsByPromptId(prompt_id: string) {
  try {
    const db = await getDB();
    if (!db) {
      throw new Error('Failed to open database');
    }

    const index = db.transaction('versions').store.index('by-prompt');
    const versions = await index.getAll(prompt_id);

    return versions;
  } catch (error) {
    console.error('Error getting versions by prompt ID:', error);
    return [];
  }
}

// Fix the saveVersion function to match the correct schema
export async function saveVersion(version: Omit<VersionSchema, 'created_at'> & { created_at?: number }) {
  try {
    // Ensure created_at is set
    if (!version.created_at) {
      version.created_at = Date.now();
    }

    const db = await getDB();
    if (!db) {
      throw new Error('Failed to open database');
    }
    
    await db.put('versions', version);
    
    return { success: true };
  } catch (error) {
    console.error('Error saving version:', error);
    return { success: false, error };
  }
}

export async function deleteVersion(id: string) {
  try {
    const db = await getDB();
    if (!db) {
      throw new Error('Failed to open database');
    }

    await db.delete('versions', id);

    return { success: true };
  } catch (error) {
    console.error('Error deleting version:', error);
    return { success: false, error };
  }
}
