import React from 'react';
import { PromptCardArchiveIndicator } from './PromptCardArchiveIndicator';
import { PromptCardTitle } from './PromptCardTitle';
import { PromptCardBadge } from './PromptCardBadge';
import { motion } from 'framer-motion';

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
    <div className="p-6 pt-4 flex flex-col h-[180px]">
      {archived && <PromptCardArchiveIndicator />}
      
      <PromptCardTitle title={name} />
      
      {categoryName && (
        <motion.div 
          className="mb-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PromptCardBadge color={categoryColor}>
            {categoryName}
          </PromptCardBadge>
        </motion.div>
      )}
      
      <div className="flex-grow overflow-hidden">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {content || "No content"}
        </p>
      </div>
    </div>
  );
}
