import { useState, useCallback, useEffect } from 'react';

export const usePinnedSnippets = () => {
  const [pinnedSnippetIds, setPinnedSnippetIds] = useState<string[]>(() => {
    const savedPins = localStorage.getItem('pinnedSnippets');
    return savedPins ? JSON.parse(savedPins) : [];
  });

  useEffect(() => {
    localStorage.setItem('pinnedSnippets', JSON.stringify(pinnedSnippetIds));
  }, [pinnedSnippetIds]);

  const handleTogglePin = useCallback((snippetId: string) => {
    setPinnedSnippetIds(prevIds => {
      if (prevIds.includes(snippetId)) {
        return prevIds.filter(id => id !== snippetId);
      } else {
        return [...prevIds, snippetId];
      }
    });
  }, []);

  return {
    pinnedSnippetIds,
    handleTogglePin
  };
};