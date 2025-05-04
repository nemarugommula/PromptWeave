
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Import, ExternalLink } from "lucide-react";

interface DashboardHeaderProps {
  onCreatePrompt: (categoryId?: string) => Promise<string | null>;
  onImportDialogOpen: () => void;
  onExportAll: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onCreatePrompt,
  onImportDialogOpen,
  onExportAll,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row with title and primary actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold  bg-clip-text">Workspace</h1>
        
        <div className="flex gap-2">
          {/* Import Button */}
          <Button 
            variant="outline" 
            onClick={onImportDialogOpen} 
            className="gap-2"
          >
            <Import className="h-4 w-4" /> Import
          </Button>
          
          {/* Export All Button */}
          <Button 
            variant="outline" 
            onClick={onExportAll} 
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" /> Export All
          </Button>
          
          <Button onClick={() => onCreatePrompt()} className="gap-2">
            <Plus className="h-4 w-4" /> Create
          </Button>
        </div>
      </div>
    </div>
  );
};
