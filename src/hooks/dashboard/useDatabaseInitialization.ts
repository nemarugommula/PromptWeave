import { useState, useEffect, useCallback } from 'react';
import { initDB, isDatabaseAvailable, resetDatabaseService, getDatabaseError } from '@/lib/db';

export const useDatabaseInitialization = () => {
  const [dbInitializing, setDbInitializing] = useState(true);
  const [dbError, setDbError] = useState<Error | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);
  const [dbInitialized, setDbInitialized] = useState(false);
  
  // Function to initialize the database
  const initializeDatabase = useCallback(async (): Promise<void> => {
    try {
      setDbInitializing(true);
      setDbError(null);
      setDbInitialized(false);
      
      console.log("Initializing database...");
      await initDB();
      
      // Add a small delay to ensure the database is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isAvailable = await isDatabaseAvailable();
      console.log("Database available check:", isAvailable);
      
      if (!isAvailable) {
        const error = getDatabaseError();
        console.error("Database not available after initialization:", error);
        throw error || new Error('Database initialization failed - database not available');
      }
      
      // Everything succeeded
      console.log("Database initialization successful");
      setDbInitialized(true);
      setDbInitializing(false);
    } catch (error) {
      console.error("Database initialization failed:", error);
      setDbError(error instanceof Error ? error : new Error("Failed to initialize database"));
      setDbInitializing(false);
      setDbInitialized(false);
    }
  }, []);

  // Initialize database on component mount with automatic retry
  useEffect(() => {
    console.log(`Database initialization attempt: ${initAttempts + 1}`);
    
    initializeDatabase().catch(error => {
      console.error("Unhandled error during database initialization:", error);
      
      // If we haven't tried too many times, retry automatically
      if (initAttempts < 2) {
        console.log("Scheduling automatic retry...");
        const timer = setTimeout(() => {
          setInitAttempts(prev => prev + 1);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    });
  }, [initAttempts, initializeDatabase]);

  // Retry database initialization
  const retryInitialization = useCallback(async (): Promise<void> => {
    try {
      console.log("Manual retry of database initialization");
      setDbInitializing(true);
      setDbError(null);
      setDbInitialized(false);
      
      // Reset the database service state
      console.log("Resetting database service...");
      resetDatabaseService();
      
      // Try to initialize again
      await initDB();
      
      // Add a small delay to ensure the database is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isAvailable = await isDatabaseAvailable();
      console.log("Database available after retry:", isAvailable);
      
      if (!isAvailable) {
        const error = getDatabaseError();
        console.error("Database still unavailable after retry:", error);
        throw error || new Error('Database initialization failed after reset');
      }
      
      console.log("Database retry successful");
      setDbInitialized(true);
      setDbInitializing(false);
    } catch (error) {
      console.error("Database re-initialization failed:", error);
      const dbError = getDatabaseError();
      setDbError(dbError || (error instanceof Error ? error : new Error("Failed to initialize database")));
      setDbInitializing(false);
      setDbInitialized(false);
    }
  }, []);

  return {
    dbInitializing,
    dbError,
    dbInitialized,
    retryInitialization,
    initializeDatabase
  };
};
