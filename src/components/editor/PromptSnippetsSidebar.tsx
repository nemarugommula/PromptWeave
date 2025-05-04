import React, { useState, useEffect } from 'react';
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
  Search
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

// Storage keys for localStorage - matching the ones in TemplatesConfig
const FORMATTERS_STORAGE_KEY = 'promptweave-formatters';
const SNIPPETS_STORAGE_KEY = 'promptweave-snippets';
const SIDEBAR_STATE_KEY = 'prompt-snippets-sidebar-collapsed';

// Interface for formatter options
interface FormatOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  type: string;
  shortcut?: string;
  template: string;
}

// Default formatters matching the ones in TemplatesConfig
const DEFAULT_FORMATTERS: FormatOption[] = [
  { id: 'heading1', icon: <Heading1 className="h-4 w-4" />, label: "Heading 1", type: 'heading1', shortcut: "Ctrl+1", template: '\n# Heading 1\n' },
  { id: 'heading2', icon: <Heading2 className="h-4 w-4" />, label: "Heading 2", type: 'heading2', shortcut: "Ctrl+2", template: '\n## Heading 2\n' },
  { id: 'heading3', icon: <Hash className="h-4 w-4" />, label: "Heading 3", type: 'heading3', shortcut: "Ctrl+3", template: '\n### Heading 3\n' },
  { id: 'bold', icon: <Bold className="h-4 w-4" />, label: "Bold", type: 'bold', shortcut: "Ctrl+B", template: '**bold text**' },
  { id: 'italic', icon: <Italic className="h-4 w-4" />, label: "Italic", type: 'italic', shortcut: "Ctrl+I", template: '*italic text*' },
  { id: 'inlineCode', icon: <Code className="h-4 w-4" />, label: "Inline Code", type: 'inlineCode', shortcut: "Ctrl+`", template: '`code`' },
  { id: 'codeBlock', icon: <Code className="h-4 w-4" />, label: "Code Block", type: 'codeBlock', template: '\n```\ncode block\n```\n' },
  { id: 'jsonBlock', icon: <FileJson className="h-4 w-4" />, label: "JSON Block", type: 'jsonBlock', template: '\n```json\n{\n  \n}\n```\n' },
  { id: 'xmlBlock', icon: <FileCode className="h-4 w-4" />, label: "XML Block", type: 'xmlBlock', template: '\n```xml\n<root>\n  \n</root>\n```\n' },
  { id: 'list', icon: <List className="h-4 w-4" />, label: "Bullet List", type: 'list', template: '\n- List item 1\n- List item 2\n' },
  { id: 'numberedList', icon: <ListOrdered className="h-4 w-4" />, label: "Numbered List", type: 'numberedList', template: '\n1. First item\n2. Second item\n' },
  { id: 'quote', icon: <Quote className="h-4 w-4" />, label: "Quote", type: 'quote', template: '\n> quote\n' },
  { id: 'roleSystem', icon: <Cpu className="h-4 w-4" />, label: "Role: System", type: 'roleSystem', template: '\n# System\n' },
  { id: 'roleUser', icon: <User className="h-4 w-4" />, label: "Role: User", type: 'roleUser', template: '\n# User\n' },
  { id: 'roleAssistant', icon: <MessageSquare className="h-4 w-4" />, label: "Role: Assistant", type: 'roleAssistant', template: '\n# Assistant\n' },
  { id: 'tagBlock', icon: <Tag className="h-4 w-4" />, label: "Metadata Tag", type: 'tagBlock', template: '<!-- meta: key=value -->\n' },
  { id: 'search', icon: <Search className="h-4 w-4" />, label: "Find in text", type: 'search', shortcut: "Ctrl+F", template: '' },
];

interface FormatButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  shortcut?: string;
}

const FormatButton: React.FC<FormatButtonProps> = ({ icon, label, onClick, shortcut }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Toggle aria-label={`Toggle ${label}`} onClick={onClick}>
        {icon}
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>
      <p>{label}{shortcut ? ` (${shortcut})` : ''}</p>
    </TooltipContent>
  </Tooltip>
);

