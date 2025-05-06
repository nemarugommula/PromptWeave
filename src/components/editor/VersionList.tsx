import React from 'react';
import { format } from 'date-fns';
import { 
  ArrowLeftRight,
  History,
  Check,
  Clock,
  CircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { VersionSchema } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [hoveredVersion, setHoveredVersion] = React.useState<string | null>(null);

  // Sort versions by creation time (newest first)
  const sortedVersions = [...versions].sort((a, b) => b.created_at - a.created_at);

  // Generate version numbers (v1, v2, etc.) - oldest version gets v1
  const versionNumbers = React.useMemo(() => {
    const versionsByDate = [...versions].sort((a, b) => a.created_at - b.created_at);
    return versionsByDate.reduce<Record<string, string>>((acc, version, index) => {
      acc[version.id] = `v${index + 1}`;
      return acc;
    }, {});
  }, [versions]);

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
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground gap-1.5">
        <History className="h-8 w-8 opacity-20" />
        <div className="text-sm">No version history</div>
        <div className="text-xs opacity-70">Changes will appear here</div>
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
      <AnimatePresence>
        {selectedVersions.length === 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Button 
              variant="default" 
              size="sm" 
              className="w-full mb-1 text-xs gap-1 h-7 bg-primary/10 hover:bg-primary/20 text-primary"
              onClick={handleCompare}
            >
              <ArrowLeftRight className="h-3 w-3" />
              Compare Selected
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollArea className="w-full">
        <ul className="space-y-0.5">
          {sortedVersions.map((version) => {
            const isCurrentVersion = version.id === currentVersionId;
            const isSelected = selectedVersions.includes(version.id);
            const isHovered = hoveredVersion === version.id;
            const tokenCount = version.metadata?.tokens || getTokenCount(version.content);
            const timeAgo = formatTimeAgo(version.created_at);
            const previewText = version.content.trim().split('\n')[0] || '';
            const versionNumber = versionNumbers[version.id];
            
            return (
              <motion.li 
                key={version.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "py-1.5 px-2 cursor-pointer rounded-sm transition-all",
                  "border-l-2",
                  isCurrentVersion ? "bg-accent/50 border-l-primary" : 
                    isHovered ? "bg-accent/30 border-l-transparent" : 
                    "hover:bg-accent/20 border-l-transparent",
                  isSelected && "bg-accent/40"
                )}
                onClick={() => handleVersionSelect(version)}
                onMouseEnter={() => setHoveredVersion(version.id)}
                onMouseLeave={() => setHoveredVersion(null)}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium truncate flex-1">
                    {previewText || "Untitled version"}
                  </span>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "px-1 py-0 text-[10px] h-4 font-medium ml-auto shrink-0",
                      isCurrentVersion && "border-primary text-primary"
                    )}
                  >
                    {versionNumber}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 text-[10px]">
                  {/* Radio-like selection element */}
                  <div 
                    onClick={(e) => toggleVersionSelection(version.id, e)}
                    className={cn(
                      "h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                      isSelected 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground/50 hover:border-muted-foreground"
                    )}
                  >
                    {isSelected && (
                      <Check className="h-2 w-2 text-background" />
                    )}
                  </div>
                  
                  <span className="text-muted-foreground whitespace-nowrap">
                    {tokenCount} tokens
                  </span>
                  
                  {isCurrentVersion && (
                    <span className="text-primary text-[10px] font-medium flex items-center gap-0.5 whitespace-nowrap">
                      <CircleIcon className="h-1.5 w-1.5 fill-primary" />
                      Current
                    </span>
                  )}
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-muted-foreground ml-auto flex items-center gap-0.5 whitespace-nowrap">
                        <Clock className="h-2.5 w-2.5" />
                        {timeAgo}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="text-xs">
                      Created on {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default VersionList;
