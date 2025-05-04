
import React from 'react';
import { format } from 'date-fns';
import { 
  Clock, 
  Check, 
  ChevronRight, 
  ArrowLeftRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { VersionSchema } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

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

  const toggleVersionSelection = (versionId: string) => {
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

  if (!versions || versions.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        No previous versions available
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-2 border-b">
        <h3 className="text-sm font-medium">Version History</h3>
        {selectedVersions.length === 2 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 text-xs gap-1"
            onClick={handleCompare}
          >
            <ArrowLeftRight className="h-3 w-3" />
            Compare Selected Versions
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {sortedVersions.map((version) => {
            const isCurrentVersion = version.id === currentVersionId;
            const isSelected = selectedVersions.includes(version.id);
            const wordCount = version.metadata?.words || 0;
            const date = new Date(version.created_at);
            
            return (
              <div 
                key={version.id}
                className={cn(
                  "rounded-md p-2 cursor-pointer flex items-center gap-2",
                  isCurrentVersion ? "bg-accent" : "hover:bg-accent/50",
                  isSelected && "border border-primary"
                )}
                onClick={() => handleVersionSelect(version)}
              >
                <div className="flex-shrink-0">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {format(date, 'MMM d, yyyy h:mm a')}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {wordCount} words
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground truncate mt-1">
                    {version.content.substring(0, 50)}
                    {version.content.length > 50 ? "..." : ""}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {isCurrentVersion && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVersionSelection(version.id);
                    }}
                  >
                    <div className={cn(
                      "h-4 w-4 rounded-full border",
                      isSelected ? "bg-primary border-primary" : "bg-transparent"
                    )} />
                  </Button>
                  
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VersionList;
