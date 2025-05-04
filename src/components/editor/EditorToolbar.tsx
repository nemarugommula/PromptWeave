
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
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
  Search,
  Save,
  History,
  ChevronDown,
  ChevronUp,
  Cpu,
  User,
  MessageSquare
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

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

interface EditorToolbarProps {
  onSave: () => void;
  onFormat: (type: string) => void;
  saving: boolean;
  wordCount: number;
  charCount: number;
  onToggleVersions: () => void;
  showVersions: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  onSave, 
  onFormat, 
  saving,
  wordCount,
  charCount,
  onToggleVersions,
  showVersions
}) => {
  const formatOptions = [
    { icon: <Heading1 className="h-4 w-4" />, label: "Heading 1", type: 'heading1', shortcut: "Ctrl+1" },
    { icon: <Heading2 className="h-4 w-4" />, label: "Heading 2", type: 'heading2', shortcut: "Ctrl+2" },
    { icon: <Hash className="h-4 w-4" />, label: "Heading 3", type: 'heading3', shortcut: "Ctrl+3" },
    { icon: <Bold className="h-4 w-4" />, label: "Bold", type: 'bold', shortcut: "Ctrl+B" },
    { icon: <Italic className="h-4 w-4" />, label: "Italic", type: 'italic', shortcut: "Ctrl+I" },
    { icon: <Code className="h-4 w-4" />, label: "Inline Code", type: 'inlineCode', shortcut: "Ctrl+`" },
    { icon: <Code className="h-4 w-4" />, label: "Code Block", type: 'codeBlock' },
    { icon: <FileJson className="h-4 w-4" />, label: "JSON Block", type: 'jsonBlock' },
    { icon: <FileCode className="h-4 w-4" />, label: "XML Block", type: 'xmlBlock' },
    { icon: <List className="h-4 w-4" />, label: "Bullet List", type: 'list' },
    { icon: <ListOrdered className="h-4 w-4" />, label: "Numbered List", type: 'numberedList' },
    { icon: <Quote className="h-4 w-4" />, label: "Quote", type: 'quote' },
    { icon: <Cpu className="h-4 w-4" />, label: "Role: System", type: 'roleSystem' },
    { icon: <User className="h-4 w-4" />, label: "Role: User", type: 'roleUser' },
    { icon: <MessageSquare className="h-4 w-4" />, label: "Role: Assistant", type: 'roleAssistant' },
    { icon: <Tag className="h-4 w-4" />, label: "Metadata Tag", type: 'tagBlock' }
  ];
  
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      {formatOptions.map(option => (
        <FormatButton 
          key={option.type}
          icon={option.icon}
          label={option.label}
          onClick={() => onFormat(option.type)}
          shortcut={option.shortcut}
        />
      ))}
      
      <Separator orientation="vertical" className="h-6" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleVersions}
              className="flex gap-1 items-center h-8"
            >
              <History className="h-4 w-4" />
              <span>Versions</span>
              {showVersions ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Version History</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <FormatButton 
        icon={<Search className="h-4 w-4" />}
        label="Find in text"
        onClick={() => {}}
        shortcut="Ctrl+F"
      />
      
      <div className="ml-auto flex items-center gap-4">
        <div className="text-xs text-muted-foreground">
          {wordCount} words | {charCount} chars
        </div>
        
        <Button onClick={onSave} disabled={saving} size="sm" className="gap-1">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
