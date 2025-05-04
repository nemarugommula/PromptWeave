
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPrompt, isDatabaseAvailable } from '@/lib/db';
import EditorView from './EditorView';
import EditorLoading from './EditorLoading';
import EditorError from './EditorError';
import EditorNotFound from './EditorNotFound';

const EditorContainer = () => {
  const { id } = useParams<{ id: string }>();
  
  // Check database availability first
  const { 
    data: dbAvailable,
    isLoading: dbLoading,
    isError: dbError,
    refetch: retryDbCheckOriginal 
  } = useQuery({
    queryKey: ['database-available'],
    queryFn: async () => {
      console.log('Checking database availability');
      return await isDatabaseAvailable();
    }
  });
  
  // Wrap the refetch function to match the expected type
  const retryDbCheck = async (): Promise<void> => {
    await retryDbCheckOriginal();
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
      if (!id) throw new Error("No prompt ID provided");
      console.log(`Fetching prompt with ID: ${id}`);
      const result = await getPrompt(id);
      if (!result) throw new Error("Prompt not found");
      return result;
    },
    enabled: !!id && !!dbAvailable,
  });

  // Wrap the refetch function to match the expected type
  const refetchPrompt = async (): Promise<void> => {
    await refetchPromptOriginal();
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
  if (promptError || !prompt) {
    const errorMessage = fetchError instanceof Error ? fetchError.message : "Failed to load prompt";
    
    if (errorMessage.includes("not found")) {
      return <EditorNotFound errorMessage="The prompt you're looking for doesn't exist or has been deleted." />;
    }
    
    return (
      <EditorError 
        error={fetchError instanceof Error ? fetchError : new Error(errorMessage)} 
        onRetry={refetchPrompt}
      />
    );
  }

  // If we have the prompt data, render the editor view with full width
  return (
    <div className="min-h-screen flex w-full">
      <EditorView prompt={prompt} />
    </div>
  );
};

export default EditorContainer;
