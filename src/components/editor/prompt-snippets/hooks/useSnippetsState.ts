import { useState, useEffect, useMemo } from 'react';
import { Snippet } from '../types';
import { SNIPPETS } from '@/lib/snippets';

export const useSnippetsState = (pinnedSnippetIds: string[]) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  // Fetch snippets on mount
  useEffect(() => {
    try {
      // Use the SNIPPETS constant directly instead of an async function
      setSnippets(SNIPPETS);
    } catch (error) {
      console.error('Failed to load snippets:', error);
      setSnippets([]);
    }
  }, []);

  // Apply isPinned property to snippets based on pinnedSnippetIds
  const processedSnippets = useMemo(() => {
    return snippets.map(snippet => ({
      ...snippet,
      isPinned: pinnedSnippetIds.includes(snippet.id)
    }));
  }, [snippets, pinnedSnippetIds]);

  return {
    snippets: processedSnippets,
    setSnippets,
  };
};