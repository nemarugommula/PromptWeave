import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePrompt, saveVersion } from '@/lib/db';
import { PromptSchema } from '@/lib/db/schema';
import { v4 as uuidv4 } from '@/lib/utils/uuid';
import { toast } from '@/components/ui/use-toast';

export function useEditorState(initialPrompt: PromptSchema) {
  // State for the editor
  const [prompt, setPrompt] = useState<PromptSchema>(initialPrompt);
  const [name, setName] = useState(initialPrompt.name || "Untitled Prompt");
  const [content, setContent] = useState(initialPrompt.content || "");
  const [currentVersionId, setCurrentVersionId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  
  // Calculate word count and character count
  const wordCount = content ? content.split(/\s+/).filter(w => w.length > 0).length : 0;
  const charCount = content ? content.length : 0;
  
  // Handle prompt save with React Query
  const { mutate: savePromptData, isPending: saving } = useMutation({
    mutationFn: async () => {
      console.log("Saving prompt:", prompt.id);
      
      const updatedPrompt = {
        ...prompt,
        name,
        content,
        updated_at: Date.now()
      };
      
      // Save the prompt
      await savePrompt(updatedPrompt);
      
      // Save a version
      const newVersion = {
        id: uuidv4(),
        prompt_id: prompt.id,
        content: content,
        created_at: Date.now(),
        metadata: {
          length: content.length,
          words: content.split(/\s+/).length
        }
      };
      
      await saveVersion(newVersion);
      setCurrentVersionId(newVersion.id);
      
      return updatedPrompt;
    },
    onSuccess: (savedPrompt) => {
      setPrompt(savedPrompt);
      toast({
        title: "Saved",
        description: "Your prompt has been saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['prompt', prompt.id] });
      queryClient.invalidateQueries({ queryKey: ['versions', prompt.id] });
    },
    onError: (error) => {
      console.error("Failed to save prompt:", error);
      toast({
        title: "Error",
        description: "Could not save your changes.",
        variant: "destructive",
      });
    }
  });
  
  // Handle creating a new version without changing the current version
  const { mutate: createNewVersionData, isPending: creatingVersion } = useMutation({
    mutationFn: async () => {
      console.log("Creating new version for prompt:", prompt.id);
      
      // Save the prompt first to ensure content is up to date
      const updatedPrompt = {
        ...prompt,
        name,
        content,
        updated_at: Date.now()
      };
      
      await savePrompt(updatedPrompt);
      
      // Save a new version without setting it as current
      const newVersion = {
        id: uuidv4(),
        prompt_id: prompt.id,
        content: content,
        created_at: Date.now(),
        metadata: {
          length: content.length,
          words: content.split(/\s+/).length
        }
      };
      
      await saveVersion(newVersion);
      // Don't set as current version: setCurrentVersionId(newVersion.id);
      
      return updatedPrompt;
    },
    onSuccess: (savedPrompt) => {
      setPrompt(savedPrompt);
      toast({
        title: "New Version Created",
        description: "A new version of this prompt has been saved."
      });
      queryClient.invalidateQueries({ queryKey: ['prompt', prompt.id] });
      queryClient.invalidateQueries({ queryKey: ['versions', prompt.id] });
    },
    onError: (error) => {
      console.error("Failed to create new version:", error);
      toast({
        title: "Error",
        description: "Could not create a new version.",
        variant: "destructive",
      });
    }
  });

  const handleSave = useCallback(() => {
    savePromptData();
  }, [savePromptData]);
  
  const handleNewVersion = useCallback(() => {
    createNewVersionData();
  }, [createNewVersionData]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Content copied to clipboard"
    });
  }, [content]);

  const createNewPrompt = useCallback(() => {
    const newPromptId = uuidv4();
    
    // Create the prompt in the database and navigate to it
    const newPrompt: PromptSchema = {
      id: newPromptId,
      name: "New Prompt",
      content: "",
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    savePrompt(newPrompt).then(() => {
      window.location.href = `/editor/${newPromptId}`;
    });
  }, []);

  return {
    prompt,
    setPrompt,
    name,
    setName,
    content,
    setContent,
    currentVersionId,
    setCurrentVersionId,
    wordCount,
    charCount,
    saving: saving || creatingVersion,
    handleSave,
    handleNewVersion,
    handleCopy,
    createNewPrompt
  };
}
