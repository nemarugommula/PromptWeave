
import React from 'react';
import { PromptCardArchiveIndicator } from './PromptCardArchiveIndicator';
import { PromptCardTitle } from './PromptCardTitle';
import { PromptCardBadge } from './PromptCardBadge';

interface PromptCardContentProps {
  name: string;
  content: string;
  categoryName?: string;
  categoryColor?: string;
  archived?: boolean;
}

export function PromptCardContent({
  name,
  content,
  categoryName,
  categoryColor,
  archived
}: PromptCardContentProps) {
  return (
    <div className="p-6">
      {archived && <PromptCardArchiveIndicator />}
      
      <PromptCardTitle title={name} />
      
      {categoryName && (
        <div className="mb-3">
          <PromptCardBadge color={categoryColor}>
            {categoryName}
          </PromptCardBadge>
        </div>
      )}
      
      <p className="text-muted-foreground line-clamp-2 text-sm h-10">
        {content || "No content"}
      </p>
    </div>
  );
}
