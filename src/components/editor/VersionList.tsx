import React from 'react';
import { format } from 'date-fns';
import { 
  Clock, 
  Check, 
  ChevronRight, 
  ArrowLeftRight,
  CircleDot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { VersionSchema } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface VersionListProps {
  versions: VersionSchema[];
  currentVersionId?: string;
  onSelectVersion: (version: VersionSchema) => void;
  onCompareVersions: (version1: VersionSchema, version2: VersionSchema) => void;
  className?: string;
}

export const VersionList: React.FC<VersionListProps> = ({ 
  versions, 
  currentVersionId,
  onSelectVersion,
  onCompareVersions,
  className
}) => {
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);

  // Sort versions by creation time (newest first)
  const sortedVersions = [...versions].sort((a, b) => b.created_at - a.created_at);

  const handleVersionSelect = (version: VersionSchema) => {
    onSelectVersion(version);
  };

  const toggleVersionSelection = (versionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else {
      // Allow only 2 selections at a time
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, versionId]);
      } else {
        // Replace the oldest selection
        setSelectedVersions([selectedVersions[1], versionId]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      const version1 = versions.find(v => v.id === selectedVersions[0]);
      const version2 = versions.find(v => v.id === selectedVersions[1]);
      
      if (version1 && version2) {
        onCompareVersions(version1, version2);
      }
    }
  };

  // Calculate token count - approximation based on character count (4 chars per token)
  const getTokenCount = (content: string) => {
    return Math.max(1, Math.round(content.length / 4));
  };

  if (!versions || versions.length === 0) {
    return (
      <div className={cn("p-1 text-center text-muted-foreground text-xs", className)}>
        No versions
      </div>
    );
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Less than 1 minute
    if (diff < 60000) return 'just now';
    
    // Less than 1 hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    
    // Format as date
    return format(new Date(timestamp), 'MM/dd/yy');
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {selectedVersions.length === 2 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full py-1 text-xs gap-1 h-auto hover:bg-accent"
          onClick={handleCompare}
        >
          <ArrowLeftRight className="h-3 w-3" />
          Compare
        </Button>
      )}
      
      <ScrollArea className="w-full">
        <ul className="space-y-0.5 text-xs pt-1">
          {sortedVersions.map((version) => {
            const isCurrentVersion = version.id === currentVersionId;
            const isSelected = selectedVersions.includes(version.id);
            const tokenCount = version.metadata?.tokens || getTokenCount(version.content);
            const timeAgo = formatTimeAgo(version.created_at);
            const previewText = version.content.trim().split('\n')[0] || '';
            
            return (
              <li 
                key={version.id}
                className={cn(
                  "py-1 px-1.5 cursor-pointer flex items-center gap-1.5 rounded",
                  isCurrentVersion ? "bg-accent" : "hover:bg-accent/50",
                  isSelected && "border-l-2 border-primary pl-1"
                )}
                onClick={() => handleVersionSelect(version)}
              >
                {isCurrentVersion ? (
                  <CircleDot className="h-2.5 w-2.5 text-primary flex-shrink-0" />
                ) : (
                  <div 
                    className={cn(
                      "h-2.5 w-2.5 rounded-full border flex-shrink-0", 
                      isSelected ? "bg-primary border-primary" : "border-muted"
                    )}
                    onClick={(e) => toggleVersionSelection(version.id, e)}
                  />
                )}
                
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between w-full gap-1">
                    <span className="font-medium truncate max-w-[70%]" title={previewText}>
                      {previewText.substring(0, 25)}
                      {previewText.length > 25 ? "..." : ""}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {timeAgo}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{tokenCount} tokens</span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default VersionList;