interface PromptSnippetsSidebarProps {
  onInsert: (content: string) => void;
  onFormat: (type: string) => void;
}

const PromptSnippetsSidebar: React.FC<PromptSnippetsSidebarProps> = ({ onInsert, onFormat }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [formatters, setFormatters] = useState<FormatOption[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  // Load collapse state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (stored !== null) {
      setCollapsed(JSON.parse(stored));
    }
  }, []);

  // Load formatters and snippets from localStorage
  useEffect(() => {
    // Load formatters
    const storedFormatters = localStorage.getItem(FORMATTERS_STORAGE_KEY);
    if (storedFormatters) {
      try {
        const parsedFormatters = JSON.parse(storedFormatters);
        // Apply icons to formatters (since React elements can't be serialized)
        const formattersWithIcons = parsedFormatters.map((formatter: FormatOption) => ({
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
        setSnippets(JSON.parse(storedSnippets));
      } catch (e) {
        console.error('Error parsing stored snippets:', e);
        setSnippets(DEFAULT_SNIPPETS);
      }
    } else {
      setSnippets(DEFAULT_SNIPPETS);
    }
  }, []);

  // Initialize open state for each category
  useEffect(() => {
    if (snippets.length > 0) {
      const cats = Array.from(new Set(snippets.map(s => s.category)));
      const initialState: Record<string, boolean> = {};
      cats.forEach(c => { initialState[c] = true; });
      setOpenCategories(initialState);
    }
  }, [snippets]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(next));
  };

  // Get icon component based on formatter type
  const getIconForType = (type: string) => {
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
  };

  // Handle format button click with template
  const handleFormatClick = (formatter: FormatOption) => {
    // Special case for search which doesn't insert text but triggers search
    if (formatter.type === 'search') {
      onFormat(formatter.type);
      return;
    }
    
    // For normal formatters, we insert the template
    onInsert(formatter.template);
  };

  // Group categories
  const categories = Array.from(new Set(snippets.map(s => s.category)));

  return (
    <aside className="flex flex-col bg-background border-r transition-width duration-300" style={{ width: collapsed ? 64 : 256 }}>
      <div className="flex items-center justify-between p-2 border-b">
        {!collapsed && <h3 className="text-sm font-semibold">Tools & Snippets</h3>}
        <button onClick={toggleCollapsed} className="p-1" title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Formatting Tools Section */}
      <div className="border-b p-2">
        {!collapsed && <h4 className="text-xs font-medium mb-2 text-muted-foreground">Formatting</h4>}
        <div className={collapsed ? "flex flex-col gap-2 items-center" : "grid grid-cols-4 gap-1"}>
          {formatters.map((formatter) => (
            <FormatButton 
              key={formatter.id}
              icon={formatter.icon}
              label={formatter.label}
              onClick={() => handleFormatClick(formatter)}
              shortcut={formatter.shortcut}
            />
          ))}
        </div>
      </div>

      {/* Snippets Section */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed && <h4 className="text-xs font-medium my-2 px-2 text-muted-foreground">Snippets</h4>}
        {categories.map(category => (
          <div key={category}>
            <button
              onClick={() => setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }))}
              className="w-full flex items-center justify-between px-3 py-1 text-xs font-medium hover:bg-secondary/50"
            >
              {!collapsed && <span>{category}</span>}
              {!collapsed && (
                openCategories[category]
                  ? <ChevronLeft className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {openCategories[category] && !collapsed && (
              <ul>
                {snippets.filter(s => s.category === category).map((snippet: Snippet) => (
                  <li key={snippet.id}>
                    <button
                      title={snippet.description}
                      onClick={() => onInsert(snippet.content)}
                      draggable
                      onDragStart={e => e.dataTransfer.setData('text/plain', snippet.content)}
                      className="w-full text-left px-4 py-1 text-xs hover:bg-secondary/30"
                    >
                      {snippet.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default PromptSnippetsSidebar;