
import { IDBPDatabase } from 'idb';
import { PromptWeaveDB } from './schema';
import { DBManagerService } from './services/db-manager';

// Create the singleton instance
const dbManager = new DBManagerService();

/**
 * Initialize the database with the correct schema and default data
 */
export const initDB = async (): Promise<IDBPDatabase<PromptWeaveDB> | null> => {
  return dbManager.getDB();
};

/**
 * Get a reference to the database
 * @param retryCount Number of times to retry initialization
 */
export const getDB = async (retryCount = 3): Promise<IDBPDatabase<PromptWeaveDB>> => {
  const db = await dbManager.getDB(retryCount);
  if (!db) {
    throw new Error('Failed to get database connection');
  }
  return db;
};

/**
 * Check if the database is available
 */
export const isDatabaseAvailable = async (): Promise<boolean> => {
  return dbManager.isDatabaseHealthy();
};

/**
 * Get the current database error if any
 */
export const getDatabaseError = (): Error | null => {
  return dbManager.getError();
};

/**
 * Reset the database service state
 */
export const resetDatabaseService = (): void => {
  dbManager.reset();
};
