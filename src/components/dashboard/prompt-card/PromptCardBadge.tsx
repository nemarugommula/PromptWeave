
import React from 'react';
import { cn } from "@/lib/utils";

interface PromptCardBadgeProps {
  color?: string;
  children: React.ReactNode;
}

export function PromptCardBadge({ color, children }: PromptCardBadgeProps) {
  return (
    <span 
      className="text-xs px-2 py-1 rounded" 
      style={{ 
        backgroundColor: color || '#E5DEFF',
        color: '#555' 
      }}
    >
      {children}
    </span>
  );
}
