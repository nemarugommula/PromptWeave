import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  ChevronLeft,
  ChevronRight, 
  History,
  ChevronDown,
  ChevronUp,
  FileText,
  AlignLeft,
  BarChart2,
  AlignJustify,
  Cpu,
  FileType,
  Hash,
  BarChart,
  Save,
  Clock,
  Sparkles,
  LampDesk,
  Gauge,
  FileSymlink,
  ChevronDownSquare,
  ChevronRightSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const SIDEBAR_STATE_KEY = 'utilities-sidebar-collapsed';
const VERSIONS_STATE_KEY = 'utilities-sidebar-versions-expanded';
const PROMPT_STATS_STATE_KEY = 'utilities-sidebar-prompt-stats-expanded';

interface UtilitiesSidebarProps {
  content: string;
  wordCount: number;
  charCount: number;
  selectedModel: string;
  lastSavedTime?: number;
  onNavigate?: (position: number) => void;
  onSave: () => void;
  saving: boolean;
  onToggleVersions: () => void;
  showVersions: boolean;
  versionCount: number;
  children?: React.ReactNode;
}

// Token usage progress bar component
interface TokenProgressBarProps {
  percentage: number;
  compact?: boolean;
}

const TokenProgressBar: React.FC<TokenProgressBarProps> = ({ percentage, compact }) => {
  // Determine color based on percentage
  const barColor = useMemo(() => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-primary';
  }, [percentage]);

  return (
    <div className="w-full">
      {!compact && (
        <div className="flex justify-between text-xs mb-1">
          <div className="flex items-center">
            <Gauge className="h-3.5 w-3.5 mr-1" />
            <span>Token Usage</span>
          </div>
          <span className={cn(
            percentage >= 100 ? 'text-red-500 font-semibold' : 
            percentage >= 80 ? 'text-yellow-600' : 'text-primary'
          )}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${barColor}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }} 
        />
      </div>
    </div>
  );
};

// Document outline tree structure
interface OutlineHeading {
  level: number;
  text: string;
  index: number;
  tokenCount?: number;
  children: OutlineHeading[];
}

// Component for document outline with tree structure
interface DocumentOutlineProps {
  headings: { level: number; text: string; index: number; tokenCount?: number }[];
  onNavigate?: (position: number) => void;
  currentPosition?: number;
}

