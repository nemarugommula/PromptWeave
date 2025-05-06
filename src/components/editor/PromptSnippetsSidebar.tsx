import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SNIPPETS as DEFAULT_SNIPPETS, Snippet } from '@/lib/snippets';
import { 
  ChevronLeft, 
  ChevronRight,
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered,
  FileJson,
  FileCode,
  Tag,
  Heading1,
  Heading2,
  Hash,
  Quote,
  Cpu,
  User,
  MessageSquare,
  Search,
  ChevronDown,
  Sparkles,
  PanelLeft,
  PanelRight,
  X,
  Plus,
  PinIcon,
  Pencil,
  Puzzle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger, 
  TooltipProvider 
} from '@/components/ui/tooltip';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// Storage keys for localStorage
const FORMATTERS_STORAGE_KEY = 'promptweave-formatters';
const SNIPPETS_STORAGE_KEY = 'promptweave-snippets';
const SIDEBAR_STATE_KEY = 'prompt-snippets-sidebar-collapsed';
const PINNED_SNIPPETS_KEY = 'prompt-snippets-pinned';

// Interface for formatter options
interface FormatOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  type: string;
  shortcut?: string;
  template: string;
  description?: string;
}

// Enhanced snippet type with pinned status
interface EnhancedSnippet extends Snippet {
  pinned?: boolean;
}

// Default formatters
const DEFAULT_FORMATTERS: FormatOption[] = [
  { 
    id: 'heading1', 
    icon: <Heading1 className="h-4 w-4" />, 
    label: "Heading 1", 
    type: 'heading1', 
    shortcut: "Ctrl+1", 
    template: '\n# Heading 1\n',
    description: "Add a top-level heading" 
  },
  { 
    id: 'heading2', 
    icon: <Heading2 className="h-4 w-4" />, 
    label: "Heading 2", 
    type: 'heading2', 
    shortcut: "Ctrl+2", 
    template: '\n## Heading 2\n',
    description: "Add a second-level heading"
  },
  { 
    id: 'heading3', 
    icon: <Hash className="h-4 w-4" />, 
    label: "Heading 3", 
    type: 'heading3', 
    shortcut: "Ctrl+3", 
    template: '\n### Heading 3\n',
    description: "Add a third-level heading"
  },
  { 
    id: 'bold', 
    icon: <Bold className="h-4 w-4" />, 
    label: "Bold", 
    type: 'bold', 
    shortcut: "Ctrl+B", 
    template: '**bold text**',
    description: "Make text bold"
  },
  { 
    id: 'italic', 
    icon: <Italic className="h-4 w-4" />, 
    label: "Italic", 
    type: 'italic', 
    shortcut: "Ctrl+I", 
    template: '*italic text*',
    description: "Make text italic"
  },
  { 
    id: 'inlineCode', 
    icon: <Code className="h-4 w-4" />, 
    label: "Inline Code", 
    type: 'inlineCode', 
    shortcut: "Ctrl+`", 
    template: '`code`',
    description: "Format as inline code"
  },
  { 
    id: 'codeBlock', 
    icon: <Code className="h-4 w-4" />, 
    label: "Code Block", 
    type: 'codeBlock', 
    template: '\n```\ncode block\n```\n',
    description: "Insert a code block"
  },
  { 
    id: 'jsonBlock', 
    icon: <FileJson className="h-4 w-4" />, 
    label: "JSON Block", 
    type: 'jsonBlock', 
    template: '\n```json\n{\n  \n}\n```\n',
    description: "Insert a JSON code block"
  },
  { 
    id: 'xmlBlock', 
    icon: <FileCode className="h-4 w-4" />, 
    label: "XML Block", 
    type: 'xmlBlock', 
    template: '\n```xml\n<root>\n  \n</root>\n```\n',
    description: "Insert an XML code block"
  },
  { 
    id: 'list', 
    icon: <List className="h-4 w-4" />, 
    label: "Bullet List", 
    type: 'list', 
    template: '\n- List item 1\n- List item 2\n',
    description: "Create a bulleted list"
  },
  { 
    id: 'numberedList', 
    icon: <ListOrdered className="h-4 w-4" />, 
    label: "Numbered List", 
    type: 'numberedList', 
    template: '\n1. First item\n2. Second item\n',
    description: "Create a numbered list"
  },
  { 
    id: 'quote', 
    icon: <Quote className="h-4 w-4" />, 
    label: "Quote", 
    type: 'quote', 
    template: '\n> quote\n',
    description: "Insert a block quote"
  },
  { 
    id: 'roleSystem', 
    icon: <Cpu className="h-4 w-4" />, 
    label: "Role: System", 
    type: 'roleSystem', 
    template: '\n# System\n',
    description: "Insert system role heading"
  },
  { 
    id: 'roleUser', 
    icon: <User className="h-4 w-4" />, 
    label: "Role: User", 
    type: 'roleUser', 
    template: '\n# User\n',
    description: "Insert user role heading"
  },
  { 
    id: 'roleAssistant', 
    icon: <MessageSquare className="h-4 w-4" />, 
    label: "Role: Assistant", 
    type: 'roleAssistant', 
    template: '\n# Assistant\n',
    description: "Insert assistant role heading"
  },
  { 
    id: 'tagBlock', 
    icon: <Tag className="h-4 w-4" />, 
    label: "Metadata Tag", 
    type: 'tagBlock', 
    template: '<!-- meta: key=value -->\n',
    description: "Insert metadata tag"
  },
  { 
    id: 'search', 
    icon: <Search className="h-4 w-4" />, 
    label: "Find in text", 
    type: 'search', 
    shortcut: "Ctrl+F", 
    template: '',
    description: "Search within the document"
  },
];

