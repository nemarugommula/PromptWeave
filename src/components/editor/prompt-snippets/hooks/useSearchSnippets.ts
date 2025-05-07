import { useState, useCallback, useMemo, useRef } from 'react';
import { Snippet, CategorySnippets } from '../types';

export const useSearchSnippets = (snippets: Snippet[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const filteredSnippets = useMemo(() => {
    if (!searchQuery.trim()) return snippets;
    
    const query = searchQuery.toLowerCase().trim();
    return snippets.filter(snippet => 
      snippet.title.toLowerCase().includes(query) || 
      snippet.content.toLowerCase().includes(query) || 
      snippet.category.toLowerCase().includes(query) ||
      snippet.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      snippet.description?.toLowerCase().includes(query)
    );
  }, [snippets, searchQuery]);

  const categorizedSnippets = useMemo(() => {
    const result: CategorySnippets = {};
    
    // First add pinned snippets if there are any
    const pinnedSnippets = filteredSnippets.filter(s => s.isPinned);
    if (pinnedSnippets.length > 0) {
      result['Pinned'] = pinnedSnippets;
    }

    // Then add the rest of the snippets by category
    filteredSnippets.forEach(snippet => {
      if (snippet.isPinned) return; // Skip pinned snippets as they're already added
      
      if (!result[snippet.category]) {
        result[snippet.category] = [];
      }
      result[snippet.category].push(snippet);
    });

    return result;
  }, [filteredSnippets]);

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    searchInputRef,
    filteredSnippets,
    categorizedSnippets
  };
};