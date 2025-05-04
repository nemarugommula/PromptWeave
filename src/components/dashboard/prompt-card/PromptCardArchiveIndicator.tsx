
import React from 'react';
import { Archive } from 'lucide-react';

export function PromptCardArchiveIndicator() {
  return (
    <div className="mb-3 flex items-center gap-1 text-muted-foreground">
      <Archive className="h-4 w-4" />
      <span className="text-xs">Archived</span>
    </div>
  );
}
