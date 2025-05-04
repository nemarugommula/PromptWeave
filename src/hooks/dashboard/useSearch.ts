
import { useState, useCallback } from 'react';
import { debounce } from '@/lib/utils';

export const useSearch = (onSearch: (query: string) => void) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return {
    searchQuery,
    handleSearchChange
  };
};
