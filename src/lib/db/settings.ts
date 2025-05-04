
import { getDB } from './core';
import { encrypt as encryptValue, decrypt } from '../crypto';

/**
 * Save a setting with optional encryption
 */
export const saveSetting = async (key: string, value: string, shouldEncrypt = false): Promise<void> => {
  const db = await getDB();
  const valueToStore = shouldEncrypt ? await encryptValue(value) : value;
  await db.put('settings', { id: key, key, value: valueToStore });
};

/**
 * Get a setting, decrypting if necessary
 */
export const getSetting = async (key: string, isEncrypted = false): Promise<string | null> => {
  const db = await getDB();
  try {
    const setting = await db.get('settings', key);
    if (!setting) return null;
    
    return isEncrypted ? await decrypt(setting.value) : setting.value;
  } catch (error) {
    console.error(`Error retrieving setting: ${key}`, error);
    return null;
  }
};

/**
 * Delete a setting
 */
export const deleteSetting = async (key: string): Promise<void> => {
  const db = await getDB();
  await db.delete('settings', key);
};
