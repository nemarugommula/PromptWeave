import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, PanelLeft, PanelRight, Pencil, Puzzle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Import all hooks from the barrel file
import {
  useSnippetsState,
  useSidebarCollapse,
  useSearchSnippets,
  useFormatters,
  usePinnedSnippets
} from './prompt-snippets/hooks';

// Import UI components from the barrel file
import {
  FormattersPanel,
  SnippetsPanel,
  SearchBar,
  SidebarCollapsedView
} from './prompt-snippets';

interface PromptSnippetsSidebarProps {
  onInsert: (content: string) => void;
  onFormat: (type: string) => void;
}

const PromptSnippetsSidebar: React.FC<PromptSnippetsSidebarProps> = ({ 
  onInsert, 
  onFormat 
}) => {
  const { collapsed, toggleCollapsed } = useSidebarCollapse();
  const { formatters, formatterGroups, handleFormatClick } = useFormatters(onInsert, onFormat);
  const { pinnedSnippetIds, handleTogglePin } = usePinnedSnippets();
  const { snippets, setSnippets } = useSnippetsState(pinnedSnippetIds);
  const { 
    searchQuery, 
    setSearchQuery, 
    clearSearch, 
    searchInputRef, 
    filteredSnippets, 
    categorizedSnippets 
  } = useSearchSnippets(snippets);

  const [showFormattersOnly, setShowFormattersOnly] = useState(false);

  // Focus search input when pressing Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      try {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !collapsed) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      } catch (error) {
        console.error('Error handling keyboard shortcut:', error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, searchInputRef]);

  const renderSidebarButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleCollapsed}
      className={cn(
        "fixed top-20 z-10 flex items-center justify-center",
        "h-8 w-8 rounded-r-md bg-primary text-primary-foreground shadow-md",
        "border-y border-r border-primary-foreground/20",
        collapsed ? "left-0" : "left-[255px] transform -translate-x-1"
      )}
      aria-label={collapsed ? "Expand snippets panel" : "Collapse snippets panel"}
    >
      {collapsed ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
    </motion.button>
  );

  if (collapsed) {
    return (
      <>
        {renderSidebarButton()}
        <SidebarCollapsedView 
          toggleCollapsed={toggleCollapsed} 
          formatters={formatters}
          handleFormatClick={handleFormatClick}
        />
      </>
    );
  }

  return (
    <>
      {renderSidebarButton()}
      <motion.aside 
        className="flex flex-col bg-background border-r w-64 flex-shrink-0 h-full relative transition-all duration-300"
        initial={{ width: collapsed ? 64 : 256 }}
        animate={{ width: 256 }}
        exit={{ width: 64 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Prompt Tools</h3>
          </div>
        </div>

        <SearchBar 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          onClear={clearSearch}
          inputRef={searchInputRef}
        />

        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="border-b">
            <div className="flex w-full">
              <div 
                className={cn(
                  "flex-1 py-2 text-sm font-medium cursor-pointer transition-colors relative flex items-center justify-center gap-1",
                  showFormattersOnly 
                    ? "text-foreground border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
                onClick={() => setShowFormattersOnly(true)}
              >
                <Pencil className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">Formatters</span>
              </div>
              <div 
                className={cn(
                  "flex-1 py-2 text-sm font-medium cursor-pointer transition-colors relative flex items-center justify-center gap-1",
                  !showFormattersOnly 
                    ? "text-foreground border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
                onClick={() => setShowFormattersOnly(false)}
              >
                <Puzzle className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">Snippets</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {showFormattersOnly ? (
              <FormattersPanel 
                formatterGroups={formatterGroups} 
                handleFormatClick={handleFormatClick}
              />
            ) : (
              <SnippetsPanel 
                categorizedSnippets={categorizedSnippets}
                searchQuery={searchQuery}
                clearSearch={clearSearch}
                onInsert={onInsert}
                onTogglePin={handleTogglePin}
              />
            )}
          </ScrollArea>
        </div>
      </motion.aside>
    </>
  );
};

export default PromptSnippetsSidebar;