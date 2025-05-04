
import { IDBPDatabase } from 'idb';
import { PromptWeaveDB } from '../schema';
import { DBInstanceService } from './db-instance';
import { DBInitializerService } from './db-initializer';

/**
 * Provides methods to access and manage the database
 */
export class DBManagerService {
  private dbInstance: DBInstanceService;
  private dbInitializer: DBInitializerService;

  constructor() {
    this.dbInstance = DBInstanceService.getInstance();
    this.dbInitializer = new DBInitializerService();
  }

  public async getDB(retryCount = 3): Promise<IDBPDatabase<PromptWeaveDB> | null> {
    // If we already have a database instance, return it
    if (this.dbInstance.getDatabase()) {
      return this.dbInstance.getDatabase();
    }
    
    // If we've used up all retries, give up
    if (retryCount <= 0) {
      this.dbInstance.setError(new Error("Failed to get database after retries"));
      return null;
    }
    
    try {
      console.log(`Attempting to initialize database (retries left: ${retryCount})`);
      
      // Try to initialize the database
      const db = await this.dbInitializer.initDB();
      
      if (db) {
        console.log("Database initialized successfully");
        return db;
      }
      
      // If we get here, initialization is in progress or failed
      console.log("Database not ready yet, waiting before retry...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recursive call with one less retry
      return this.getDB(retryCount - 1);
    } catch (error) {
      console.error("Database initialization error:", error);
      this.dbInstance.setError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  public isDatabaseHealthy(): boolean {
    return this.dbInstance.isDatabaseHealthy();
  }

  public getError(): Error | null {
    return this.dbInstance.getError();
  }

  public reset(): void {
    console.log("Resetting database manager state");
    this.dbInstance.reset();
  }
}
