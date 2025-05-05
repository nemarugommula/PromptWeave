import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPrompt, isDatabaseAvailable } from '@/lib/db';
import EditorView from './EditorView';
import EditorLoading from './EditorLoading';
import EditorError from './EditorError';
import EditorNotFound from './EditorNotFound';
import { v4 as uuidv4 } from '@/lib/utils/uuid';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { toast } from '@/components/ui/use-toast';

interface EditorContainerProps {
  isNewPrompt?: boolean;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ isNewPrompt = false }) => {
  const { id } = useParams<{ id: string }>();
  const [hasError, setHasError] = useState<Error | null>(null);
  
  // Track all async operations for better error handling
  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in EditorContainer:', event.reason);
      // Show a toast but don't break the UI
      toast({ 
        title: 'Background Operation Failed', 
        description: 'A background operation failed. Some features may not work correctly.',
        variant: 'destructive' 
      });
      // Prevent the default behavior which would crash the app
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Check database availability first
  const { 
    data: dbAvailable,
    isLoading: dbLoading,
    isError: dbError,
    refetch: retryDbCheckOriginal 
  } = useQuery({
    queryKey: ['database-available'],
    queryFn: async () => {
      try {
        console.log('Checking database availability');
        return await isDatabaseAvailable();
      } catch (error) {
        console.error('Database availability check failed:', error);
        return false;
      }
    }
  });
  
  // Wrap the refetch function to match the expected type
  const retryDbCheck = async (): Promise<void> => {
    try {
      await retryDbCheckOriginal();
    } catch (error) {
      console.error('Error retrying database check:', error);
      toast({ 
        title: 'Database Check Failed', 
        description: 'Failed to check database availability. Please try again.',
        variant: 'destructive' 
      });
    }
  };
  
  // Fetch the prompt data when database is available
  const { 
    data: prompt, 
    isLoading: promptLoading,
    isError: promptError,
    error: fetchError,
    refetch: refetchPromptOriginal
  } = useQuery({
    queryKey: ['prompt', id],
    queryFn: async () => {
      try {
        if (!id) {
          // If isNewPrompt is true and no ID is provided, return a default empty prompt
          if (isNewPrompt) {
            return {
              id: uuidv4(),
              name: 'New Prompt',
              content: '',
              created_at: Date.now(),
              updated_at: Date.now(),
              category: 'default', // Add default category to prevent null errors
              current_version_id: null,
              versions: []
            };
          }
          throw new Error("No prompt ID provided");
        }
        console.log(`Fetching prompt with ID: ${id}`);
        const result = await getPrompt(id);
        
        // Handle null result case
        if (!result) {
          throw new Error("Prompt not found");
        }
        
        // Validate that result has the expected structure
        if (!result.category) {
          console.warn('Prompt is missing category field, setting default');
          result.category = 'default';
        }
        
        return result;
      } catch (error) {
        console.error('Error fetching prompt:', error);
        // Set error state to be used in the component
        if (error instanceof Error) {
          setHasError(error);
        } else {
          setHasError(new Error(String(error)));
        }
        // Re-throw the error to be handled by React Query
        throw error;
      }
    },
    enabled: (!!id || isNewPrompt) && !!dbAvailable
  });

  // Wrap the refetch function to match the expected type
  const refetchPrompt = async (): Promise<void> => {
    try {
      await refetchPromptOriginal();
    } catch (error) {
      console.error('Error retrying prompt fetch:', error);
      toast({
        title: 'Error Refreshing Prompt',
        description: 'Failed to refresh prompt data. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Show database initialization state
  if (dbLoading) {
    return <EditorLoading message="Initializing Database" description="Setting up your database..." />;
  }

  // Handle database error
  if (dbError) {
    console.error("Database is not available");
    return (
      <EditorError 
        error={new Error("Database is not available")} 
        onRetry={retryDbCheck}
        message="We couldn't connect to the database. This is required to load your prompts."
      />
    );
  }

  // Handle prompt loading state
  if (promptLoading) {
    return <EditorLoading />;
  }

  // Handle prompt error state
  if (promptError || hasError || !prompt) {
    const errorMessage = fetchError instanceof Error ? fetchError.message : 
                         hasError instanceof Error ? hasError.message : 
                         "Failed to load prompt";
    
    if (errorMessage.includes("not found")) {
      return <EditorNotFound errorMessage="The prompt you're looking for doesn't exist or has been deleted." />;
    }
    
    return (
      <EditorError 
        error={fetchError instanceof Error ? fetchError : 
              hasError instanceof Error ? hasError : 
              new Error(errorMessage)} 
        onRetry={refetchPrompt}
      />
    );
  }

  // If we have the prompt data, render the editor view with full width
  // Use an error boundary to catch any rendering errors
  return (
    <div className="min-h-screen flex w-full">
      <ErrorBoundary>
        <EditorView prompt={prompt} />
      </ErrorBoundary>
    </div>
  );
};

export default EditorContainer;
