
import { openDB as openIDB, IDBPDatabase } from 'idb';
import { PromptWeaveDB, schema } from '../schema';
import { DBInstanceService } from './db-instance';

/**
 * Handles database initialization and schema setup
 */
export class DBInitializerService {
  private dbName = 'promptweave-db';
  // Updating version to 2 to match existing database
  private dbVersion = 2;
  private dbInstance: DBInstanceService;

  constructor() {
    this.dbInstance = DBInstanceService.getInstance();
  }

  public async initDB(): Promise<IDBPDatabase<PromptWeaveDB> | null> {
    // If we already have a DB instance or initialization is in progress, handle accordingly
    if (this.dbInstance.getDatabase()) return this.dbInstance.getDatabase();
    if (this.dbInstance.isInitializingDb()) return null;

    this.dbInstance.setInitializing(true);
    this.dbInstance.setError(null);

    try {
      const db = await this.openDatabase();
      this.dbInstance.setDatabase(db);
      this.dbInstance.setInitializing(false);
      console.log("Database initialized successfully");
      return db;
    } catch (error) {
      console.error("Error initializing database:", error);
      const typedError = error instanceof Error ? error : new Error(String(error));
      this.dbInstance.setError(typedError);
      this.dbInstance.setInitializing(false);
      return null;
    }
  }

  private async openDatabase(): Promise<IDBPDatabase<PromptWeaveDB>> {
    return await openIDB<PromptWeaveDB>(this.dbName, this.dbVersion, {
      upgrade: (db, oldVersion, newVersion, transaction) => {
        console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
        
        // Create or update object stores based on the old version
        if (oldVersion < 1) {
          // Initial schema creation for version 1
          Object.entries(schema).forEach(([storeName, storeSchema]) => {
            const objectStore = db.createObjectStore(storeName as string, { keyPath: storeSchema.key });
            
            // Create indexes if specified
            if (storeSchema.indexes) {
              Object.entries(storeSchema.indexes).forEach(([indexName, keyPath]) => {
                objectStore.createIndex(indexName, keyPath as string);
              });
            }
          });
        }
        
        // Add version 2 specific changes if needed
        if (oldVersion < 2) {
          // If we're upgrading from version 1 to 2, we might need specific migrations
          // In this case, we don't need to do anything as the schema is the same
          console.log('Migrating to version 2 - no schema changes needed');
        }
      }
    });
  }
}
