
import { useState, useEffect, useCallback } from "react";
import { getPrompt, savePrompt, saveVersion, isDatabaseAvailable } from "@/lib/db";
import { PromptSchema } from "@/lib/db/schema";
import { v4 as uuidv4 } from "@/lib/utils/uuid";
import { toast } from "@/components/ui/use-toast";

export const usePromptData = (id: string | undefined) => {
  const [prompt, setPrompt] = useState<PromptSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch prompt data
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchPrompt = async () => {
      setError(null);
      setFetchError(null);
      setLoading(true);
      
      try {
        const dbAvailable = await isDatabaseAvailable();
        if (!dbAvailable) {
          throw new Error("Database connection is not available. Please try again.");
        }
        
        const promptData = await getPrompt(id);
        
        if (promptData) {
          setPrompt(promptData);
          setName(promptData.name);
          setContent(promptData.content);
        } else {
          setFetchError("The requested prompt could not be found.");
          toast({
            title: "Prompt not found",
            description: "The requested prompt could not be found.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Failed to load prompt:", err);
        setError(err instanceof Error ? err : new Error("Could not load the prompt data."));
        toast({
          title: "Error",
          description: "Could not load the prompt data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  // Save prompt data
  const handleSave = async () => {
    if (!prompt) return;
    
    setSaving(true);
    try {
      const updatedPrompt = {
        ...prompt,
        name,
        content,
        updated_at: Date.now()
      };
      
      await savePrompt(updatedPrompt);
      
      await saveVersion({
        id: uuidv4(),
        prompt_id: prompt.id,
        content,
        metadata: {
          length: content.length,
          words: content.split(/\s+/).length
        }
      });
      
      setPrompt(updatedPrompt);
      toast({
        title: "Saved",
        description: "Your prompt has been saved successfully."
      });
    } catch (error) {
      console.error("Failed to save prompt:", error);
      toast({
        title: "Error",
        description: "Could not save your changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle retrying after error
  const handleRetry = useCallback(async (): Promise<void> => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    setFetchError(null);
    
    try {
      const dbAvailable = await isDatabaseAvailable();
      if (!dbAvailable) {
        throw new Error("Database is still not available. Please try again later.");
      }
      
      const promptData = await getPrompt(id);
      
      if (promptData) {
        setPrompt(promptData);
        setName(promptData.name);
        setContent(promptData.content);
      } else {
        setFetchError("The requested prompt could not be found.");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to retry loading prompt"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    prompt,
    name,
    content,
    loading,
    saving,
    error,
    fetchError,
    setName,
    setContent,
    handleSave,
    handleRetry
  };
};
