
// Re-export all database functionality from their respective modules
export { 
  initDB, 
  getDB, 
  isDatabaseAvailable, 
  getDatabaseError,
  resetDatabaseService
} from './db-init';
