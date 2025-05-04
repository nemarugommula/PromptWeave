
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";

interface EmptyStateProps {
  onCreatePrompt: () => Promise<string | null>;
  searchQuery: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreatePrompt,
  searchQuery,
  icon = <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />,
  title = "No prompts found",
  description,
}) => {
  const defaultDescription = searchQuery 
    ? "No prompts match your search criteria." 
    : "Get started by creating your first prompt.";

  return (
    <div className="text-center py-16">
      {icon}
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">
        {description || defaultDescription}
      </p>
      {!searchQuery && (
        <Button onClick={() => onCreatePrompt()}>
          <Plus className="h-4 w-4 mr-2" /> Create New Prompt
        </Button>
      )}
    </div>
  );
};