interface FormatButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  shortcut?: string;
  description?: string;
  size?: 'sm' | 'default';
}

const FormatButton = React.memo(({ 
  icon, 
  label, 
  onClick, 
  shortcut,
  description,
  size = 'default' 
}: FormatButtonProps) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle 
          aria-label={`Toggle ${label}`} 
          onClick={onClick}
          size={size}
          className={cn(
            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            "hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
        >
          {icon}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <div>
          <div className="font-medium">{label}</div>
          {shortcut && <div className="text-xs text-muted-foreground">{shortcut}</div>}
          {description && <div className="text-xs mt-1">{description}</div>}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

FormatButton.displayName = 'FormatButton';

interface SnippetItemProps {
  snippet: EnhancedSnippet;
  onInsert: (content: string) => void;
  onTogglePin: (id: string) => void;
}

// Enhanced SearchBar component
const SearchBar = React.memo(({ 
  value, 
  onChange, 
  onClear,
  inputRef
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) => (
  <div className="px-3 py-2 bg-background sticky top-[49px] z-10 border-b">
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder="Find snippets..."
        value={value}
        onChange={onChange}
        className="pl-9 h-9 text-sm pr-8"
        aria-label="Search snippets"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-full"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
    {value && (
      <div className="mt-1.5 text-xs text-muted-foreground flex items-center">
        <span>Press ESC to clear • </span>
        <kbd className="ml-1 px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">
          Ctrl+K
        </kbd>
        <span className="ml-1">to search</span>
      </div>
    )}
  </div>
));

SearchBar.displayName = 'SearchBar';

// Fix SnippetItem to handle overflow better
const SnippetItem = React.memo(({ snippet, onInsert, onTogglePin }: SnippetItemProps) => {
  return (
    <div className="group flex items-center py-1.5 px-2 text-sm rounded-md hover:bg-secondary/40 transition-colors">
      <button
        onClick={() => onInsert(snippet.content)}
        className="flex-1 text-left truncate mr-1"
        title={snippet.description || snippet.title}
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('text/plain', snippet.content);
          e.dataTransfer.effectAllowed = 'copy';
        }}
      >
        <div className="flex items-center w-full">
          <span className="truncate max-w-[180px]">{snippet.title}</span>
        </div>
        {snippet.description && (
          <span className="text-xs text-muted-foreground truncate block max-w-[180px]">
            {snippet.description}
          </span>
        )}
      </button>
      
      <button
        onClick={() => onTogglePin(snippet.id)}
        className={cn(
          "p-1 rounded-sm opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0",
          snippet.pinned && "opacity-100 text-amber-500"
        )}
        aria-label={snippet.pinned ? "Unpin snippet" : "Pin snippet"}
      >
        <PinIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
});

SnippetItem.displayName = 'SnippetItem';

interface CategorySectionProps {
  category: string;
  snippets: EnhancedSnippet[];
  onInsert: (content: string) => void;
  onTogglePin: (id: string) => void;
  defaultOpen?: boolean;
}

const CategorySection = React.memo(({ 
  category, 
  snippets, 
  onInsert, 
  onTogglePin,
  defaultOpen = true
}: CategorySectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-1">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium hover:bg-secondary/50 rounded-md">
        <div className="flex items-center gap-1">
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open ? "transform rotate-0" : "transform rotate-[-90deg]")} />
          <span>{category}</span>
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {snippets.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1 pb-2">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-4"
            >
              {snippets.map((snippet) => (
                <SnippetItem 
                  key={snippet.id} 
                  snippet={snippet} 
                  onInsert={onInsert}
                  onTogglePin={onTogglePin}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
});

CategorySection.displayName = 'CategorySection';

interface PromptSnippetsSidebarProps {
  onInsert: (content: string) => void;
  onFormat: (type: string) => void;
}

const PromptSnippetsSidebar: React.FC<PromptSnippetsSidebarProps> = ({ onInsert, onFormat }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [formatters, setFormatters] = useState<FormatOption[]>([]);
  const [snippets, setSnippets] = useState<EnhancedSnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormattersOnly, setShowFormattersOnly] = useState(false);
  const [pinnedSnippetIds, setPinnedSnippetIds] = useState<string[]>([]);

  // Refs for keyboard navigation
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load collapse state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
      if (stored !== null) {
        setCollapsed(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error);
    }
  }, []);

  // Load pinned snippets from localStorage
  useEffect(() => {
    try {
      const storedPinned = localStorage.getItem(PINNED_SNIPPETS_KEY);
      if (storedPinned) {
        setPinnedSnippetIds(JSON.parse(storedPinned));
      }
    } catch (error) {
      console.error('Error loading pinned snippets:', error);
    }
  }, []);

  // Load formatters and snippets from localStorage
  useEffect(() => {
    // Load formatters
    try {
      const storedFormatters = localStorage.getItem(FORMATTERS_STORAGE_KEY);
      if (storedFormatters) {
        try {
          const parsedFormatters = JSON.parse(storedFormatters);
          // Apply icons to formatters (since icons aren't stored in localStorage)
          const formattersWithIcons = parsedFormatters.map((formatter: Omit<FormatOption, 'icon'>) => ({
            ...formatter,
            icon: getIconForType(formatter.type)
          }));
          setFormatters(formattersWithIcons);
        } catch (e) {
          console.error('Error parsing stored formatters:', e);
          setFormatters(DEFAULT_FORMATTERS);
        }
      } else {
        setFormatters(DEFAULT_FORMATTERS);
      }

      // Load snippets
      const storedSnippets = localStorage.getItem(SNIPPETS_STORAGE_KEY);
      if (storedSnippets) {
        try {
          const parsedSnippets = JSON.parse(storedSnippets);
          // Filter out any invalid snippets that might cause errors
          const validSnippets = parsedSnippets
            .filter((s: Snippet) => s && s.category && s.title && s.content)
            .map((s: Snippet) => ({
              ...s,
              pinned: pinnedSnippetIds.includes(s.id)
            }));
          setSnippets(validSnippets);
        } catch (e) {
          console.error('Error parsing stored snippets:', e);
          setSnippets(DEFAULT_SNIPPETS.map(s => ({ ...s, pinned: pinnedSnippetIds.includes(s.id) })));
        }
      } else {
        setSnippets(DEFAULT_SNIPPETS.map(s => ({ ...s, pinned: pinnedSnippetIds.includes(s.id) })));
      }
    } catch (error) {
      console.error('Error loading formatters or snippets:', error);
      setFormatters(DEFAULT_FORMATTERS);
      setSnippets(DEFAULT_SNIPPETS.map(s => ({ ...s, pinned: pinnedSnippetIds.includes(s.id) })));
    }
  }, [pinnedSnippetIds]);

  const toggleCollapsed = useCallback(() => {
    try {
      const next = !collapsed;
      setCollapsed(next);
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Error toggling sidebar:', error);
    }
  }, [collapsed]);

  // Toggle pin status for a snippet
  const handleTogglePin = useCallback((snippetId: string) => {
    try {
      setPinnedSnippetIds(prev => {
        const newPinned = prev.includes(snippetId)
          ? prev.filter(id => id !== snippetId)
          : [...prev, snippetId];
        
        // Update localStorage
        localStorage.setItem(PINNED_SNIPPETS_KEY, JSON.stringify(newPinned));
        
        // Update the snippet objects with pinned status
        setSnippets(currentSnippets => 
          currentSnippets.map(s => 
            s.id === snippetId 
              ? { ...s, pinned: !s.pinned }
              : s
          )
        );
        
        return newPinned;
      });
    } catch (error) {
      console.error('Error toggling pin status:', error);
    }
  }, []);

  // Get icon component based on formatter type
  const getIconForType = useCallback((type: string) => {
    switch (type) {
      case 'heading1': return <Heading1 className="h-4 w-4" />;
      case 'heading2': return <Heading2 className="h-4 w-4" />;
      case 'heading3': return <Hash className="h-4 w-4" />;
      case 'bold': return <Bold className="h-4 w-4" />;
      case 'italic': return <Italic className="h-4 w-4" />;
      case 'inlineCode': 
      case 'codeBlock': return <Code className="h-4 w-4" />;
      case 'jsonBlock': return <FileJson className="h-4 w-4" />;
      case 'xmlBlock': return <FileCode className="h-4 w-4" />;
      case 'list': return <List className="h-4 w-4" />;
      case 'numberedList': return <ListOrdered className="h-4 w-4" />;
      case 'quote': return <Quote className="h-4 w-4" />;
      case 'roleSystem': return <Cpu className="h-4 w-4" />;
      case 'roleUser': return <User className="h-4 w-4" />;
      case 'roleAssistant': return <MessageSquare className="h-4 w-4" />;
      case 'tagBlock': return <Tag className="h-4 w-4" />;
      case 'search': return <Search className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  }, []);

  // Handle format button click with template
  const handleFormatClick = useCallback((formatter: FormatOption) => {
    try {
      // Special case for search which doesn't insert text but triggers search
      if (formatter.type === 'search') {
        onFormat(formatter.type);
        return;
      }
      
      // For normal formatters, we insert the template
      onInsert(formatter.template);
    } catch (error) {
      console.error('Error handling format click:', error);
    }
  }, [onFormat, onInsert]);

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
  }, [collapsed]);

  // Filter snippets based on search query
  const filteredSnippets = useMemo(() => {
    try {
      if (!searchQuery.trim()) return snippets;
      
      const lowerQuery = searchQuery.toLowerCase();
      return snippets.filter(
        s => s.title.toLowerCase().includes(lowerQuery) || 
        s.content.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery) ||
        (s.description && s.description.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error filtering snippets:', error);
      return snippets;
    }
  }, [snippets, searchQuery]);

  // Group snippets by category
  const categorizedSnippets = useMemo(() => {
    try {
      const pinnedSnippets = filteredSnippets.filter(s => s.pinned);
      const categories = Array.from(new Set(filteredSnippets.map(s => s.category)));
      
      const result: { category: string; snippets: EnhancedSnippet[] }[] = [];
      
      // Add pinned category if there are pinned snippets
      if (pinnedSnippets.length > 0) {
        result.push({ category: "📌 Pinned", snippets: pinnedSnippets });
      }
      
      // Add regular categories
      categories.forEach(category => {
        const categorySnippets = filteredSnippets.filter(s => s.category === category);
        if (categorySnippets.length > 0) {
          result.push({ category, snippets: categorySnippets });
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error categorizing snippets:', error);
      return [];
    }
  }, [filteredSnippets]);

  const formatterGroups = useMemo(() => {
    try {
      // Group formatters by type for better organization
      return [
        { 
          name: "Headings", 
          formatters: formatters.filter(f => ['heading1', 'heading2', 'heading3'].includes(f.type)) 
        },
        { 
          name: "Text Styles", 
          formatters: formatters.filter(f => ['bold', 'italic', 'inlineCode'].includes(f.type)) 
        },
        { 
          name: "Code Blocks", 
          formatters: formatters.filter(f => ['codeBlock', 'jsonBlock', 'xmlBlock'].includes(f.type)) 
        },
        { 
          name: "Lists", 
          formatters: formatters.filter(f => ['list', 'numberedList'].includes(f.type)) 
        },
        {
          name: "Roles",
          formatters: formatters.filter(f => ['roleSystem', 'roleUser', 'roleAssistant'].includes(f.type))
        },
        {
          name: "Other",
          formatters: formatters.filter(f => 
            !['heading1', 'heading2', 'heading3', 'bold', 'italic', 'inlineCode', 
              'codeBlock', 'jsonBlock', 'xmlBlock', 'list', 'numberedList',
              'roleSystem', 'roleUser', 'roleAssistant'].includes(f.type))
        }
      ].filter(group => group.formatters.length > 0);
    } catch (error) {
      console.error('Error grouping formatters:', error);
      return [];
    }
  }, [formatters]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const toggleFormattersOnly = useCallback(() => {
    setShowFormattersOnly(prev => !prev);
  }, []);

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
        <div className="w-12 flex-shrink-0 bg-background border-r transition-all duration-300">
          <div className="flex flex-col items-center pt-3 gap-1">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleCollapsed}
                    className="mb-2"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Prompt Tools & Snippets</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Separator className="w-8" />
            
            <div className="py-2 flex flex-col gap-2 items-center">
              {formatters.slice(0, 8).map((formatter) => (
                <FormatButton 
                  key={formatter.id}
                  icon={formatter.icon}
                  label={formatter.label}
                  onClick={() => handleFormatClick(formatter)}
                  shortcut={formatter.shortcut}
                  description={formatter.description}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>
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

        {/* Search Bar - Using the new SearchBar component */}
        <SearchBar 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          onClear={clearSearch}
          inputRef={searchInputRef}
        />

        {/* Content Area */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Tabs for Formatters/Snippets - Redesigned with icons and fixed overflow */}
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
              <div className="p-3">
                {formatterGroups.map((group, idx) => (
                  <div key={group.name} className="mb-4">
                    <h4 className="text-xs font-medium mb-2 text-muted-foreground">{group.name}</h4>
                    <div className="grid grid-cols-4 gap-1">
                      {group.formatters.map((formatter) => (
                        <FormatButton 
                          key={formatter.id}
                          icon={formatter.icon}
                          label={formatter.label}
                          onClick={() => handleFormatClick(formatter)}
                          shortcut={formatter.shortcut}
                          description={formatter.description}
                        />
                      ))}
                    </div>
                    {idx < formatterGroups.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2">
                {categorizedSnippets.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No snippets found</p>
                    {searchQuery && (
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={clearSearch} 
                        className="mt-1 h-auto p-0"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                ) : (
                  categorizedSnippets.map(({ category, snippets }) => (
                    <CategorySection 
                      key={category} 
                      category={category} 
                      snippets={snippets} 
                      onInsert={onInsert}
                      onTogglePin={handleTogglePin}
                      defaultOpen={category.includes('Pinned') || searchQuery.length > 0}
                    />
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </motion.aside>
    </>
  );
};

export default PromptSnippetsSidebar;