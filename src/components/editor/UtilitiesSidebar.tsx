import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft,
  ChevronRight, 
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SIDEBAR_STATE_KEY = 'utilities-sidebar-collapsed';
const VERSIONS_STATE_KEY = 'utilities-sidebar-versions-expanded';

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
          <span>Token Usage</span>
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

  // Load collapse state
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (stored !== null) {
      setCollapsed(JSON.parse(stored));
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
          {modelLimit > 0 && (
            <div className="py-1">
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
            </div>
          )}
          <div>
            <div className="font-medium mb-1">Prompt stats</div>
            <div className="grid grid-cols-2 gap-2">
              <div>Words<span className="float-right font-mono">{wordCount}</span></div>
              <div>Chars<span className="float-right font-mono">{charCount}</span></div>
              <div>Lines<span className="float-right font-mono">{lineCount}</span></div>
              <div>Tokens<span className="float-right font-mono">{tokenCount}</span></div>
            </div>
          </div>
          <div className='border-b border-t py-2'>
            <div className="font-medium mb-1">Document outline</div>
            <ul className="space-y-1">
              {outline.map((item, idx) => (
                <li key={idx} className="cursor-pointer hover:text-primary"
                  style={{ marginLeft: (item.level - 1) * 8 }}
                  onClick={() => onNavigate && onNavigate(item.index)}>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className='border-b pb-2'>
            <div className="font-medium mb-1">Section Stats</div>
            <ul className="space-y-1">
              {sections.map((sec, idx) => (
                <li key={idx} className={sec.tokenCount === maxSectionTokens ? 'font-semibold text-primary' : ''}>
                  <span style={{ marginLeft: (sec.level - 1) * 8 }}>{sec.text}</span>
                  <span className="float-right font-mono">{sec.tokenCount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium mb-1">Last Saved</div>
            <div className="text-muted-foreground text-xxs">
              {lastSavedTime ? new Date(lastSavedTime).toLocaleString() : 'N/A'}
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Suggestions (Phase 2)</div>
            <div className="text-muted-foreground text-xxs">Coming soon...</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default UtilitiesSidebar;