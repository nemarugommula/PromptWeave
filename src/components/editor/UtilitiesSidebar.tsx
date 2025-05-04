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

const SIDEBAR_STATE_KEY = 'utilities-sidebar-collapsed';

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
  children?: React.ReactNode;
}

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
  children 
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Load collapse state
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (stored !== null) {
      setCollapsed(JSON.parse(stored));
    }
  }, []);

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
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Version History</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleVersions}
                className="h-6 w-6"
              >
                {showVersions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>
            {showVersions && (
              <div className="max-h-40 overflow-y-auto border rounded p-1 mt-2">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Minimized view: show compact metrics */}
      {collapsed && (
        <div className="flex flex-col items-center space-y-2 flex-1 p-2 text-xs">
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
          {showWarning && (
            <div className="flex items-center text-yellow-600 font-medium">
              <span className="mr-1">⚠</span>
              <span>Approaching {selectedModel} limit: {modelLimit.toLocaleString()}</span>
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