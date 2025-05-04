
import { IDBPDatabase } from 'idb';
import { PromptWeaveDB } from '../schema';

/**
 * A singleton service that maintains the database instance
 */
export class DBInstanceService {
  private static instance: DBInstanceService;
  private db: IDBPDatabase<PromptWeaveDB> | null = null;
  private error: Error | null = null;
  private isInitializing = false;

  private constructor() {}

  public static getInstance(): DBInstanceService {
    if (!DBInstanceService.instance) {
      DBInstanceService.instance = new DBInstanceService();
    }
    return DBInstanceService.instance;
  }

  public setDatabase(db: IDBPDatabase<PromptWeaveDB> | null): void {
    this.db = db;
  }

  public getDatabase(): IDBPDatabase<PromptWeaveDB> | null {
    return this.db;
  }

  public setError(error: Error | null): void {
    this.error = error;
  }

  public getError(): Error | null {
    return this.error;
  }

  public setInitializing(initializing: boolean): void {
    this.isInitializing = initializing;
  }

  public isInitializingDb(): boolean {
    return this.isInitializing;
  }

  public reset(): void {
    this.db = null;
    this.error = null;
    this.isInitializing = false;
  }

  public isDatabaseHealthy(): boolean {
    return !!this.db && !this.error;
  }
}
