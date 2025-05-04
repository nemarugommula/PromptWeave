
import React from 'react';
import { FileText } from 'lucide-react';

interface PromptCardTitleProps {
  title: string;
}

export function PromptCardTitle({ title }: PromptCardTitleProps) {
  return (
    <div className="flex items-center mb-3 gap-2">
      <FileText className="h-5 w-5 text-muted-foreground" />
      <h3 className="font-semibold text-lg truncate">{title}</h3>
    </div>
  );
}
