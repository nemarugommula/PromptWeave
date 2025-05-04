
import React from 'react';
import { Calendar } from 'lucide-react';

interface PromptCardDateProps {
  timestamp: number;
}

export function PromptCardDate({ timestamp }: PromptCardDateProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Calendar className="h-3 w-3 mr-1" />
      <span>Last updated: {formatDate(timestamp)}</span>
    </div>
  );
}