const OutlineTree: React.FC<DocumentOutlineProps> = ({ headings, onNavigate, currentPosition }) => {
  // Convert flat headings list to hierarchical tree structure
  const outlineTree = useMemo(() => {
    const tree: OutlineHeading[] = [];
    const levelMap: OutlineHeading[] = [];

    for (const heading of headings) {
      const node: OutlineHeading = {
        ...heading,
        children: []
      };

      // Find the parent level for this heading
      // If it's a level 1 heading, it goes at the root
      // Otherwise, look for the most recent heading with a lower level
      if (heading.level === 1) {
        tree.push(node);
      } else {
        // Find the closest parent (heading with lower level)
        let parentLevel = heading.level - 1;
        while (parentLevel > 0) {
          if (levelMap[parentLevel]) {
            levelMap[parentLevel].children.push(node);
            break;
          }
          parentLevel--;
        }
        
        // If no parent found, add to root
        if (parentLevel === 0) {
          tree.push(node);
        }
      }

      // Update the level map with this node
      levelMap[heading.level] = node;
      
      // Clear any deeper levels as they can't be parents to subsequent nodes
      for (let i = heading.level + 1; i < levelMap.length; i++) {
        levelMap[i] = undefined as any;
      }
    }
    
    return tree;
  }, [headings]);

  return (
    <ScrollArea className="max-h-[250px] pr-2">
      <div className="space-y-1">
        {outlineTree.map((heading, index) => (
          <OutlineNode 
            key={index} 
            heading={heading} 
            onNavigate={onNavigate} 
            currentPosition={currentPosition}
            depth={0}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

interface OutlineNodeProps {
  heading: OutlineHeading;
  onNavigate?: (position: number) => void;
  currentPosition?: number;
  depth: number;
}

const OutlineNode: React.FC<OutlineNodeProps> = ({ heading, onNavigate, currentPosition, depth }) => {
  const [expanded, setExpanded] = useState(true);
  const isActive = useMemo(() => {
    if (!currentPosition || currentPosition < heading.index) return false;
    // Check if this is the active section (between this heading and the next)
    const isLastInSection = !heading.children.length;
    if (isLastInSection) return true;
    
    // Check if position is within this section but before any children
    if (heading.children.length > 0) {
      const firstChildIndex = heading.children[0].index;
      return currentPosition < firstChildIndex;
    }
    
    return true;
  }, [currentPosition, heading]);

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => !prev);
  }, []);

  // Get heading icon based on level
  const HeadingIcon = useMemo(() => {
    return Hash;
  }, []);

  // Handle click to navigate
  const handleClick = useCallback(() => {
    if (onNavigate) {
      onNavigate(heading.index);
    }
  }, [onNavigate, heading.index]);

  return (
    <div className="outline-node">
      <div 
        className={cn(
          "flex items-center py-1 rounded-sm px-1 gap-1 transition-colors relative group",
          isActive && "bg-primary/10",
          "hover:bg-muted/70 cursor-pointer"
        )}
        style={{ marginLeft: depth * 12 }}
        onClick={handleClick}
      >
        {/* Indicator line for active section */}
        {isActive && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full"
            aria-hidden="true"
          />
        )}
        
        {/* Expand/collapse button for nodes with children */}
        {heading.children.length > 0 && (
          <button 
            onClick={toggleExpanded}
            className="h-4 w-4 flex-shrink-0 hover:bg-muted-foreground/10 rounded-sm transition-colors"
            aria-label={expanded ? "Collapse section" : "Expand section"}
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        )}
        
        {/* Section with no children gets an offset */}
        {heading.children.length === 0 && (
          <div className="w-4 flex-shrink-0" />
        )}
        
        {/* Heading icon */}
        <HeadingIcon 
          className={cn(
            "h-3.5 w-3.5 flex-shrink-0", 
            heading.level === 1 
              ? "text-primary" 
              : heading.level === 2 
                ? "text-primary/80" 
                : "text-muted-foreground"
          )} 
        />
        
        {/* Heading text */}
        <span 
          className={cn(
            "truncate text-xs",
            heading.level === 1 ? "font-medium" : "",
            isActive ? "text-primary" : ""
          )}
        >
          {heading.text}
        </span>
        
        {/* Token count badge that shows on hover */}
        {heading.tokenCount && (
          <span 
            className={cn(
              "ml-auto text-[10px] opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded-full bg-muted-foreground/10",
              isActive ? "text-primary/80" : "text-muted-foreground"
            )}
          >
            {heading.tokenCount}
          </span>
        )}
      </div>
      
      {/* Children */}
      <AnimatePresence initial={false}>
        {expanded && heading.children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 mt-0.5">
              {heading.children.map((child, idx) => (
                <OutlineNode 
                  key={idx} 
                  heading={child} 
                  onNavigate={onNavigate} 
                  currentPosition={currentPosition}
                  depth={depth + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UtilitiesSidebar: React.FC<UtilitiesSidebarProps> = ({ 
  content, 
  wordCount, 
  charCount, 
  selectedModel, 
  lastSavedTime, 
  onNavigate,
  onSave,
  saving,
  onToggleVersions,
  showVersions, 
  versionCount,
  children 
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [promptStatsExpanded, setPromptStatsExpanded] = useState<boolean>(true);

  // Load collapse state
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (stored !== null) {
      setCollapsed(JSON.parse(stored));
    }
  }, []);
  
  // Load prompt stats expanded state
  useEffect(() => {
    const stored = localStorage.getItem(PROMPT_STATS_STATE_KEY);
    if (stored !== null) {
      setPromptStatsExpanded(JSON.parse(stored));
    }
  }, []);
  
  // Check if this is first open and auto-expand version list
  useEffect(() => {
    if (isFirstRender) {
      const storedVersionState = localStorage.getItem(VERSIONS_STATE_KEY);
      // If this is the first time (no stored state), show versions
      if (storedVersionState === null && !showVersions) {
        onToggleVersions();
      }
      setIsFirstRender(false);
    }
  }, [isFirstRender, showVersions, onToggleVersions]);

  // Save version list state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(VERSIONS_STATE_KEY, JSON.stringify(showVersions));
  }, [showVersions]);

  // Save prompt stats expanded state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(PROMPT_STATS_STATE_KEY, JSON.stringify(promptStatsExpanded));
  }, [promptStatsExpanded]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(next));
  };
  
  // Handler for toggling versions that also uncollapses the sidebar
  const handleToggleVersions = () => {
    // If sidebar is collapsed, uncollapse it
    if (collapsed) {
      setCollapsed(false);
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(false));
    }
    
    // Call the original onToggleVersions function
    onToggleVersions();
  };
  
  // Handler for toggling prompt stats section
  const togglePromptStats = () => {
    setPromptStatsExpanded(!promptStatsExpanded);
  };

  // Compute lineCount and tokenCount
  const lineCount = useMemo(() => content.split(/\r?\n/).length, [content]);
  // Approximate token count (avg 4 chars per token)
  const tokenCount = useMemo(() => Math.max(1, Math.round(charCount / 4)), [charCount]);

  // Model compatibility warning
  const MODEL_LIMITS: Record<string, number> = {
    'gpt-4o': 8192,
    'gpt-4o-mini': 4096,
    'gpt-4.5-preview': 128000,
  };
  const modelLimit = MODEL_LIMITS[selectedModel] ?? 0;
  const warningThreshold = modelLimit ? modelLimit * 0.9 : 0;
  const showWarning = modelLimit > 0 && tokenCount >= warningThreshold;
  
  // Calculate token usage percentage
  const tokenPercentage = useMemo(() => {
    if (!modelLimit) return 0;
    return (tokenCount / modelLimit) * 100;
  }, [tokenCount, modelLimit]);

  // Extract outline headings
  const outline = useMemo(() => {
    const matches = Array.from(content.matchAll(/^(#{1,6})\s+(.*)$/gm));
    return matches.map(match => ({
      level: match[1].length,
      text: match[2],
      index: match.index ?? 0
    }));
  }, [content]);

  // Section stats: tokens per section and longest
  const sections = useMemo(() => {
    return outline.map((item, idx) => {
      const start = item.index;
      const end = idx + 1 < outline.length ? outline[idx + 1].index! : content.length;
      const sectionText = content.substring(start, end);
      const secTokens = Math.max(1, Math.round(sectionText.length / 4));
      return { ...item, tokenCount: secTokens };
    });
  }, [outline, content]);
  const maxSectionTokens = sections.reduce((max, s) => Math.max(max, s.tokenCount), 0);

  return (
    <aside className="flex flex-col bg-background border-l transition-width duration-300" style={{ width: collapsed ? 32 : 256 }}>
      <div className="flex items-center justify-between border-b">
        {!collapsed && <h3 className="text-sm p-2 font-semibold">Outline</h3>}
        <button onClick={toggleCollapsed} className="p-1" title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Top bar (collapsed view only shows version toggle) */}
      <div className="border-b p-2 flex items-center justify-center">
        {collapsed ? (
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={handleToggleVersions}>
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {showVersions ? "Hide Versions" : "Show Versions"}
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-1">
            <div className="flex items-center ">
            <History className="h-4 w-4" />              
            <span className="text-xs font-medium ml-1">version </span>
            <Badge className=" ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                {versionCount}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleVersions}
                className="h-5 w-5 ml-auto p-0"
              >
                {showVersions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>
            {showVersions && (
              <div className="max-h-40 overflow-y-auto border p-1 rounded ">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Minimized view: show compact metrics */}
      {collapsed && (
        <div className="flex flex-col items-center space-y-2 flex-1 p-2 text-xs">
          {modelLimit > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full py-1">
                  <TokenProgressBar percentage={tokenPercentage} compact={true} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                {tokenCount.toLocaleString()} / {modelLimit.toLocaleString()} tokens ({tokenPercentage.toFixed(0)}%)
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">🧠</span>
            </TooltipTrigger>
            <TooltipContent side="left">Tk: {tokenCount}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">📄</span>
            </TooltipTrigger>
            <TooltipContent side="left">Ln: {lineCount}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">📝</span>
            </TooltipTrigger>
            <TooltipContent side="left">Wd: {wordCount}</TooltipContent>
          </Tooltip>
        </div>
      )}
      
      {/* Expanded view: detailed breakdown */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
          <div>
            <div className="font-medium mb-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center">
                <FileText className="h-3.5 w-3.5 mr-1" />
                <span>Prompt Stats</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={togglePromptStats}
                className="h-5 w-5 p-0"
              >
                {promptStatsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>
            
            {promptStatsExpanded && (
              <>
                {/* Prompt Stats Grid */}
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="flex flex-col bg-muted/50 p-1.5 rounded-md border border-border/40">
                    <div className="flex items-center text-[9px] text-muted-foreground mb-0.5">
                      <AlignLeft className="h-2.5 w-2.5 mr-0.5" />
                      <span>WORDS</span>
                    </div>
                    <div className="font-mono text-xs">{wordCount.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex flex-col bg-muted/50 p-1.5 rounded-md border border-border/40">
                    <div className="flex items-center text-[9px] text-muted-foreground mb-0.5">
                      <BarChart2 className="h-2.5 w-2.5 mr-0.5" />
                      <span>CHARS</span>
                    </div>
                    <div className="font-mono text-xs">{charCount.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex flex-col bg-muted/50 p-1.5 rounded-md border border-border/40">
                    <div className="flex items-center text-[9px] text-muted-foreground mb-0.5">
                      <AlignJustify className="h-2.5 w-2.5 mr-0.5" />
                      <span>LINES</span>
                    </div>
                    <div className="font-mono text-xs">{lineCount.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex flex-col bg-muted/50 p-1.5 rounded-md border border-border/40">
                    <div className="flex items-center text-[9px] text-muted-foreground mb-0.5">
                      <Cpu className="h-2.5 w-2.5 mr-0.5" />
                      <span>TOKENS</span>
                    </div>
                    <div className={cn(
                      "font-mono text-xs",
                      tokenPercentage >= 100 ? "text-red-500" : 
                      tokenPercentage >= 80 ? "text-yellow-600" : ""
                    )}>{tokenCount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Token Usage Bar */}
                {modelLimit > 0 && (
                  <>
                    <TokenProgressBar percentage={tokenPercentage} />
                    <div className="mt-1 text-xs flex justify-between w-full">
                      <span className="text-muted-foreground">
                        {tokenCount.toLocaleString()} / {modelLimit.toLocaleString()} tokens
                      </span>
                      {tokenPercentage >= 80 && (
                        <span className={cn(
                          "text-right",
                          tokenPercentage >= 100 ? 'text-red-500 font-semibold' : 'text-yellow-600'
                        )}>
                          {tokenPercentage >= 100 ? 'Limit reached' : 'Approaching limit'}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className='border-b border-t py-2'>
            <div className="font-medium mb-2 flex items-center">
              <FileType className="h-4 w-4 mr-1.5" />
              <span>Document Outline</span>
            </div>
            <OutlineTree 
              headings={outline} 
              onNavigate={onNavigate} 
            />
          </div>
          <div className='border-b pb-2'>
            <div className="font-medium mb-2 flex items-center">
              <BarChart className="h-4 w-4 mr-1.5" />
              <span>Section Stats</span>
            </div>
            <div className="overflow-hidden rounded-md border border-border/40 bg-muted/30">
              {sections.map((sec, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "px-2 py-1 flex justify-between items-center text-xs hover:bg-muted/70 transition-colors", 
                    sec.tokenCount === maxSectionTokens ? 'bg-primary/10' : '',
                    idx !== sections.length - 1 ? "border-b border-border/20" : ""
                  )}
                >
                  <div className="flex items-center gap-1.5 truncate max-w-[75%]">
                    <div style={{ marginLeft: Math.max(0, (sec.level - 1) * 4) }} className="flex-shrink-0">
                      <Hash className={cn(
                        "h-3 w-3", 
                        sec.tokenCount === maxSectionTokens ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <span className={cn("truncate", sec.tokenCount === maxSectionTokens ? "text-primary font-medium" : "")}>{sec.text}</span>
                  </div>
                  <div className={cn(
                    "font-mono text-right",
                    sec.tokenCount === maxSectionTokens ? "text-primary font-medium" : "text-muted-foreground"
                  )}>{sec.tokenCount}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium mb-2 flex items-center">
              <Save className="h-4 w-4 mr-1.5" />
              <span>Last Saved</span>
            </div>
            <div className="bg-muted/50 rounded-md border border-border/40 p-2 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="text-xs font-medium">
                {lastSavedTime ? new Date(lastSavedTime).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>Suggestions</span>
              <Badge variant="outline" className="ml-1.5 text-[9px] py-0 h-4">Phase 2</Badge>
            </div>
            <div className="bg-muted/30 rounded-md border border-border/40 border-dashed p-2 flex items-center justify-center">
              <div className="text-muted-foreground text-xs flex items-center gap-1.5">
                <LampDesk className="h-3.5 w-3.5" />
                <span>Coming soon...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default UtilitiesSidebar;