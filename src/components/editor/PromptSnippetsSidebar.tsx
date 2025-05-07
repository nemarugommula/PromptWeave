import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, PanelLeft, PanelRight, Pencil, Puzzle, ChevronRight, Filter, ChevronLeft } from 'lucide-react';
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';

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

  const [activeTab, setActiveTab] = useState<string>("snippets");
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
        "fixed top-40 z-10 flex items-center justify-center",
        "h-8 w-8 rounded-r-md bg-primary text-primary-foreground shadow-md",
        "border-y border-r border-primary-foreground/20",
        collapsed ? "left-0" : "left-[255px] transform -translate-x-1"
      )}
      aria-label={collapsed ? "Expand snippets panel" : "Collapse snippets panel"}
    >
      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
        
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Enhanced tabs with proper shadcn/ui components */}
          <Tabs 
            defaultValue="snippets" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <div className="px-1 py-1 border-b">
              <TabsList className="grid grid-cols-2 w-full h-9 bg-muted/40">
                <TabsTrigger 
                  value="formatters" 
                  className="flex items-center justify-center gap-1.5 data-[state=active]:bg-background rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs font-medium">Formatters</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="snippets" 
                  className="flex items-center justify-center gap-1.5 data-[state=active]:bg-background rounded-md"
                >
                  <Puzzle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs font-medium">Snippets</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Additional controls for snippet panel */}
            {activeTab === "snippets" && (
              <div className="flex flex-col border-b bg-muted/40">
                <SearchBar 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  onClear={clearSearch}
                  inputRef={searchInputRef}
                />
                
                <div className="flex items-center justify-between px-3 py-1.5">
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
              </div>
            )}

            {/* Tab content with improved transitions */}
            <ScrollArea className="flex-1">
              <TabsContent 
                value="formatters" 
                className="p-0 m-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <motion.div
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
              </TabsContent>
              <TabsContent 
                value="snippets" 
                className="p-0 m-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <motion.div
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
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </motion.aside>
    </>
  );
};

export default PromptSnippetsSidebar;