
import React from "react";
import { RefreshCw } from "lucide-react";

interface EditorLoadingProps {
  message?: string;
  description?: string;
}

const EditorLoading: React.FC<EditorLoadingProps> = ({ 
  message = "Loading Editor", 
  description = "Please wait while we load your content..." 
}) => {
  return (
    <div className="container mx-auto p-4 max-w-6xl h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="animate-spin mb-6">
          <RefreshCw className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-xl font-medium mb-2">{message}</h2>
        <p className="text-muted-foreground mb-2">{description}</p>
      </div>
    </div>
  );
};

export default EditorLoading;
