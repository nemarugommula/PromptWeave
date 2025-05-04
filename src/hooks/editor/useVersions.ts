
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVersionsByPromptId, saveVersion } from '@/lib/db';
import { VersionSchema } from '@/lib/db/schema';
import { v4 as uuidv4 } from '@/lib/utils/uuid';
import { toast } from '@/components/ui/use-toast';

export const useVersions = (promptId: string, content: string) => {
  const [currentVersionId, setCurrentVersionId] = useState<string>();
  const queryClient = useQueryClient();
  
  // Fetch all versions for this prompt
  const { data: versions = [], isLoading, error } = useQuery({
    queryKey: ['versions', promptId],
    queryFn: async () => {
      const result = await getVersionsByPromptId(promptId);
      return result || [];
    }
  });
  
  // Create new version mutation
  const { mutate: createNewVersion, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const newVersion = {
        id: uuidv4(),
        prompt_id: promptId,
        content: content,
        created_at: Date.now(),
        metadata: {
          length: content.length,
          words: content.split(/\s+/).length
        }
      };
      
      await saveVersion(newVersion);
      setCurrentVersionId(newVersion.id);
      return newVersion;
    },
    onSuccess: () => {
      toast({
        title: "Version Created",
        description: "A new version of this prompt has been saved."
      });
      queryClient.invalidateQueries({ queryKey: ['versions', promptId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create a new version.",
        variant: "destructive"
      });
      console.error("Version creation failed:", error);
    }
  });
  
  // Get the current version from the list
  const currentVersion = currentVersionId 
    ? versions.find(v => v.id === currentVersionId) 
    : versions[0];
  
  // Sort versions by creation date (newest first)
  const sortedVersions = [...versions].sort((a, b) => b.created_at - a.created_at);
  
  return {
    versions: sortedVersions,
    currentVersion,
    currentVersionId,
    isLoading,
    error,
    createNewVersion,
    isSaving,
    setCurrentVersionId
  };
};
