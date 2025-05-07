import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, PanelLeft, PanelRight, Pencil, Puzzle, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';

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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'category'>('category');

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

  // Get unique categories for filtering
  const categories = React.useMemo(() => {
    return Array.from(new Set(snippets.map(s => s.category))).sort();
  }, [snippets]);

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
        {/* Header with animated sparkle effect */}
        <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2 group">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "linear",
                repeatDelay: 10
              }}
              className="group-hover:text-primary transition-colors"
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>
            <h3 className="text-sm font-medium">Prompt Tools</h3>
          </div>
        </div>

        {/* Enhanced search with keyboard shortcut indicator */}
        <SearchBar 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          onClear={clearSearch}
          inputRef={searchInputRef}
        />
        
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Enhanced tabs with animated highlight indicator */}
          <div className="border-b">
            <div className="flex w-full relative">
              <div 
                className={cn(
                  "flex-1 py-2 text-sm font-medium cursor-pointer transition-all relative flex items-center justify-center gap-1 z-10",
                  showFormattersOnly 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
                onClick={() => setShowFormattersOnly(true)}
              >
                <Pencil className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">Formatters</span>
              </div>
              <div 
                className={cn(
                  "flex-1 py-2 text-sm font-medium cursor-pointer transition-all relative flex items-center justify-center gap-1 z-10",
                  !showFormattersOnly 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
                onClick={() => setShowFormattersOnly(false)}
              >
                <Puzzle className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">Snippets</span>
              </div>
              
              {/* Animated active tab indicator */}
              <motion.div 
                className="absolute bottom-0 h-0.5 bg-primary"
                initial={false}
                animate={{ 
                  left: showFormattersOnly ? "0%" : "50%",
                  right: showFormattersOnly ? "50%" : "0%"
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

          {/* Additional controls for snippet panel */}
          {!showFormattersOnly && (
            <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground">
                {Object.values(categorizedSnippets).flat().length} snippets
              </span>
              
              <div className="flex items-center gap-1">
                {/* Filter dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Filter className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      className="text-xs"
                      onClick={() => setActiveFilter(null)}
                    >
                      All Categories
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {categories.map(category => (
                      <DropdownMenuCheckboxItem
                        key={category}
                        checked={activeFilter === category}
                        onCheckedChange={() => setActiveFilter(activeFilter === category ? null : category)}
                        className="text-xs"
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-xs"
                      onClick={() => setSortBy('recent')}
                    >
                      Sort by Recent
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-xs"
                      onClick={() => setSortBy('alphabetical')}
                    >
                      Sort Alphabetically
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-xs"
                      onClick={() => setSortBy('category')}
                    >
                      Group by Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1">
            <AnimatePresence mode="wait">
              {showFormattersOnly ? (
                <motion.div
                  key="formatters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormattersPanel 
                    formatterGroups={formatterGroups} 
                    handleFormatClick={handleFormatClick}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="snippets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SnippetsPanel 
                    categorizedSnippets={
                      activeFilter 
                        ? { [activeFilter]: categorizedSnippets[activeFilter] || [] }
                        : categorizedSnippets
                    }
                    searchQuery={searchQuery}
                    clearSearch={clearSearch}
                    onInsert={onInsert}
                    onTogglePin={handleTogglePin}
                    sortBy={sortBy}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </motion.aside>
    </>
  );
};

export default PromptSnippetsSidebar;