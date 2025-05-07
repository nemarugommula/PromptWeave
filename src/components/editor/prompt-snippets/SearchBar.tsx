import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  inputRef,
  className
}) => {
  const hasValue = Boolean(value);

  return (
    <div className={cn(
      "flex items-center py-2 px-3 border-b bg-muted/10",
      className
    )}>
<div className="relative flex-1 min-w-0">

  <input
    ref={inputRef}
    type="text"
    placeholder="Search snippets..."
    className={cn(
      "h-8 w-full rounded-md border bg-background py-2 pl-8 pr-12",
      "text-xs ring-offset-background placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "transition-colors duration-200"
    )}
    value={value}
    onChange={onChange}
  />

        {/* Keyboard shortcut indicator */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value && (
            <motion.button
              onClick={onClear}
              className="focus:outline-none"
              aria-label="Clear search"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </motion.button>
          )}

          {!hasValue && (
            <kbd className="flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <Command className="h-3 w-3" /> K
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
};