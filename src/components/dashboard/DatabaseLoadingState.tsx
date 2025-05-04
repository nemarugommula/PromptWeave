
import React from 'react';
import { RefreshCw } from 'lucide-react';

export const DatabaseLoadingState: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin mb-6">
          <RefreshCw className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-xl font-medium mb-2">Loading..</h2>
      </div>
    </div>
  );
};
