
import React from 'react';
import { VersionSchema } from '@/lib/db/schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiffViewerProps {
  oldVersion: VersionSchema;
  newVersion: VersionSchema;
  onClose: () => void;
  className?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  oldVersion,
  newVersion,
  onClose,
  className
}) => {
  // Simple algorithm to highlight differences
  const findDifferences = (oldText: string, newText: string) => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    const oldResult: Array<{ text: string; status: 'unchanged' | 'removed' | 'added' }> = [];
    const newResult: Array<{ text: string; status: 'unchanged' | 'removed' | 'added' }> = [];
    
    // Find common prefix and suffix lines
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      // If we've reached the end of one array, add remaining lines from the other
      if (i >= oldLines.length) {
        newResult.push({ text: newLines[i], status: 'added' });
        continue;
      }
      if (i >= newLines.length) {
        oldResult.push({ text: oldLines[i], status: 'removed' });
        continue;
      }
      
      // Compare lines
      if (oldLines[i] === newLines[i]) {
        oldResult.push({ text: oldLines[i], status: 'unchanged' });
        newResult.push({ text: newLines[i], status: 'unchanged' });
      } else {
        oldResult.push({ text: oldLines[i], status: 'removed' });
        newResult.push({ text: newLines[i], status: 'added' });
      }
    }
    
    return {
      oldResult,
      newResult
    };
  };
  
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };
  
  const { oldResult, newResult } = findDifferences(oldVersion.content, newVersion.content);
  
  return (
    <div className={cn("flex flex-col h-full border rounded-md bg-background", className)}>
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-lg font-medium">Version Comparison</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-0 flex-1">
        {/* Left side - old version */}
        <div className="border-r h-full flex flex-col">
          <div className="p-2 border-b">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {formatDate(oldVersion.created_at)}
              </div>
              <Badge variant="outline">
                {oldVersion.metadata?.words || 0} words
              </Badge>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
              {oldResult.map((line, i) => (
                <div 
                  key={i}
                  className={cn(
                    "py-1 px-2 -mx-2",
                    line.status === 'removed' ? "bg-red-500/10 text-red-600" : ""
                  )}
                >
                  {line.text || "\n"}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </div>
        
        {/* Right side - new version */}
        <div className="h-full flex flex-col">
          <div className="p-2 border-b">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {formatDate(newVersion.created_at)}
              </div>
              <Badge variant="outline">
                {newVersion.metadata?.words || 0} words
              </Badge>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
              {newResult.map((line, i) => (
                <div 
                  key={i}
                  className={cn(
                    "py-1 px-2 -mx-2",
                    line.status === 'added' ? "bg-green-500/10 text-green-600" : ""
                  )}
                >
                  {line.text || "\n"}
                </div>
              ))}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;
